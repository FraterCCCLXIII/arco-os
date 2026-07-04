"""
Deterministic template renderer. Takes a validated TemplateSelection
(already checked against selection_schema.json) plus real data records and
produces HTML. The model never touches this step's output directly — it
only supplied the template_id + slot_mapping, both already validated as
referring to real manifest fields/actions.
"""
from html import escape


VERB_LABELS = {
    "create": "Create",
    "update": "Edit",
    "delete": "Delete",
    "complete": "Complete",
    "read": "Open",
    "custom": "Run",
}

STATUS_TONES = {
    "open": "neutral",
    "in_progress": "info",
    "active": "info",
    "planning": "neutral",
    "blocked": "warn",
    "done": "success",
    "low": "neutral",
    "medium": "info",
    "high": "warn",
    "critical": "danger",
}


def render(
    template_id: str,
    slot_mapping: dict,
    entity_fields: dict,
    records: list[dict],
    device_class: str,
    actions: list[dict] | None = None,
) -> str:
    action_map = {a["action_id"]: a for a in (actions or [])}

    if template_id == "list_view":
        return _render_list(slot_mapping, entity_fields, records, action_map)
    if template_id == "detail_card":
        return _render_detail(slot_mapping, entity_fields, records[0] if records else {}, action_map)
    if template_id == "glance_view":
        return _render_glance(slot_mapping, entity_fields, records[0] if records else {}, action_map)
    if template_id == "dashboard_tile":
        return _render_tile(slot_mapping, entity_fields, records[0] if records else {})
    if template_id == "tv_focus_list":
        return _render_tv_list(slot_mapping, records, action_map)
    if template_id == "form":
        return _render_form(slot_mapping, entity_fields, action_map)
    if template_id == "list_detail":
        return _render_list_detail(slot_mapping, entity_fields, records, action_map, device_class)
    if template_id == "stat_dashboard":
        return _render_stat_dashboard(slot_mapping, entity_fields, records[0] if records else {}, action_map)
    raise ValueError(f"Unknown template_id: {template_id}")


def _slot_value(slot_mapping, key):
    return slot_mapping.get(key) or ""


def _as_list(value):
    if not value:
        return []
    if isinstance(value, list):
        return [v for v in value if v]
    return [value]


def _action_label(action_id, action_map):
    action = action_map.get(action_id)
    if not action:
        return escape(action_id.replace("_", " ").title())
    verb = VERB_LABELS.get(action.get("verb"), action["action_id"].replace("_", " ").title())
    return escape(verb)


def _render_actions(action_ids, action_map, *, compact=False):
    ids = _as_list(action_ids)
    if not ids:
        return ""
    buttons = []
    for action_id in ids:
        action = action_map.get(action_id, {})
        destructive = action.get("destructive", False)
        cls = "btn btn-destructive" if destructive else "btn btn-secondary"
        if not compact and not destructive and action.get("verb") in {"create", "complete", "custom"}:
            cls = "btn btn-primary"
        buttons.append(
            f'<button type="button" class="{cls}" data-action="{escape(action_id)}">'
            f"{_action_label(action_id, action_map)}</button>"
        )
    return f'<div class="action-bar{" action-bar-compact" if compact else ""}">{"".join(buttons)}</div>'


def _tone_for_value(field_def, value):
    if field_def.get("type") == "enum":
        return STATUS_TONES.get(str(value), "neutral")
    return "neutral"


