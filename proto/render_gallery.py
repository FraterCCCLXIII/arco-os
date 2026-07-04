#!/usr/bin/env python3
"""Render gallery pages with curated template selections (no API key required)."""
import json
from pathlib import Path

from renderer import render_page

HERE = Path(__file__).parent

FIXTURES = [
    {
        "manifest": "examples/tasklist.json",
        "entity": "task",
        "device": "phone",
        "selection": {
            "template_id": "list_view",
            "slot_mapping": {
                "title_field": "title",
                "subtitle_field": "status",
                "meta_field": "due_date",
                "item_action_id": "complete_task",
            },
            "rationale": "Phone task list with due dates and row actions.",
        },
    },
    {
        "manifest": "examples/contact.json",
        "entity": "contact",
        "device": "desktop",
        "selection": {
            "template_id": "detail_card",
            "slot_mapping": {
                "header_field": "full_name",
                "body_fields": ["relationship", "phone", "email", "medical_notes"],
                "action_ids": ["call_contact", "edit_contact", "delete_contact"],
            },
            "rationale": "Desktop contact detail with sensitive notes and action bar.",
        },
    },
    {
        "manifest": "examples/habit.json",
        "entity": "habit",
        "device": "watch",
        "selection": {
            "template_id": "glance_view",
            "slot_mapping": {
                "primary_field": "streak_days",
                "secondary_field": "done_today",
                "single_action_id": "mark_done",
            },
            "rationale": "Watch streak ring with done-today state and one action.",
        },
    },
    {
        "manifest": "examples/project.json",
        "entity": "project",
        "device": "tablet",
        "selection": {
            "template_id": "list_detail",
            "slot_mapping": {
                "list_title_field": "name",
                "list_subtitle_field": "status",
                "meta_field": "priority",
                "detail_header_field": "name",
                "detail_body_fields": ["owner", "progress", "due_date", "summary", "budget"],
                "list_item_action_id": "update_project",
                "detail_action_ids": ["update_project", "archive_project", "delete_project"],
            },
            "rationale": "Tablet master-detail for multi-field project records.",
        },
    },
    {
        "manifest": "examples/project.json",
        "entity": "project",
        "device": "desktop",
        "selection": {
            "template_id": "stat_dashboard",
            "slot_mapping": {
                "title_field": "name",
                "metric_fields": ["progress", "status", "priority", "due_date"],
                "sublabel_field": "owner",
                "action_ids": ["update_project", "archive_project"],
            },
            "rationale": "Desktop dashboard summarizing the lead project as stat cards.",
        },
    },
    {
        "manifest": "examples/tasklist.json",
        "entity": "task",
        "device": "tv",
        "selection": {
            "template_id": "tv_focus_list",
            "slot_mapping": {
                "title_field": "title",
                "item_action_id": "complete_task",
            },
            "rationale": "TV-friendly focused list with remote action hints.",
        },
    },
]


def demo_data():
    return {
        "task": [
            {"title": "Renew passport", "notes": "Expires next month", "due_date": "2026-08-01", "status": "open"},
            {"title": "Finish synthesis draft", "notes": "Outline section 3", "due_date": "2026-07-10", "status": "in_progress"},
            {"title": "Book dentist", "notes": "", "due_date": "2026-07-18", "status": "open"},
        ],
        "contact": [
            {
                "full_name": "Dana Reyes",
                "relationship": "Sister",
                "phone": "555-0134",
                "email": "dana@example.com",
                "medical_notes": "Penicillin allergy",
            },
        ],
        "habit": [{"name": "Meditation", "streak_days": 14, "done_today": False}],
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


def main():
    records_by_entity = demo_data()
    links = []

    for fixture in FIXTURES:
        manifest = json.loads((HERE / fixture["manifest"]).read_text())
        entity = fixture["entity"]
        device = fixture["device"]
        selection = fixture["selection"]
        entity_actions = [a for a in manifest["actions"] if a["entity"] == entity]

        html = render_page(
            selection["template_id"],
            selection["slot_mapping"],
            manifest["entities"][entity]["fields"],
            records_by_entity[entity],
            device,
            actions=entity_actions,
            app_name=manifest.get("name", manifest["app_id"]),
        )

        out_name = f"gallery_{manifest['app_id']}_{selection['template_id']}_{device}.html"
        out_path = HERE / "static" / out_name
        out_path.write_text(html)
        links.append((manifest["name"], selection["template_id"], device, out_name))
        print(f"Wrote {out_path}")

    index = ["<!doctype html><html><head><meta charset=utf-8><title>Adaptive UI Gallery</title>",
             "<style>body{font-family:system-ui;background:#0f1117;color:#eef1f6;padding:2rem;max-width:720px;margin:0 auto}",
             "a{color:#6ea8fe;text-decoration:none}li{margin:.65rem 0}h1{font-size:1.4rem}</style></head><body>",
             "<h1>Adaptive UI prototype gallery</h1><p>Curated template renders — no API required.</p><ul>"]
    for app_name, template_id, device, filename in links:
        index.append(
            f'<li><a href="{filename}"><strong>{app_name}</strong></a> — '
            f'{template_id} on {device}</li>'
        )
    index.append("</ul></body></html>")
    gallery_index = HERE / "static" / "index.html"
    gallery_index.write_text("".join(index))
    print(f"Wrote {gallery_index}")


if __name__ == "__main__":
    main()
