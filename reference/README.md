# Research references

Local shallow clones of open-source projects we study while designing Longformer. These directories are **not** vendored dependencies — they stay out of the product build. Re-clone or update with `git pull` inside each folder.

**→ See [`LEARNINGS.md`](LEARNINGS.md) for the full synthesis of what each reference teaches Longformer** (July 2026 review, organized by product area with a priority roadmap).

| Path | Upstream | Why we keep it |
|------|----------|----------------|
| [`matrix-os/`](matrix-os/) | [HamedMP/matrix-os](https://github.com/HamedMP/matrix-os) | Hosted cloud-computer positioning, marketing site patterns, agent-centric desktop UX |
| [`openui/`](openui/) | [thesysdev/openui](https://github.com/thesysdev/openui) | Generative UI streaming, AG-UI events, OpenUI Lang renderer |
| [`shadcn-ui/`](shadcn-ui/) | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | Registry / copy-in component distribution model (see `DESIGN-SYSTEM-SPEC.md` D2) |
| [`puter/`](puter/) | [HeyPuter/puter](https://github.com/HeyPuter/puter) | Self-hostable web desktop OS — windowing, app store, cloud storage, built-in apps, install/self-host story |
| [`agent-canvas/`](agent-canvas/) | [OpenHands/agent-canvas](https://github.com/OpenHands/agent-canvas) | Self-hosted developer control center for coding agents — multi-backend routing, automations, MCP/skills config |
| [`hermes-webui/`](hermes-webui/) | [nesquena/hermes-webui](https://github.com/nesquena/hermes-webui) | Three-panel agent UI (sessions, chat, workspace browser) — composer footer, context ring, no-build vanilla stack |
| [`openclaw-os/`](openclaw-os/) | [thesysdev/openclaw-os](https://github.com/thesysdev/openclaw-os) | OpenClaw workspace UI — persistent generative apps via OpenUI renderer, session organization, plugin architecture |
| [`nemoclaw/`](nemoclaw/) | [NVIDIA/NemoClaw](https://github.com/NVIDIA/NemoClaw) | Sandboxed agent reference stack (OpenShell) — hardened blueprint, routed inference, network policy, multi-agent onboarding CLI |
| [`nanoclaw/`](nanoclaw/) | [nanocoai/nanoclaw](https://github.com/nanocoai/nanoclaw) | Minimal OpenClaw-style assistant — container-isolated agents, tiny auditable codebase, multi-channel pairing, guided setup CLI |
| [`adaptive-ui/`](adaptive-ui/) | [androidx/androidx](https://github.com/androidx/androidx) + [android/adaptive-apps-samples](https://github.com/android/adaptive-apps-samples) | Material 3 Adaptive Compose — `adaptive`, `adaptive-layout`, `adaptive-navigation` source + canonical layout samples |
| [`generative-ui/`](generative-ui/) | Papers + [ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui) + saved docs | Generative UI research (Chen 2025, Macaron-A2UI), AG-UI protocol source, AI SDK + Google A2UI v0.9 snapshots |
| [`crewai/`](crewai/) | [crewaiinc/crewai](https://github.com/crewaiinc/crewai) | Multi-agent orchestration framework — crews, flows, tasks, tools, role-based agent collaboration |
| [`vscode/`](vscode/) | [microsoft/vscode](https://github.com/microsoft/vscode) | Workbench shell architecture — parts/grid layout, view registries, chat content parts, commands/context keys, color registry (see [`vscode.guide.md`](vscode.guide.md)) |
| [`vscode/`](vscode/) | [microsoft/vscode](https://github.com/microsoft/vscode) | Workbench shell (activity bar, sidebar, editor, panel, auxiliary bar), views/contribution model, command palette & quick pick, Monaco host, chat & inline AI UI — see [`vscode.guide.md`](vscode.guide.md) |

## Refresh a clone

```bash
cd reference/<name> && git pull
```

## Add a new reference

```bash
cd reference
git clone --depth 1 https://github.com/<org>/<repo>.git <name>
```

Then add a row to the table above.