def _format_value(field_def, value, field_name=""):
    if value is None or value == "":
        return '<span class="value-empty">—</span>'

    field_type = field_def.get("type", "string")
    if field_def.get("sensitive"):
        return '<span class="value-sensitive" title="Sensitive field">••••••</span>'

    if field_type == "boolean":
        checked = "checked" if value else ""
        disabled = "disabled"
        return f'<input type="checkbox" class="value-bool" {checked} {disabled} />'

    if field_type == "enum":
        tone = _tone_for_value(field_def, value)
        label = escape(str(value).replace("_", " "))
        return f'<span class="badge badge-{tone}">{label}</span>'

    if field_type == "number" and (
        field_name == "progress" or "progress" in field_def.get("label", "").lower()
    ):
        pct = max(0, min(100, int(float(value))))
        return (
            f'<div class="progress-wrap"><div class="progress-bar" style="width:{pct}%"></div>'
            f'<span class="progress-label">{pct}%</span></div>'
        )

    if field_type == "date":
        return f'<time class="value-date">{escape(str(value))}</time>'

    if field_type == "text":
        return f'<p class="value-text">{escape(str(value))}</p>'

    return f'<span class="value-plain">{escape(str(value))}</span>'


def _initials_from_record(record, title_field):
    raw = str(record.get(title_field, "") or "?")
    parts = [p for p in raw.split() if p][:2]
    return escape("".join(p[0].upper() for p in parts) or "?")


def _render_list(slot_mapping, entity_fields, records, action_map):
    title_f = _slot_value(slot_mapping, "title_field")
    sub_f = _slot_value(slot_mapping, "subtitle_field")
    meta_f = _slot_value(slot_mapping, "meta_field")
    item_action = _slot_value(slot_mapping, "item_action_id")

    items = []
    for record in records:
        title = _format_value(entity_fields.get(title_f, {}), record.get(title_f), title_f)
        subtitle = _format_value(entity_fields.get(sub_f, {}), record.get(sub_f), sub_f) if sub_f else ""
        meta = _format_value(entity_fields.get(meta_f, {}), record.get(meta_f), meta_f) if meta_f else ""
        action_btn = ""
        if item_action:
            action_btn = (
                f'<button type="button" class="btn btn-ghost btn-icon" data-action="{escape(item_action)}" '
                f'aria-label="{_action_label(item_action, action_map)}">›</button>'
            )
        meta_html = f'<div class="list-meta">{meta}</div>' if meta_f else ""
        items.append(
            f'<li class="list-row">'
            f'<div class="avatar">{_initials_from_record(record, title_f)}</div>'
            f'<div class="list-body">'
            f'<div class="list-title">{title}</div>'
            f'<div class="list-subtitle">{subtitle}</div>'
            f"{meta_html}"
            f"</div>{action_btn}</li>"
        )

    header = f'<header class="panel-header"><h2 class="panel-title">Records</h2><span class="count-pill">{len(records)}</span></header>'
    return f'<section class="adaptive list_view">{header}<ul class="record-list">{"".join(items)}</ul></section>'


def _render_detail(slot_mapping, entity_fields, record, action_map):
    header_f = _slot_value(slot_mapping, "header_field")
    body_fs = _as_list(slot_mapping.get("body_fields"))
    action_ids = slot_mapping.get("action_ids")

    header = escape(str(record.get(header_f, "")))
    avatar = _initials_from_record(record, header_f)
    body = "".join(
        f'<div class="field field-grid">'
        f'<label>{escape(entity_fields.get(f, {}).get("label", f))}</label>'
        f'<div class="field-value">{_format_value(entity_fields.get(f, {}), record.get(f), f)}</div>'
        f"</div>"
        for f in body_fs
    )
    actions = _render_actions(action_ids, action_map)
    return (
        f'<article class="adaptive detail_card">'
        f'<header class="detail-hero"><div class="avatar avatar-lg">{avatar}</div>'
        f"<div><h2>{header}</h2>"
        f'<p class="detail-kicker">{escape(entity_fields.get(header_f, {}).get("label", header_f))}</p></div></header>'
        f'<div class="field-stack">{body}</div>{actions}</article>'
    )


