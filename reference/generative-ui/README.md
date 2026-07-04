# Generative UI references

Papers, protocol docs, and source for studying LLM-driven UI generation — how agents emit structured UI instead of (or alongside) plain chat.

These materials are **not** vendored dependencies.

## Papers

| File | Source | Summary |
|------|--------|---------|
| [`papers/chen-2025-generative-interfaces-for-language-models.pdf`](papers/chen-2025-generative-interfaces-for-language-models.pdf) | [arXiv:2508.19227](https://arxiv.org/abs/2508.19227) | *Generative Interfaces for Language Models* (ACL 2026 Findings) — LLMs generate task-specific UIs via structured interface representations; up to 72% human preference over chat |
| [`papers/kong-2026-macaron-a2ui.pdf`](papers/kong-2026-macaron-a2ui.pdf) | [arXiv:2605.24830](https://arxiv.org/abs/2605.24830) | *Macaron-A2UI* — generative UI model for personal agents; A2UI-Bench benchmark; LoRA SFT + RL training at 30B–754B scale |

## Saved docs (offline snapshots)

| File | Source | Notes |
|------|--------|-------|
| [`docs/ai-sdk-generative-user-interfaces.html`](docs/ai-sdk-generative-user-interfaces.html) | [AI SDK — Generative User Interfaces](https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces) | Vercel AI SDK pattern: tool calls → React components via `useChat` message parts |
| [`docs/google-a2ui-v0-9-generative-ui.html`](docs/google-a2ui-v0-9-generative-ui.html) | [Google Developers Blog — A2UI v0.9](https://developers.googleblog.com/a2ui-v0-9-generative-ui/) | Framework-agnostic generative UI standard; Agent SDK, catalog-based components, AG-UI/A2A transport |

Re-fetch a doc snapshot:

```bash
curl -fsSL -o docs/ai-sdk-generative-user-interfaces.html \
  "https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces"
curl -fsSL -o docs/google-a2ui-v0-9-generative-ui.html \
  "https://developers.googleblog.com/a2ui-v0-9-generative-ui/"
```

Re-download a paper PDF:

```bash
curl -fsSL -o papers/chen-2025-generative-interfaces-for-language-models.pdf \
  "https://arxiv.org/pdf/2508.19227.pdf"
curl -fsSL -o papers/kong-2026-macaron-a2ui.pdf \
  "https://arxiv.org/pdf/2605.24830.pdf"
```

## Protocol source

Shallow clone of [ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui) at [`ag-ui/`](ag-ui/).

AG-UI (Agent-User Interaction Protocol) — event-based standard for connecting AI agents to user-facing apps. Complements OpenUI/A2UI in our stack.

```bash
cd ag-ui && git pull
```

## Related references elsewhere

- [`../openui/`](../openui/) — OpenUI Lang renderer, streaming generative UI
- [`../adaptive-ui/`](../adaptive-ui/) — Material 3 adaptive layout patterns for responsive panes
