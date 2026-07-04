# Adaptive UI prototype — proof of mechanism, not a demo script

This proves one narrow claim: **given an app manifest the system has never
seen, and a device class, the AI can select+populate a fixed UI template —
constrained and validated — and every action passes through a deterministic
capability gate before it could run.** Nothing here is canned; the model
call is live and unconstrained on input, only constrained on output shape.

## Files

- `manifest.schema.json` — what an app author declares (data + actions).
  No layout info allowed, on purpose.
- `templates.json` — the fixed, hand-authored template grammar. The AI
  never generates outside this list.
- `selection_schema.json` — the strict schema the model's output must
  validate against. Anything else is rejected, not rendered.
- `prompt.md` — the system prompt for the selection call.
- `capabilities.py` — deterministic, non-AI permission gate + audit log.
- `renderer.py` — deterministic HTML rendering from a validated selection.
- `main.py` — wires it together end to end.
- `examples/*.json` — sample apps (tasklist, contact, habit, project).
- `render_gallery.py` — offline gallery of curated complex renders.

## Setup

```bash
pip install openai jsonschema --break-system-packages
export OPENAI_API_KEY=your_key_here
```

## Run it

```bash
python main.py examples/tasklist.json task phone
python main.py examples/habit.json habit watch
python main.py examples/contact.json contact desktop
python main.py examples/project.json project tablet
```

Open the generated file in `static/` to see the rendered page.

Offline gallery (rich UI demos, no API key):

```bash
python render_gallery.py
# open static/index.html
```

## How to actually stress-test this (don't skip this)

The whole point of this prototype is that it's *not* canned. Prove that to
yourself and anyone watching by breaking the happy path on purpose:

1. **Write a 4th manifest live**, on the spot, for something you invent —
   a recipe box, a plant-watering tracker, whatever. Point `main.py` at it.
   If it renders sensibly with zero code changes, the mechanism is real.
2. **Ask for a device_class a template doesn't support well** (e.g. force
   `watch` on the contact manifest, which has a sensitive field) and confirm
   `medical_notes` never lands in the glance_view slot — that's rule #4 in
   `prompt.md` being enforced, and you should verify it actually holds, not
   just trust the prompt text.
3. **Try to run a destructive action without `confirmed=True`** in
   `main.py` — it should be blocked and logged, not silently allowed. This
   is the security architecture from our design discussion made concrete:
   the model proposes, deterministic code disposes.
4. **Corrupt the model's output on purpose** (temporarily hardcode a bad
   `template_id` in `select_template`) and confirm `main.py` raises and
   refuses to render rather than falling back to something silently wrong.

## What's deliberately NOT here yet

No semantic graph, no multi-provider model routing, no WASM sandboxing, no
marketplace. Those are real next steps but adding them now would make this
harder to demo and wouldn't prove anything new about the core mechanism.
Once this mechanism is solid, the graph is the natural next slice — it's
what lets a habit-tracker action show up as context in the task list's AI
reasoning, without either app needing to know about the other directly.