def _render_glance(slot_mapping, entity_fields, record, action_map):
    primary_f = _slot_value(slot_mapping, "primary_field")
    secondary_f = _slot_value(slot_mapping, "secondary_field")
    single_action = _slot_value(slot_mapping, "single_action_id")
    field_def = entity_fields.get(primary_f, {})
    val = record.get(primary_f, "")

    if field_def.get("type") == "number":
        visual = f'<div class="ring-stat"><span class="ring-value">{escape(str(val))}</span></div>'
    else:
        visual = f'<div class="glance-primary">{_format_value(field_def, val, primary_f)}</div>'

    secondary = ""
    if secondary_f:
        secondary = (
            f'<div class="glance-secondary">'
            f'{_format_value(entity_fields.get(secondary_f, {}), record.get(secondary_f), secondary_f)}'
            f"</div>"
        )

    action = _render_actions(single_action, action_map, compact=True) if single_action else ""
    return f'<section class="adaptive glance_view">{visual}{secondary}{action}</section>'


def _render_tile(slot_mapping, entity_fields, record):
    head_f = _slot_value(slot_mapping, "headline_field")
    sub_f = _slot_value(slot_mapping, "sublabel_field")
    return (
        f'<div class="adaptive dashboard_tile">'
        f'<div class="tile-icon">◆</div>'
        f'<div class="headline">{_format_value(entity_fields.get(head_f, {}), record.get(head_f), head_f)}</div>'
        f'<div class="sublabel">{_format_value(entity_fields.get(sub_f, {}), record.get(sub_f), sub_f)}</div>'
        f"</div>"
    )


def _render_tv_list(slot_mapping, records, action_map):
    title_f = _slot_value(slot_mapping, "title_field")
    item_action = _slot_value(slot_mapping, "item_action_id")
    items = []
    for idx, record in enumerate(records):
        selected = " tv-row-selected" if idx == 0 else ""
        hint = f'<span class="tv-hint">{_action_label(item_action, action_map)}</span>' if item_action else ""
        items.append(
            f'<li class="tv-row{selected}" tabindex="0">'
            f'<span>{escape(str(record.get(title_f, "")))}</span>{hint}</li>'
        )
    return f'<ul class="adaptive tv_focus_list">{"".join(items)}</ul>'


def _render_form(slot_mapping, entity_fields, action_map):
    order = _as_list(slot_mapping.get("field_order"))
    submit_action = _slot_value(slot_mapping, "submit_action_id")
    inputs = []
    for field_name in order:
        field_def = entity_fields.get(field_name, {})
        label = escape(field_def.get("label", field_name))
        input_html = _form_input(field_name, field_def)
        inputs.append(f'<label class="form-field">{label}{input_html}</label>')

    submit_label = _action_label(submit_action, action_map) if submit_action else "Save"
    return (
        f'<form class="adaptive form">'
        f'{"".join(inputs)}'
        f'<div class="action-bar">'
        f'<button type="submit" class="btn btn-primary" data-action="{escape(submit_action)}">{submit_label}</button>'
        f'<button type="button" class="btn btn-secondary">Cancel</button>'
        f"</div></form>"
    )


def _form_input(field_name, field_def):
    name = escape(field_name)
    field_type = field_def.get("type", "string")
    if field_type == "text":
        return f'<textarea name="{name}" rows="3"></textarea>'
    if field_type == "boolean":
        return f'<input type="checkbox" name="{name}" />'
    if field_type == "date":
        return f'<input type="date" name="{name}" />'
    if field_type == "number":
        return f'<input type="number" name="{name}" />'
    if field_type == "enum":
        options = "".join(f'<option value="{escape(v)}">{escape(v.replace("_", " "))}</option>' for v in field_def.get("enum_values", []))
        return f'<select name="{name}">{options}</select>'
    return f'<input type="text" name="{name}" />'


