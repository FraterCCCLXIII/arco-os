# Reference learnings — what each app teaches Longformer

> Synthesis of a full review of every reference in this folder (July 2026), mapped to Longformer's architecture (`DESIGN-SYSTEM-SPEC.md` decisions D1–D10, `Project-planning.md` north star). Organized by product area, not by repo. Each area ends with the concrete things to adopt.

**Repos reviewed:** agent-canvas, hermes-webui, openclaw-os, openui, nemoclaw, nanoclaw, puter, matrix-os, adaptive-ui (AndroidX + samples), shadcn-ui, generative-ui (AG-UI + papers + docs), crewai, vscode (§15 addendum).

---

## Table of contents

1. [Shell & navigation](#1-shell--navigation)
2. [Agent interaction UX](#2-agent-interaction-ux)
3. [Composer](#3-composer)
4. [Generative-UI pipeline](#4-generative-ui-pipeline)
5. [Generated-app lifecycle](#5-generated-app-lifecycle)
6. [Desktop & windowing](#6-desktop--windowing)
7. [Adaptivity model (D8)](#7-adaptivity-model-d8)
8. [Registry & distribution (D2/D5)](#8-registry--distribution-d2d5)
9. [Engines, security & isolation (D9/D10)](#9-engines-security--isolation-d9d10)
10. [Automations & orchestration](#10-automations--orchestration)
11. [Onboarding & install story](#11-onboarding--install-story)
12. [Research findings that shape product policy](#12-research-findings-that-shape-product-policy)
13. [Anti-patterns catalog](#13-anti-patterns-catalog)
14. [Priority roadmap](#14-priority-roadmap)
15. [VS Code addendum](#15-vs-code-addendum)

---

## 1. Shell & navigation

**Hermes WebUI is the closest existing implementation of the Longformer shell.** Its `rail | sidebar | main | on-demand workspace panel` layout (`hermes-webui/static/index.html`) maps 1:1 to `AppShell`. Key details:

- Rail = icon tabs for top-level surfaces (Chat, Tasks, Skills, Memory, Settings); sidebar = contextual lists per tab.
- Right workspace panel is **closed by default, opened on demand** — and its open/closed state is bootstrapped synchronously in `<head>` to prevent flash-of-wrong-layout. Same trick for theme.
- Session list: date groups (Today/Yesterday/Earlier), colored projects, #tags, pin/archive, per-item `⋯` menu (`hermes-webui/static/sessions.js`).

**Agent Canvas** adds what Hermes lacks:

- **Resizable context drawer with tabs** (Files / Planner / Browser / Terminal / Tasks), width persisted, selected tab persisted per conversation but drawer-open intentionally session-only (`agent-canvas/src/.../conversation-tabs.tsx`).
- **Command palette (⌘K)** for cross-surface jumps (`command-menu.tsx`).
- Mobile: context panel becomes a full-screen route rather than a squeezed drawer.

**Adopt:**
1. Rail = workspace switcher; sidebar = workspace-scoped lists; context panel = resizable tabbed drawer (Agent Canvas mechanics, Hermes semantics).
2. FOUC-free layout boot: inline `<head>` script hydrates theme + panel + rail-collapse state before first paint.
3. ⌘K command palette across all 35 workspaces.
4. Session/entity lists get pin + group + search as standard affordances.

---

## 2. Agent interaction UX

**Hermes' "Calm Console" (`hermes-webui/DESIGN.md`) is the best written spec for agent-trace UX** and matches Longformer's direction almost verbatim: prose first, tools as metadata. Collapsed "Activity: N tools" row; expanding reveals thinking + tool cards together; monospace only for tool payloads; semantic color only for state.

**Agent Canvas** proves per-tool-type visualizers (bash, file-edit, search, subagent) beat one generic tool card (`tool-visualizers/`), and drives the whole chat from a typed **agent state machine** (running / paused / awaiting-confirmation / error) — input disabled during confirmation, follow-ups still allowed in error state for recovery.

**Approvals:** Hermes streams `approval` and `clarify` events over SSE and renders them as real-time cards with allow-once/session/always/deny (`messages.js`); session-scoped guards prevent cross-session bleed. Agent Canvas has a `confirmation_mode` with a lock indicator.

**Background work:** Hermes has a per-session background event stream that surfaces completion toasts + unread badges + browser notifications when the tab is unfocused — the pattern for Longformer's "agent finished something in another workspace."

**Agent-driven navigation:** Agent Canvas' `canvas_ui` tool lets the agent open files/tabs in the UI (`services/canvas-ui.ts`). Longformer should generalize this into typed shell actions (`open_workspace`, `show_preview`) — it's the seed of "agent can navigate and mutate" from the north star.

**Adopt:**
1. Codify Calm-Console rules into the chat workspace spec (already begun in `agent-blocks/`).
2. Typed per-tool visualizers keyed off the registry, not a generic card.
3. Approval/clarify as first-class streamed events → native themed blocks with deterministic gates (ties to D10).
4. Background-completion notification channel with unread badges per workspace.
5. Agent shell-navigation tool with a small typed verb set.

---

## 3. Composer

**Hermes' composer footer is the reference design** (`hermes-webui/static/index.html` composer footer + `ui.js`): a chip row that stays visible across everything — profile, workspace, model, provider quota, reasoning effort, toolsets, and the **context ring**.

Context ring details worth copying exactly: SVG ring showing % of context window computed from **last prompt tokens, not cumulative input tokens** (they shipped that bug and fixed it — #1436); tooltip with tokens/cost/cache; threshold marker for auto-compress; compress affordance at 50/75%.

Other composer patterns: slash-command registry with autocomplete (`commands.js`); per-session draft persistence (debounced to server); quote-selected-text as structured context blocks; queue-while-processing send semantics; Stop button.

**Agent Canvas** adds an **interceptor pipeline** (model-switch → goal → submit) for commands that mutate shell state before the message goes out, plus a git/repo context bar under the composer for code work.

**Adopt:** footer chip row (engine, model, workspace scope, context ring) in the shared `Composer`; slash commands + interceptors; queued sends; selection-quoting.

---

## 4. Generative-UI pipeline

This is where openui + openclaw-os + AG-UI + the two papers converge on one architecture — and it validates D3–D6 almost point-for-point.

**The OpenUI engine** (`openui/packages/`):
- `defineComponent` (Zod props + description + renderer) → `createLibrary` → **`generatePrompt()`** produces the model's instructions from the same source as the validator and renderer. This is exactly Longformer's D5 Generation Contract — steal the mechanism.
- Streaming: re-parse on every chunk; hoisting lets `root` come first; `ElementErrorBoundary` keeps the **last good frame** during malformed intermediate states; forms disabled while `isStreaming`.
- **`mergeStatements`** — agent edits emit only changed statements, runtime merges by name and garbage-collects orphans. Cheap iterative edits instead of full re-emission.
- **QueryManager** — `Query`/`Mutation` nodes in generated UI fetch live data through a `toolProvider` with caching and `refreshInterval`. This is what makes generated apps refresh **without the LLM in the loop**.

**OpenClaw OS production hardening** (`openclaw-os/packages/claw-plugin/`):
- **Two component libraries**: chat-inline (static, Card-rooted, no state/queries) vs app (reactive, Stack-rooted, Query/Mutation/$state). Prevents "interactive app accidentally in a chat bubble."
- **Save first, lint second, patch small**: `app_create`/`app_update` always persist, then return validation errors + correction hints as tool results; prompts forbid re-emitting whole programs.
- **Skill gate**: `before_tool_call` blocks app tools until the agent has read the app-authoring SKILL.md — enforced progressive disclosure of a 900-line prompt.
- Session-key suffix (`:openclaw-os`) gates UI-capable prompt injection to UI sessions only.

**AG-UI protocol** (`generative-ui/ag-ui`): the event taxonomy to build on — `TEXT_MESSAGE_*`, `TOOL_CALL_*`, `STATE_SNAPSHOT`/`STATE_DELTA` (RFC 6902 JSON Patch), `ACTIVITY_SNAPSHOT/DELTA` for structured in-flight progress, `RUN_FINISHED` with `outcome: interrupt` + resume for human-in-the-loop. Middleware chain (`agent.use(...)`) is the sanctioned place for an A2UI payload emitter. Use `REASONING_*` (not deprecated `THINKING_*`).

**Adopt:**
1. Build the block registry on the `defineComponent`/`generatePrompt` mechanism; emit A2UI JSON + (optionally) OpenUI Lang + `GeneratedSurfaceSchema` from one Zod source.
2. Two libraries per surface class: chat-static vs app-reactive.
3. Save→lint→patch loop with merge-by-name edits.
4. AG-UI events end-to-end; `STATE_DELTA` for SurfaceManager/app state; `ACTIVITY_*` for agent blocks; interrupt/resume for confirmations.
5. Streaming renderer: last-good-frame error boundary, root-first emission order, disabled interactivity mid-stream.

---

## 5. Generated-app lifecycle

**OpenClaw OS ships the full loop Longformer §10.7 describes** — create, persist, refresh, refine, version:

- `app_create` → `AppStore` (JSON on disk, 25 version snapshots); apps listed in a first-class Apps route; pinnable.
- **Refine flow**: clicking "refine" on an app links it to its origin thread (`linkedApp` in thread workspace state) and prefills the composer with `Refine app "<title>" (id: <id>): …` — unambiguous routing so the agent calls `app_update`, never creates a duplicate.
- **Continue-from-app**: actions inside a running app route back to the origin agent session with app context attached.
- **`primeComposer` CustomEvent** — any surface can seed the global composer (and optionally submit). Perfect fit for 35 workspaces sharing one agent.
- Data refresh via QueryManager + gateway tool invoke (`exec`, `read`, `db_query`) — cron + SQLite snapshot pattern for heavy data.

**matrix-os** (opposite philosophy — apps are code) still contributes operational patterns:
- **Manifest as the install unit** with declarative `storage.tables` (auto-provisioned per-app DB schema), trust tiers (`listingTrust`), provenance (`installed_from`/`forked_from`), and server-computed fields the agent can't forge.
- **Runtime state enum** (`ready | needs_build | build_failed | process_failed`) driving launcher badges.
- Sandboxed iframe with **srcdoc-injected bridge** + theme variable map (`os-bridge.js` `THEME_VAR_MAP`) — the model for Longformer **Tier-3** (untrusted/MCP Apps) only.

**puter**: app registry with per-app **scoped tokens** at launch (never the super-token), file-type associations, `index_url` host validation to prevent same-origin escapes.

**Adopt:**
1. AppManifest in plugin storage with versions, provenance, trust tier, declarative data bindings.
2. Refine/linked-app protocol + primeComposer event verbatim.
3. Live data via Query bindings + tool invoke, not re-prompting.
4. Theme-bridge + null-origin sandbox for Tier-3 only; Tier-1/2 apps are validated manifest data needing no build pipeline.
5. Per-app capability tokens (puter model, aligned with D10).

**Portability corollary (now in spec §10.8):** apps stay data; independence comes from a standalone `longformer-runtime` package (renderer + registry + `ActionBinder`/`EntityProvider` seams, zero shell imports — the shell consumes it through the same seams), plus a one-way **eject-to-code** exporter for apps that outgrow the block vocabulary. The matrix-os contrast is the cautionary tale: its apps require an injected shell bridge, so they only run where the shell runs.

---

## 6. Desktop & windowing

Longformer's `surface-manager` is already ahead of both references on **adaptivity** (form-factor reflow, phone carousel, watch glances) but behind on **persistence and polish**:

- **matrix-os persists layout** — open + minimized + **closed** windows (closed layouts retained, max 50, restored on relaunch), debounced 500ms PUT (`useWindowManager.ts`). Puter loses window geometry on refresh. Persist layouts keyed by user + form factor.
- **puter has the best snap UX** — edge/corner zones with a 600ms delayed placeholder preview (`UIWindow.js`).
- matrix-os dock: sections (system / generated apps / games), new apps prepend at the outer edge sorted by launch time until the user reorders; pin/rename/regenerate-icon context menus.
- matrix-os built-ins use `__path__` aliases rendered natively (never iframed) — mirrors Longformer's `workspace:` IDs vs generated `appId`s.
- puter's BroadcastChannel cross-tab desktop sync; `single_instance`/`openWindowExclusive` semantics.

**Adopt:** layout persistence API (matrix pattern) → snap zones (puter UX) → dock sections → exclusive/single-instance window modes → per-workspace minimum sizes in policies.

---

## 7. Adaptivity model (D8)

The AndroidX adaptive libraries give Longformer a **derivation pipeline** to replace flat form-factor switching:

```
container size + posture → WindowAdaptiveInfo → PaneScaffoldDirective
  → (+ destination history + AdaptStrategies) → ScaffoldValue → render
```

- **Directive** = layout capacity (max horizontal/vertical partitions, gutters, preferred pane widths): Compact/Medium → 1 pane, Expanded → 2, Large/XL → 3.
- **AdaptStrategy** per pane when space runs out: **Hide**, **Reflow** (under anchor), **Levitate** (sheet/dialog). These three verbs are exactly what block `onCompact` declarations need.
- **Navigation is history-aware**: `ThreePaneScaffoldNavigator` keeps `(paneRole, contentKey)` history; default back behavior is `PopUntilScaffoldValueChange` — back collapses panes before popping. Longformer's `phoneStack` is the seed; generalize it to pane destination history shared across form factors so resizing 2-pane → 1-pane keeps the right pane visible.
- **NavigationSuiteScaffold** derives nav chrome (bar/rail/drawer) from adaptive info — don't hardcode "phone = bottom tabs."
- Canonical layouts from the samples: **list-detail, supporting-pane, feed, single-focus** — the Tier-3 container template catalog.
- Pane drag-handles with persisted split ratios keyed by scaffold value.

**Key correction to current code:** evaluate size class **per container** (a 380px desktop window gets phone-like treatment), keeping `FormFactor` only as an input/chrome profile. Today `policies/index.ts` jumps straight from FormFactor to layout.

**Adopt:** `useContainerAdaptiveInfo` hook → directive layer in TS → pane allocator replacing `reflowTabletWindows` → pane destination history + scaffold-aware back → four canonical containers → block `adaptivity` descriptor (`paneRole`, `adaptStrategy`, `idealColumns`, `minWidth`, `inputProfiles`).

---

## 8. Registry & distribution (D2/D5)

**shadcn's registry is the distribution blueprint** (`shadcn-ui/packages/shadcn/src/registry/`):

- Per-item JSON manifest (Zod-validated), typed items (`ui`, `block`, `hook`, `lib`, `theme`, `page`, `file`), **`registryDependencies`** with recursive resolution + topological install order, file dedupe by target path, deep-merged css/env/deps.
- CLI copies **source into the consumer repo** — no opaque npm package. Namespaced registries (`@acme/button`) with auth headers.
- Build pipeline: author → validate (schema + file existence) → build `public/r/*.json` → serve.

**Longformer registry should differ:** items ship CSS Modules + `--lf-*` overrides (never shadcn's `--background` namespace, no Tailwind config merging by default); each block manifest also carries **schema + prompt fragment + golden examples + adaptivity descriptor** (the Generation Contract makes the registry serve both humans and the model); add item types `registry:block`, `registry:container`, `registry:prompt`, `registry:adaptivity`; install-time filtering by host adaptivity profile.

**Adopt:** fork the shadcn schema/resolver shape; `lf add <block>` CLI; one `defineBlock()` source emitting registry JSON + JSON Schema + prompt + examples.

---

## 9. Engines, security & isolation (D9/D10)

NemoClaw (enterprise-hardened) and NanoClaw (minimal-auditable) attack the same problem from both ends; together they give Longformer a concrete D10 checklist:

**From NemoClaw** (`nemoclaw-blueprint/`):
- **Digest-pinned engine images** (dual top-level + digest field to defeat registry swaps).
- **Deny-by-default egress YAML** with L7 method/path rules **bound to specific binaries** — npm registry reachable only by the agent binary, not arbitrary processes.
- **Policy tiers** (restricted/balanced/open) + **opt-in presets** (GitHub, messaging deliberately removed from baseline) — least-privilege as install-time UX.
- **Credentials never enter the sandbox**: gateway is system-of-record; env-name-only CLI registration; routed inference (`inference.local`) doubles as the DLP/credential-injection checkpoint.
- **Plan/apply/rollback** for engine provisioning with atomic state + migration snapshots.
- Gateway and agent run as **separate UIDs** inside the sandbox; config hash verified at start.

**From NanoClaw** (`nanoclaw/docs/`, `src/`):
- **The container proposes; the host executes.** Agent emits `kind: 'system'` rows into an outbound SQLite table; the trusted host validates and applies. This is the cleanest implementation of "the AI is never the security boundary" — Longformer mutations should be typed intents enforced by the shell.
- Mount table isolation: project root never mounted; nested read-only config overlays on read-write workspaces; **external mount allowlist that fails closed** (no file ⇒ nothing extra mounts).
- Optional egress lockdown via internal Docker network (proxy env alone is insufficient — non-proxy-aware tools bypass it).
- Host-side command gate + role model (owner/admin, `unknown_sender_policy`); audit tables for dropped messages.
- Heartbeat-based stuck detection instead of naive idle timeouts.

**Adopt (D10 checklist):** typed mutation intents + host enforcement; capability-scoped per-app/per-engine tokens; digest-pinned engines with deny-default egress manifests + permission-preset cards in Settings; gateway-held credentials + routed inference; plan/confirm/apply/rollback for engine installs; user-visible audit stream.

---

## 10. Automations & orchestration

**CrewAI's core lesson: Flows for automations, Crews only inside steps.**

- **Flows** = event-driven deterministic DAGs: `@start`, `@listen`, `@router` (conditional branching by returned label), `and_`/`or_` composite triggers, typed Pydantic state, `@persist` + resume-from-state-id, `@human_feedback` pause points. This is the right shape for Longformer's cron/event automations — auditable, resumable, branchable.
- **Crews** (role-based autonomous multi-agent) are for genuinely ambiguous steps, invoked *inside* a flow step — not for scheduled jobs.
- Task **guardrails** (function or LLM validation with bounded retries) and `output_pydantic` structured outputs slot into the same validation position as the registry's block validators.
- Unified **Memory with filesystem-like scopes** (`/user/…`, `/app/{id}/…`) aligns with capability scoping; **Knowledge** (external docs/RAG) kept separate from memory (extracted run facts).

**CrewAI → AG-UI mapping** (both are officially integrated): flow step start/end → `STEP_STARTED/FINISHED`; human feedback pause → `RUN_FINISHED outcome: interrupt` → confirmation surface → resume.

**Surfacing (UX):** Agent Canvas makes automations a **primary nav route** with search, active/inactive groups, run-now, and prebuilt "recommended automation" launchers; Hermes puts cron jobs in the rail with completion toasts + unread badges. Don't bury automations in settings.

---

## 11. Onboarding & install story

- **NanoClaw's three-level setup logging** (`docs/setup-flow.md`): clean interactive UI → machine-readable progression log → per-step raw logs — designed so an AI can diagnose failed installs. Plus **Claude handoff on failure** (interactive self-repair with session resume) and per-checkout install slugs enabling clean uninstall.
- **NemoClaw**: installer pins a git ref and verifies integrity; 8-step resumable wizard; policy tier selection as an onboarding step.
- **puter**: one docker-compose with valkey/mariadb/S3/nginx + healthchecks — the credible self-host baseline.
- **matrix-os marketing**: managed cloud / `curl|bash` VPS / CLI trinity; "copy this prompt to your coding agent" CTA as a viral loop; "not a chat box beside your software" positioning (already catalogued in `packages/longformer-www/docs/DESIGN-INSPIRATION.md`).

**Adopt:** wizard with resumable state + tiered permissions + AI-repairable logs; one-command self-host; copy-prompt CTA on the marketing site.

---

## 12. Research findings that shape product policy

From **Chen 2025** (Generative Interfaces for LMs, ACL 2026) and **Macaron-A2UI** (both in `generative-ui/papers/`):

1. **Generative UI wins big — but not always.** Up to 72–84% preference over chat; strongest for interactive tasks (80%), data viz (94%), business planning (88%); weakest for math/how-to where text suffices (~50%). **Product rule: gate UI emission.** Add a `shouldEmitUI(context)` decision to the Generation Contract; Macaron trains an explicit `no_ui_chat` negative class and its corpus is only ~72% UI-turns.
2. **Cognitive load caps are enforceable rules, not vibes.** Macaron's L3 metric hard-fails >4 interactive widgets or >8 options per surface. Encode these as validator rules.
3. **Structure before pixels.** Chen's +4–17% gains come from structured intermediate representations and iterative refinement with adaptive rubrics — validating the blocks/schema approach over freeform HTML (which also had minutes-level latency; refinement loops belong in async app generation, not chat).
4. **Schema-light prompting works.** Macaron's best model beats full-schema frontier baselines without schema hints; for API models, ship compact catalog names + golden examples in the prompt and keep the full JSON Schema in the validator + repair loop (91% first-pass → 99% after lint/retry).
5. **UI must be grounded in the text response** (options mentioned in prose; L2 failure otherwise) — matches Calm Console prose-first.
6. **Build an eval bench.** Port Macaron's atomic/depth/width task split + L1 (parse/schema) / L2 (intent alignment) / L3 (value-add, load) judges to the Longformer block catalog before scaling generation.

---

## 13. Anti-patterns catalog

Observed shipping mistakes to avoid:

| Anti-pattern | Seen in | Rule for Longformer |
|---|---|---|
| UI imports agent internals directly (version skew breaks everything) | hermes-webui | Engine adapters behind a versioned protocol, always |
| Global process env for per-session context | hermes-webui | Session context flows through request scope |
| Cumulative token math for context % | hermes-webui (#1436) | Last-prompt tokens only |
| One global event store across conversations, cleared manually | agent-canvas | Scope stores by session; atomic clears |
| Backend/engine forks sprinkled through UI code | agent-canvas | Capability flags on the adapter interface |
| Whole-program re-emission on every app edit | (prevented in openclaw-os) | Merge-by-statement patches |
| Full per-app build pipeline for simple generated apps | matrix-os | Tier-1/2 apps are data; builds only for Tier-3 code |
| Two UI stacks drifting (shell vs generated apps) | matrix-os | One registry, one token system |
| Session-only window layout | puter | Persist layouts incl. closed-window geometry |
| Monolithic 4k-line window manager / 10k-line panels file | puter, hermes | Keep reducer + policies modular (already good) |
| Third-party apps with `allow-same-origin` | puter | Null-origin sandbox for untrusted; capability tokens |
| Baseline policies granting messaging/GitHub to every sandbox | nemoclaw (fixed) | Opt-in presets, deny-default |
| Trusting HTTPS_PROXY as egress control | nanoclaw docs | Network-layer lockdown for engine workloads |
| UI generated for every query regardless of need | chen-2025 limitation | UI-trigger gating |
| >4 interactive widgets in one surface | macaron L3 | Validator hard limit |
| Crew-style autonomous agents for cron jobs | crewai guidance | Flows (deterministic DAGs) for automations |
| Tailwind/CSS as the AI generation surface | agent-canvas, chen | Blocks only; AI never authors styles (D1) |

---

## 14. Priority roadmap

Sequenced by dependency and leverage:

**P0 — foundations that everything else builds on**
1. Registry v0: `defineBlock()` (Zod) → schema + validator + prompt + render, per D5, using OpenUI's `defineComponent`/`generatePrompt` mechanism as the model.
2. AG-UI transport adapter (SSE + WS) with typed events; `STATE_DELTA` for shell/app state; engine registry with health + switch overlay (Agent Canvas pattern).
3. Composer footer chips + context ring; Calm-Console chat spec; approval/clarify blocks.

**P1 — the flagship loop**
4. Generated-app lifecycle: AppManifest + versions + linked-app refine protocol + primeComposer; Query-style live data bindings.
5. Desktop persistence (layouts incl. closed), dock sections, snap zones.
6. Container-adaptive directive layer + pane destination history in SurfaceManager; block adaptivity descriptors.

**P2 — hardening + scale**
7. D10 enforcement: typed mutation intents, capability tokens, audit stream; engine install with digest pinning + permission presets.
8. Automations workspace: Flow-style DAG runner mapped to AG-UI interrupts; cron surface with run-now + history.
9. Block eval bench (Macaron L1–L3, atomic/depth/width) + UI-trigger gating policy.

**P3 — distribution**
10. `lf add` CLI + hosted registry; marketing site with copy-prompt CTA; one-command self-host stack.

---

---

## 15. VS Code addendum

Reviewed after the initial synthesis (`vscode/`, entry points in `vscode.guide.md`). VS Code's through-line: **layout, views, chat parts, commands, and themes are all registered, persisted, conditionally-visible subsystems** — the same shape as the D5 registry + SurfaceManager + one agent session, shipped at scale for a decade. Adopt the patterns with React idioms; never port the platform stack.

### 15.1 Chat content-part renderer (highest-value steal)

VS Code chat (`src/vs/workbench/contrib/chat/`) is the most-shipped AI chat UI in existence, and its renderer architecture is exactly what the agent-blocks system should converge on:

- A streamed response is an array of **typed content parts** (~30 `kind`s: `markdownContent`, `thinking`, `toolInvocation`, `confirmation`, `textEditGroup`, `treeData`, `planReview`, `changesSummary`, `undoStop`…). Each kind maps to a dedicated renderer — the content-part registry is the D5 registry applied to chat.
- **Diff-based updates**: every part implements `hasSameContent(other)` so streaming re-renders only replace changed parts (`chatListRenderer.ts`). In React: stable keys + memo comparators keyed on part identity/state.
- **Progressive rendering applies to markdown only** (word-budget throttle); structured parts render atomically.
- **One session, many surfaces**: the same `ChatWidget` powers the sidebar view, editor tabs, quick-chat overlay, and inline editor chat via a `location` enum — the model for Longformer's one agent session appearing in Chat workspace + inline overlays.
- **Tool approval UX** (`languageModelToolsConfirmationService.ts`): confirmation parts with remembered decisions scoped **session | workspace | profile**, keyed by a **SHA-256 hash of tool+params** (never raw params). This is D10's deterministic gate, production-tested.
- **Checkpoints**: `undoStop` parts create restore points with file baselines and diff summaries — the pattern for agent undo/restore.

Start with ~8 part kinds (markdown, thinking, tool, confirmation, todo, file-change, error, generated-surface), not 30.

### 15.2 Shell layout & storage scoping

`layout.ts` + the serializable grid persist layout with **two scopes**: sizes in **profile** storage, visibility/position in **workspace** storage — and hidden parts remember their cached size so restore feels right. The auxiliary bar (≈ context panel) supports **maximize** with a restore-snapshot, and zen mode stores an exit snapshot. Adopt the `ShellLayoutState` + scope split (application / profile / workspace / session); use a React panel library, not a ported grid engine. Keep SurfaceManager state separate from shell chrome state, as VS Code separates editor-group layout from the workbench grid.

### 15.3 Views/contribution registration

`ViewContainersRegistry` + `ViewsRegistry` (+ `viewDescriptorService.ts` persisting user moves in profile storage) formalize what 35 workspaces need: `defineWorkspace({ id, title, icon, defaultZone, when, render })` instead of a hardcoded router switch, with `when`-clause context keys gating visibility and user relocations persisted. Workbench contributions load in phases (`BlockStartup` → `Eventually`) — register heavy workspaces lazily after first paint.

### 15.4 Commands, context keys, quick input

Central command registry with `when` expressions + keybinding weights + quick-input multi-step flows (`src/vs/platform/{commands,contextkey,quickinput}/`). For Longformer: a command bus over the workspace/block registries powers the ⌘K palette, keybindings, **and the agent's shell-navigation allowlist** — the agent executes validated commands, never arbitrary UI mutations (D10). A `when`-clause subset (no full grammar) is enough for v1.

### 15.5 Token registry over flat tokens

`registerColor(id, { light, dark, hcDark, hcLight })` + derived transforms (`darken`, `transparent`) emit `--vscode-*` CSS vars (`colorUtils.ts`). A registry (vs the current flat `--lf-*` file + `tokens.ts` mirror) buys: derived tokens without drift, theme validation via schema, a prompt-safe token catalog for the AI, and a single source for multi-platform emission (D7). Keep `--lf-*` as compiled output.

### 15.6 Webview sandboxing (Tier-3)

`webviewElement.ts`: iframe per untrusted surface with unique origin, strict CSP, typed `To/FromWebviewMessage` protocol with a pending queue until ready, host-controlled resource loading, and theme injection. Confirms the Tier-3 design (matrix-os bridge + null-origin sandbox); skip the service-worker resource loader.

### 15.7 Also worth copying

- **Notifications**: priority levels + `neverShowAgain` scoped workspace/profile/application; zen-mode DND.
- **Status bar**: contributed entries with alignment + priority — agent mode, model, sync status as registered entries.
- **Progress**: `withProgress({ location })` — one API, multiple surfaces (status bar, notification, dialog), cancellable.
- **Settings editor**: searchable UI generated from the configuration registry's JSON schema with per-setting scope tags — the registry-driven settings workspace.
- **Profiles** (later): profile = storage namespace bundle (settings, keybindings, approvals) — clean "work vs personal" switch.

### 15.8 Do not import

Custom grid engine, imperative DOM widget system, `createDecorator` DI (use React context/hooks), the extension-host process model (Workers only when sandboxing demands), Monaco-coupled chat input, 30 content kinds on day one.

---

*Full per-repo analyses (with granular file-path citations) were produced during the July 2026 review; this document is the synthesis. Re-run targeted deep-dives per repo as areas move into implementation.*
