"""
Prototype entrypoint.

Usage:
    python main.py examples/tasklist.json task phone
    python main.py examples/habit.json habit watch
    python main.py examples/contact.json contact desktop
    python main.py examples/project.json project tablet

This is the whole loop:
  1. load a manifest the system has never specifically been coded for
  2. ask the model to pick+populate a template (constrained JSON output)
  3. validate that output against selection_schema.json -- reject if invalid
  4. render deterministically (no AI past this point)
  5. demonstrate the capability gate blocking/allowing an action

Requires OPENAI_API_KEY in the environment.
"""
import json
import sys
from pathlib import Path
from jsonschema import validate, ValidationError
from openai import OpenAI

import capabilities
from renderer import render_page

HERE = Path(__file__).parent


def load_json(path):
    with open(path) as f:
        return json.load(f)


def select_template(manifest, entity_name, device_class, templates, selection_schema, prompt_text):
    client = OpenAI()

    allowed_templates = [
        t for t in templates["templates"]
        if t["template_id"] in templates["device_class_defaults"].get(device_class, [])
    ]

    user_payload = {
        "device_class": device_class,
        "entity_name": entity_name,
        "allowed_templates": allowed_templates,
        "manifest_entity": manifest["entities"][entity_name],
        "manifest_actions": [a for a in manifest["actions"] if a["entity"] == entity_name],
    }

    user_message = (
        "Select and populate a template for this input. "
        "Respond with ONLY a JSON object matching the required schema, no other text. "
        "Keep rationale to one short sentence (max 240 characters):\n\n"
        + json.dumps(user_payload, indent=2)
    )

    messages = [
        {"role": "system", "content": prompt_text},
        {"role": "user", "content": user_message},
    ]

    selection = None
    last_error = None
    for attempt in range(3):
        resp = client.chat.completions.create(
            model="gpt-4o",
            max_tokens=1000,
            response_format={"type": "json_object"},
            messages=messages,
        )

        raw_text = (resp.choices[0].message.content or "").strip()
        # strip accidental code fences
        raw_text = raw_text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()

        try:
            selection = json.loads(raw_text)
        except json.JSONDecodeError as e:
            last_error = f"Model did not return valid JSON: {e}\nRaw: {raw_text}"
            messages.append({"role": "assistant", "content": raw_text})
            messages.append({"role": "user", "content": f"Invalid JSON. Fix and respond with ONLY valid JSON. Error: {e}"})
            continue

        try:
            validate(instance=selection, schema=selection_schema)
        except ValidationError as e:
            last_error = f"Schema validation failed: {e.message}"
            messages.append({"role": "assistant", "content": raw_text})
            messages.append({
                "role": "user",
                "content": f"Output rejected. Fix and respond with ONLY valid JSON. Error: {e.message}",
            })
            continue

        break

    if selection is None:
        raise RuntimeError(f"Model output failed after retries, REJECTED (not rendered): {last_error}")

    # Extra structural check beyond the raw JSON Schema: template must be
    # in the allowed list for this device_class, and mapped fields/actions
    # must actually exist in the manifest. This is the second, independent
    # check -- never trust the model's own claim that it followed the rules.
    valid_ids = {t["template_id"] for t in allowed_templates}
    if selection["template_id"] not in valid_ids:
        raise RuntimeError(f"REJECTED: template_id '{selection['template_id']}' not allowed for device_class '{device_class}'")

    template_def = next(t for t in allowed_templates if t["template_id"] == selection["template_id"])
    expected_slots = set(template_def["slots"])
    actual_slots = set(selection["slot_mapping"].keys())
    if actual_slots != expected_slots:
        raise RuntimeError(
            f"REJECTED: slot_mapping keys {sorted(actual_slots)} do not match template slots {sorted(expected_slots)}"
        )

    valid_fields = set(manifest["entities"][entity_name]["fields"].keys())
    valid_actions = {a["action_id"] for a in manifest["actions"]}
    for slot, val in selection["slot_mapping"].items():
        values = val if isinstance(val, list) else [val]
        for v in values:
            if v == "":
                continue
            if v not in valid_fields and v not in valid_actions:
                raise RuntimeError(f"REJECTED: slot '{slot}' references unknown field/action '{v}' not in manifest")

    return selection


def demo_data(entity_name):
    fake = {
        "task": [
            {"title": "Renew passport", "notes": "Expires next month", "due_date": "2026-08-01", "status": "open"},
            {"title": "Finish Iranian-Buddhist synthesis draft", "notes": "", "due_date": "2026-07-10", "status": "in_progress"},
        ],
        "contact": [
            {"full_name": "Dana Reyes", "relationship": "Sister", "phone": "555-0134", "email": "dana@example.com", "medical_notes": "Penicillin allergy"},
        ],
        "habit": [
            {"name": "Meditation", "streak_days": 14, "done_today": False},
        ],
        "project": [
            {
                "name": "Longformer shell",
                "status": "active",
                "priority": "high",
                "progress": 68,
                "due_date": "2026-09-01",
                "owner": "Paul",
                "summary": "Integrate OpenClaw gateway, workspace focus, and generated UI registry.",
                "budget": 120000,
            },
            {
                "name": "Adaptive UI prototype",
                "status": "active",
                "priority": "medium",
                "progress": 42,
                "due_date": "2026-07-20",
                "owner": "Paul",
                "summary": "Prove manifest-driven template selection with validation and capability gates.",
                "budget": 0,
            },
            {
                "name": "Marketplace trust model",
                "status": "blocked",
                "priority": "critical",
                "progress": 15,
                "due_date": "2026-08-15",
                "owner": "Team",
                "summary": "Capability audit workflow for WASM app functions and marketplace grades.",
                "budget": 45000,
            },
        ],
    }
    return fake.get(entity_name, [])


def main():
    if len(sys.argv) != 4:
        print("Usage: python main.py <manifest_path> <entity_name> <device_class>")
        sys.exit(1)

    manifest_path, entity_name, device_class = sys.argv[1:4]

    manifest = load_json(manifest_path)
    templates = load_json(HERE / "templates.json")
    selection_schema = load_json(HERE / "selection_schema.json")
    prompt_text = (HERE / "prompt.md").read_text()

    print(f"--- Selecting template for entity='{entity_name}' device_class='{device_class}' ---")
    selection = select_template(manifest, entity_name, device_class, templates, selection_schema, prompt_text)
    print(json.dumps(selection, indent=2))

    records = demo_data(entity_name)
    entity_actions = [a for a in manifest["actions"] if a["entity"] == entity_name]
    html = render_page(
        selection["template_id"],
        selection["slot_mapping"],
        manifest["entities"][entity_name]["fields"],
        records,
        device_class,
        actions=entity_actions,
        app_name=manifest.get("name", manifest["app_id"]),
    )
    out_path = HERE / "static" / f"{manifest['app_id']}_{device_class}.html"
    out_path.write_text(html)
    print(f"--- Rendered to {out_path} ---")

    # --- Capability gate demo ---
    capabilities.init_db()
    capabilities.grant(f"{manifest['app_id']}:write", "demo_user")

    for action in manifest["actions"]:
        allowed, reason = capabilities.check_action(action, actor="demo_user", confirmed=False)
        print(f"action '{action['action_id']}' (destructive={action.get('destructive', False)}): allowed={allowed} ({reason})")

    print("\nNote: destructive actions were blocked above because 'confirmed' was False. "
          "That's the deterministic gate working as intended, not a bug.")


if __name__ == "__main__":
    main()