def _render_list_detail(slot_mapping, entity_fields, records, action_map, device_class):
    title_f = _slot_value(slot_mapping, "list_title_field")
    sub_f = _slot_value(slot_mapping, "list_subtitle_field")
    meta_f = _slot_value(slot_mapping, "meta_field")
    detail_header_f = _slot_value(slot_mapping, "detail_header_field")
    detail_body = _as_list(slot_mapping.get("detail_body_fields"))
    list_action = _slot_value(slot_mapping, "list_item_action_id")
    detail_actions = slot_mapping.get("detail_action_ids")

    selected = records[0] if records else {}
    list_items = []
    for idx, record in enumerate(records):
        active = " list-row-active" if idx == 0 else ""
        meta_html = ""
        if meta_f:
            meta_html = (
                f'<div class="list-meta">'
                f'{_format_value(entity_fields.get(meta_f, {}), record.get(meta_f), meta_f)}'
                f"</div>"
            )
        list_items.append(
            f'<li class="list-row{active}">'
            f'<div class="avatar">{_initials_from_record(record, title_f)}</div>'
            f'<div class="list-body">'
            f'<div class="list-title">{_format_value(entity_fields.get(title_f, {}), record.get(title_f), title_f)}</div>'
            f'<div class="list-subtitle">{_format_value(entity_fields.get(sub_f, {}), record.get(sub_f), sub_f)}</div>'
            f"{meta_html}"
            f"</div></li>"
        )

    detail_fields = "".join(
        f'<div class="field field-grid">'
        f'<label>{escape(entity_fields.get(f, {}).get("label", f))}</label>'
        f'<div class="field-value">{_format_value(entity_fields.get(f, {}), selected.get(f), f)}</div>'
        f"</div>"
        for f in detail_body
    )

    list_header = (
        f'<header class="panel-header"><h2 class="panel-title">All items</h2>'
        f'<span class="count-pill">{len(records)}</span></header>'
    )
    if list_action:
        list_header += _render_actions(list_action, action_map, compact=True)

    detail_header = (
        f'<header class="detail-hero detail-hero-compact">'
        f'<div class="avatar avatar-lg">{_initials_from_record(selected, detail_header_f)}</div>'
        f"<div><h2>{escape(str(selected.get(detail_header_f, "")))}</h2>"
        f'<p class="detail-kicker">Selected record</p></div></header>'
    )

    return (
        f'<section class="adaptive list_detail layout-{escape(device_class)}">'
        f'<aside class="list-pane">{list_header}<ul class="record-list">{"".join(list_items)}</ul></aside>'
        f'<main class="detail-pane">{detail_header}<div class="field-stack">{detail_fields}</div>'
        f'{_render_actions(detail_actions, action_map)}</main></section>'
    )


def _render_stat_dashboard(slot_mapping, entity_fields, record, action_map):
    title_f = _slot_value(slot_mapping, "title_field")
    metrics = _as_list(slot_mapping.get("metric_fields"))
    sub_f = _slot_value(slot_mapping, "sublabel_field")
    action_ids = slot_mapping.get("action_ids")

    title = escape(str(record.get(title_f, "Overview")))
    subtitle = _format_value(entity_fields.get(sub_f, {}), record.get(sub_f), sub_f) if sub_f else ""

    cards = []
    for field_name in metrics:
        field_def = entity_fields.get(field_name, {})
        cards.append(
            f'<div class="stat-card">'
            f'<div class="stat-label">{escape(field_def.get("label", field_name))}</div>'
            f'<div class="stat-value">{_format_value(field_def, record.get(field_name), field_name)}</div>'
            f"</div>"
        )

    return (
        f'<section class="adaptive stat_dashboard">'
        f'<header class="dashboard-header"><div><h2>{title}</h2><div class="dashboard-sub">{subtitle}</div></div>'
        f'{_render_actions(action_ids, action_map, compact=True)}</header>'
        f'<div class="stat-grid">{"".join(cards)}</div></section>'
    )


PAGE_SHELL = """<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{page_title}</title>
<style>
  :root {{
    --bg: #0f1117;
    --surface: #171a22;
    --surface-2: #1f2430;
    --border: #2a3140;
    --text: #eef1f6;
    --muted: #9aa3b2;
    --accent: #6ea8fe;
    --accent-2: #8b5cf6;
    --success: #3dd68c;
    --warn: #f4bf4a;
    --danger: #ff6b6b;
    --radius: 14px;
    --shadow: 0 10px 30px rgba(0,0,0,.25);
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    background: radial-gradient(circle at top, #1a2030, var(--bg) 55%);
    color: var(--text);
    min-height: 100vh;
    padding: 1.25rem;
  }}
  .shell {{ max-width: 980px; margin: 0 auto; }}
  .device-label {{
    display: flex; gap: .75rem; flex-wrap: wrap; align-items: center;
    color: var(--muted); font-size: .82rem; margin-bottom: 1rem;
  }}
  .chip {{
    display: inline-flex; align-items: center; gap: .35rem;
    padding: .25rem .6rem; border-radius: 999px;
    background: var(--surface-2); border: 1px solid var(--border);
  }}
  .adaptive {{
    background: linear-gradient(180deg, rgba(255,255,255,.03), transparent), var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
  }}
  .panel-header, .dashboard-header, .detail-hero {{
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    padding: 1rem 1.1rem; border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,.02);
  }}
  .panel-title, h2 {{ margin: 0; font-size: 1.05rem; }}
  .count-pill {{
    background: var(--surface-2); border: 1px solid var(--border);
    padding: .15rem .55rem; border-radius: 999px; font-size: .78rem; color: var(--muted);
  }}
  .record-list {{ list-style: none; margin: 0; padding: .35rem; }}
  .list-row {{
    display: flex; align-items: center; gap: .85rem;
    padding: .75rem .85rem; border-radius: 12px; margin: .25rem 0;
    border: 1px solid transparent;
  }}
  .list-row:hover, .list-row-active, .tv-row-selected {{
    background: var(--surface-2); border-color: var(--border);
  }}
  .avatar {{
    width: 2.4rem; height: 2.4rem; border-radius: 12px;
    display: grid; place-items: center; font-weight: 700; font-size: .82rem;
    background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: white;
  }}
  .avatar-lg {{ width: 3.2rem; height: 3.2rem; font-size: 1rem; border-radius: 16px; }}
  .list-body {{ flex: 1; min-width: 0; }}
  .list-title {{ font-weight: 600; }}
  .list-subtitle, .list-meta, .detail-kicker, .dashboard-sub {{ color: var(--muted); font-size: .86rem; margin-top: .15rem; }}
  .field-stack {{ padding: 1rem 1.1rem 1.2rem; display: grid; gap: .85rem; }}
  .field-grid {{
    display: grid; grid-template-columns: 120px 1fr; gap: .75rem; align-items: start;
    padding: .7rem .2rem; border-bottom: 1px solid rgba(255,255,255,.04);
  }}
  .field-grid label {{ color: var(--muted); font-size: .82rem; }}
  .badge {{
    display: inline-flex; align-items: center; padding: .18rem .55rem;
    border-radius: 999px; font-size: .76rem; font-weight: 600; text-transform: capitalize;
  }}
  .badge-neutral {{ background: #2a3140; color: #d7deea; }}
  .badge-info {{ background: rgba(110,168,254,.18); color: #9ec5fe; }}
  .badge-success {{ background: rgba(61,214,140,.16); color: #8ce7b8; }}
  .badge-warn {{ background: rgba(244,191,74,.16); color: #ffd978; }}
  .badge-danger {{ background: rgba(255,107,107,.16); color: #ffb4b4; }}
  .progress-wrap {{
    position: relative; height: 10px; background: #2a3140; border-radius: 999px; overflow: hidden;
  }}
  .progress-bar {{ height: 100%; background: linear-gradient(90deg, var(--accent), var(--success)); }}
  .progress-label {{
    position: absolute; inset: 0; display: grid; place-items: center;
    font-size: .62rem; font-weight: 700;
  }}
  .action-bar {{ display: flex; flex-wrap: wrap; gap: .55rem; padding: 0 1.1rem 1.1rem; }}
  .action-bar-compact {{ padding: .75rem 1.1rem; border-top: 1px solid var(--border); }}
  .btn {{
    border: 1px solid var(--border); background: var(--surface-2); color: var(--text);
    border-radius: 10px; padding: .55rem .9rem; font: inherit; cursor: pointer;
  }}
  .btn-primary {{ background: linear-gradient(135deg, var(--accent), #4c7fe8); border-color: transparent; }}
  .btn-secondary {{ background: transparent; }}
  .btn-destructive {{ background: rgba(255,107,107,.12); border-color: rgba(255,107,107,.35); color: #ffb4b4; }}
  .btn-ghost {{ background: transparent; border-color: transparent; color: var(--muted); }}
  .btn-icon {{ font-size: 1.2rem; line-height: 1; padding: .35rem .55rem; }}
  .glance_view {{ padding: 1.4rem; text-align: center; }}
  .ring-stat {{
    width: 7rem; height: 7rem; margin: 0 auto 1rem; border-radius: 50%;
    display: grid; place-items: center; border: 6px solid rgba(110,168,254,.25);
    box-shadow: inset 0 0 0 6px rgba(110,168,254,.12);
  }}
  .ring-value {{ font-size: 2rem; font-weight: 700; }}
  .dashboard_tile {{ padding: 1rem; display: grid; gap: .35rem; }}
  .tile-icon {{ color: var(--accent); }}
  .headline {{ font-size: 1.5rem; font-weight: 700; }}
  .tv_focus_list {{ list-style: none; margin: 0; padding: .75rem; }}
  .tv-row {{
    display: flex; justify-content: space-between; align-items: center;
    font-size: 1.35rem; padding: 1rem 1.1rem; border-radius: 14px; margin: .35rem 0;
    outline: none;
  }}
  .tv-row:focus {{ box-shadow: 0 0 0 3px rgba(110,168,254,.35); }}
  .tv-hint {{ color: var(--muted); font-size: .9rem; }}
  .form {{ padding: 1rem 1.1rem; display: grid; gap: .85rem; }}
  .form-field {{ display: grid; gap: .35rem; }}
  .form-field input, .form-field textarea, .form-field select {{
    width: 100%; padding: .65rem .75rem; border-radius: 10px;
    border: 1px solid var(--border); background: var(--surface-2); color: var(--text); font: inherit;
  }}
  .list_detail {{ display: grid; grid-template-columns: 1fr; }}
  .list_detail.layout-tablet, .list_detail.layout-desktop {{
    grid-template-columns: minmax(260px, 34%) 1fr;
  }}
  .list-pane {{ border-right: 1px solid var(--border); min-height: 420px; }}
  .detail-pane {{ min-height: 420px; }}
  .detail-hero-compact {{ border-bottom: 1px solid var(--border); }}
  .stat_dashboard {{ padding-bottom: .2rem; }}
  .stat-grid {{
    display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: .85rem; padding: 1rem 1.1rem 1.2rem;
  }}
  .stat-card {{
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 12px; padding: .9rem;
  }}
  .stat-label {{ color: var(--muted); font-size: .78rem; margin-bottom: .35rem; }}
  .stat-value {{ font-size: 1.35rem; font-weight: 700; }}
  .value-sensitive {{ letter-spacing: .12em; color: var(--muted); }}
  .value-empty {{ color: var(--muted); }}
  @media (max-width: 720px) {{
    .field-grid {{ grid-template-columns: 1fr; }}
    .list_detail {{ grid-template-columns: 1fr; }}
    .list-pane {{ border-right: 0; border-bottom: 1px solid var(--border); }}
  }}
</style></head>
<body>
<div class="shell">
  <div class="device-label">
    <span class="chip">device: {device_class}</span>
    <span class="chip">template: {template_id}</span>
    <span class="chip">{app_name}</span>
  </div>
  {content}
</div>
</body></html>
"""


def render_page(template_id, slot_mapping, entity_fields, records, device_class, actions=None, app_name="Adaptive UI"):
    content = render(template_id, slot_mapping, entity_fields, records, device_class, actions)
    return PAGE_SHELL.format(
        device_class=device_class,
        template_id=template_id,
        app_name=escape(app_name),
        page_title=f"{app_name} · {template_id}",
        content=content,
    )
