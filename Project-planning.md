# Longformer UI Experiments — Project Planning

> Consolidated design notes from architecture review (July 2026).  
> Covers how UI Experiments workspaces fit together, how AI + shared data should permeate the integrated experience, recommended tech stack, and **full runtime infrastructure** across Odysseus, OpenHands (agent-canvas), and OpenClaw OS.

---

## Table of contents

1. [Executive summary](#executive-summary)
2. [Current architecture](#current-architecture)
3. [Workspace taxonomy](#workspace-taxonomy)
4. [How workspaces fit together](#how-workspaces-fit-together)
5. [What's working well](#whats-working-well)
6. [Friction points](#friction-points)
7. [Relationship to other repos](#relationship-to-other-repos)
8. [Integration phases (shell)](#integration-phases-shell)
9. [AI across all workspaces](#ai-across-all-workspaces)
10. [Shared data between workspaces](#shared-data-between-workspaces)
11. [Session model](#session-model)
12. [Wiring OpenUI + OpenClaw + Longformer](#wiring-openui--openclaw--longformer)
13. [Anti-patterns](#anti-patterns)
14. [Phased rollout (AI + data)](#phased-rollout-ai--data)
15. [Quick wins](#quick-wins)
16. [Tech stack recommendations](#tech-stack-recommendations)
17. [Full platform stack (Odysseus, OpenHands, OpenClaw)](#full-platform-stack-odysseus-openhands-openclaw)
18. [Automations and memory (cross-platform)](#automations-and-memory-cross-platform)
19. [Backend architecture](#backend-architecture)
20. [What to take from each project](#what-to-take-from-each-project)
21. [Gen UI strategy](#gen-ui-strategy)
22. [Runtime architecture](#runtime-architecture)
23. [Suggested monorepo shape](#suggested-monorepo-shape)
24. [Dev & prod topologies](#dev--prod-topologies)
25. [Prerequisites checklist](#prerequisites-checklist)
26. [Phased tech decisions](#phased-tech-decisions)
27. [Hard recommendations](#hard-recommendations)
28. [Key file references](#key-file-references)
29. [Next steps](#next-steps)

---

## Executive summary

The UI Experiments repo (`longformer-ui` + `longformer-demo`) is not a collection of random pages — it is a **layered AI OS prototype** with:

- A stable shell (`AppShell`: rail | sidebar | main | context panel)
- A multi-form-factor composition layer (`SurfaceManager` + Desktop)
- ~34 workspace views (productivity, comms, control plane, media)
- Proto agent UX (Chat, context panel, hover assistant, generated UI blocks)

The integration story is already visible in the demo. The main product work is:

1. **Dedupe concepts** (calendar/schedule/tasks, comms channels)
2. **Split the god-object demo** (`App.tsx` ~1,100 lines)
3. **Plug one agent runtime + one generated-UI pipeline** through the context panel
4. **Introduce shared entity store + focus context** so AI and workspaces share data

**Longformer becomes the presentation OS.** OpenClaw / agent-canvas / OpenUI become **engines** plugged in per workspace. The **backend** is not one repo — it is a **composed platform**: OpenClaw Gateway (agent orchestration) + plugin persistence + optional OpenHands agent-server (coding sandbox) + optional Odysseus (productivity/RAG services). See [Full platform stack](#full-platform-stack-odysseus-openhands-openclaw).

---

## Current architecture

### Three-layer model

| Layer | Package / component | Role |
|-------|---------------------|------|
| **UI kit** | `longformer-ui` | Tokens, primitives, ~34 workspaces, surface manager |
| **Integration shell** | `longformer-demo` | Wires mock data → layout → shell chrome |
| **Shell frame** | `AppShell` | Stable `rail \| sidebar \| main \| contextPanel` |

Every workspace plugs into the same slots. Switching Chat → Notes → Desktop should not reshuffle chrome — only `main` (and optionally `sidebar`) changes.

Key integration files:

- `packages/longformer-demo/src/App.tsx` — shell controller, all mock state
- `packages/longformer-demo/src/workspace-layout.tsx` — workspace router (`buildWorkspaceLayout`)
- `packages/longformer-demo/src/workspace-config.ts` — workspace IDs, nav rail, pinning

### Surface manager

Same workspaces can render:

- Full-screen (nav rail)
- Desktop windows (`buildWorkspaceWindowContent()` reuses components without sidebars)
- Phone stack / watch glances / widget tiles

Form factors: `desktop | tablet | phone | watch | widget`

---

## Workspace taxonomy

Treat ~34 workspaces as **four product layers**, not 34 equal apps.

### Layer 1 — Shell & navigation (always on)

- NavRail, AppShell, HoverNavRail / HoverAppTray / HoverAssistantBubble / HoverStatusBar
- Desktop (form factors, windowing, widgets, custom apps)
- Apps (marketplace + installed)
- Settings

### Layer 2 — Agent surface (the “brain”)

- **Chat** — primary agent UX
- **Orchestrator** — fleet: agents, jobs, traces, playground
- **Server** — deploy/infra ops
- **Psyche** — memory, RAG, vector DB, soul/ethics docs
- **Transcribe**, **Tickets** — ops/support workflows
- **Generated / Design System** — agent-rendered UI + component catalog (59 block types)

### Layer 3 — Personal productivity (user-owned data)

- Notes, Files, Sheets, Tasks, Calendar, Schedule
- Reader, Life Planning
- Notifications

### Layer 4 — Comms & media (channel simulators)

- Messages, Slack, Social, Email, Contacts, Phone
- Music, Vision, Camera, Maps, Weather, Calculator
- Wallet, Bank/Crypto

Layers 3–4 are mostly **reference UIs** (mock data). Layers 1–2 are where the integrated AI experience lives.

### Full workspace list (from `workspace-config.ts`)

Chat, Messages, Slack (Groups), Social, Contacts, Notes, Email, Calendar, Schedule, Files, Sheets, Wallet, Bank/Crypto, Music, Vision, Reader, Maps, Camera, Weather, Calculator, Phone, Tasks, Notifications, Apps, Settings, Desktop, Server, Orchestrator, Tickets, Transcribe, Life Planning, Psyche, Generated (Design System).

---

## How workspaces fit together

### Shell layout

```
                    ┌─────────────────────────────────────┐
                    │  NavRail (pinned workspaces)        │
                    └─────────────────────────────────────┘
┌──────────┬──────────────────────────────┬──────────────────────────┐
│ Sidebar  │  Main workspace              │  Context panel           │
│ (per-WS) │  Chat / Notes / Desktop / …  │  Assistant + Browser/Diff│
└──────────┴──────────────────────────────┴──────────────────────────┘
                              │
                    Desktop mode: same workspaces
                    as floating windows + dock/tray
```

### Primary user loop (already prototyped)

1. User works in any workspace (Notes, Files, Orchestrator, etc.)
2. **HoverAssistantBubble** or **ChatContextPanel** opens a side agent
3. **ChatContextDrawer** exposes browser / files / diffs — agent context tied to what you're viewing
4. Agent can spawn **Generated UI** blocks or open another workspace in a **Desktop window**

### Secondary loop (desktop / apps)

1. **Apps** marketplace installs apps (many map via `APP_WORKSPACE` in `App.tsx`)
2. **Desktop** launches them as windows; **CreateAppModal** creates custom surfaces
3. Cross-links exist (e.g. Contacts → Messages / Email via `setWorkspaceId`)

### Suggested nav rail grouping (future)

| Section | Examples |
|---------|----------|
| Agent | Chat |
| Work | Notes, Files, Tasks, Calendar, Sheets |
| Comms | Messages, Email, Slack (or unified Inbox) |
| Control plane | Orchestrator, Server, Psyche |
| System | Desktop, Apps, Settings |

Keep **8–10 pinned items**; push the rest to Desktop + Apps + command palette.

---

## What's working well

1. **Consistent shell, varied interiors** — workspaces feel like one product
2. **Generated UI ↔ primitives bridge** — `DesignSystemWorkspace` + `generated-ui/blocks/*` → agent emits schema, Longformer renders
3. **Ops workspaces cluster** — Server + Orchestrator + Psyche + Tickets + Transcribe = operator console
4. **Desktop as composition layer** — multi-tasking without an overcrowded nav rail
5. **Cross-form-factor story** — phone stack, watch glances, widgets
6. **Window embedding** — `buildWorkspaceWindowContent()` shares workspace components with full-screen mode

---

## Friction points

### 1. Demo is the integration layer (getting heavy)

- `App.tsx` ~1,100 lines, state for every workspace
- `WorkspaceLayoutViewModel` is a monolithic prop bag with lots of `unknown`

**Recommendation:** Split into:

- `WorkspaceRegistry` — id, component, sidebar factory, pin rules, desktop launch rules
- Per-workspace hooks/stores — `useNotesWorkspace()`, etc.
- Thin shell controller — active workspace, assistant open, surface manager, theme only

### 2. Too many nav-rail peers

34 workspaces in a flat list overwhelms even with overflow. Use grouped rail or short pin + Desktop/Apps/⌘K.

### 3. Comms fragmentation

Messages, Slack, Social, Email, Phone, Contacts overlap. Pick:

- **One Inbox** with channel tabs, **or**
- Separate UIs but **unified data model** (`Thread`, `Channel`, `Contact`) so the agent sees one conversation graph

### 4. Calendar vs Schedule vs Tasks

Three scheduling surfaces with overlapping concepts. Likely merge:

- **Calendar** = time grid
- **Schedule** = backlog/projects (closest to product task manager)
- Fold or dedupe **Tasks** mini-calendar

### 5. Placeholder vs built workspaces

Orchestrator, Server, Tickets, Transcribe have many `PlaceholderView`s. Mark workspaces as:

- Shell-ready
- Data-ready (needs backend)
- Agent-native (should be generated, not hand-built)

### 6. Agent not connected to workspace context

Assistant panel uses static demo copy. **ChatContextPanel** shape is right, but nothing passes active workspace context automatically.

**Target contract:**

```ts
type AgentContext = {
  workspaceId: WorkspaceId;
  selection?: { type: 'note' | 'file' | 'thread'; id: string };
  surface?: { windowId: string; appId: string };
  linkedArtifacts?: …;
};
```

OpenClaw already has `linkedApp` / `linkedArtifact` in session workspace — maps cleanly onto context panel.

### 7. Separate assistant vs chat message stores

Demo uses `assistantTabMessages` and `chatTabMessages` separately — users can get divergent conversations. Merge or sync.

---

## Relationship to other repos

| Repo | Role in integrated experience |
|------|--------------------------------|
| **OpenUI** | Agent emits `GeneratedSurfaceSchema` / OpenUI Lang → render in Chat, Desktop, artifacts |
| **openclaw-os (Claw client)** | Gateway, sessions, apps, artifacts, crons, notifications — **runtime** Longformer shells |
| **agent-canvas** | Deep coding-agent UX — optional **Code** workspace or embedded panel, not the whole OS |
| **Odysseus** | Reference + optional MCP/HTTP bridge for email/calendar/research — not core platform |
| **Hermes WebUI** | UX reference (SSE, workspace panel) — not backend |

### Plausible end state

```
Longformer shell (nav + desktop + assistant)
    ├── Chat → OpenClaw gateway + OpenUI renderer
    ├── Orchestrator / Server / Psyche → operator APIs
    ├── Notes / Files / Sheets → user data stores
    ├── Desktop windows → any workspace OR agent-spawned app
    └── agent-canvas → "Code" workspace for software agents
```

---

## Integration phases (shell)

| Phase | Focus |
|-------|--------|
| **1 — Shell consolidation** | Workspace registry; slim `App.tsx`; command palette; notification deep-links |
| **2 — Agent spine** | Wire Chat + context panel to OpenClaw; pass `AgentContext`; OpenUI streams |
| **3 — Data backbone** | Shared types: Person, Thread, Document, Task, Event; comms from one store |
| **4 — Desktop & apps** | Custom apps = persisted Generated UI or embeds; marketplace = templates + integrations |
| **5 — Form factors** | Phone/tablet layouts; widgets = generated block subsets |

---

## AI across all workspaces

### Goal

**One agent runtime, many surfaces, one data graph.**

- One agent (conversation + tools + memory)
- One shared data layer (entities workspaces read/write)
- One context bus (focus, selection, open windows)
- Many presentation surfaces (Chat, side panel, inline chips, generated blocks)

Workspaces are **views** over shared data, not siloed apps with their own AI copies.

### What exists today

| Component | Role |
|-----------|------|
| `ChatContextPanel` | Global agent slot in AppShell context panel |
| `ChatContextDrawer` | Browser / diffs / files — proto tool output panels |
| `HoverAssistantBubble` | Opens assistant from non-Chat workspaces |
| `FloatingChat` | Secondary chat surface |
| `ConversationPanel` | Narrow always-available AI in context panel |

**Current behavior:**

- Chat workspace → agent + context drawer always available
- Other workspaces → bubble opens same panel
- Desktop → bubble hidden; Chat or FloatingChat

**Gap:** No `AgentContext` or shared store; Life Planning `AiCoachView` has its own composer (preview UX, should delegate to global agent).

### Three-layer architecture (AI + data)

```
Presentation Layer          Intelligence Layer           Shared Data Layer
─────────────────────         ────────────────────         ─────────────────
Workspaces                    Agent Session                Entity Store
AppShell + Context Panel  →   Tools / MCP            →     Event Bus
Desktop Windows               Memory / Psyche              Focus / Selection Context
```

### WorkspaceFocus (context bus)

Every workspace publishes what the user is looking at:

```ts
type WorkspaceFocus = {
  workspaceId: WorkspaceId;
  focus?: {
    kind: 'note' | 'file' | 'thread' | 'task' | 'event' | 'ticket' | 'app' | 'window';
    id: string;
    title?: string;
    snippet?: string;   // ~500 chars for prompt injection
    uri?: string;       // stable deep link
  };
  selection?: { kind: string; ids: string[] };
  surface?: { windowId?: string; appId?: string };
  meta?: Record<string, unknown>;
};
```

**Publishers:** Notes, Email, Files, Desktop (window focus), Orchestrator (active run), etc.  
**Consumers:** Global assistant, ⌘K, prompt chips, agent tools (`get_focus()`, `open_in_workspace()`).

### Six interaction patterns

#### A — Ambient assistant

`HoverAssistantBubble` + context panel everywhere.

Enhance with:

- Workspace-aware prompt chips
- Selection → “Ask about this”
- `⌘K` command palette (natural language + navigation)

Borrow OpenClaw's `primeComposer`:

```ts
// OpenClaw pattern
window.dispatchEvent(new CustomEvent("openclaw-os:prime-composer", {
  detail: { text, submit }
}));

// Longformer equivalent
longformer:prime-assistant { text, context?, submit? }
```

#### B — Selection → context attachment

Composer shows chips: `[📄 Q3 Planning note ×] [✓ Task: Ship v2 ×]`  
Maps to message `<context>` envelope (OpenClaw `buildThreadContextPayload` pattern).

#### C — Inline AI affordances (not full chat)

| Workspace | Examples |
|-----------|----------|
| Notes | Continue writing, extract tasks |
| Email | Draft reply, summarize thread |
| Files | Explain, smart rename |
| Schedule | Suggest time, break down task |
| Tickets | Suggest resolution |

All call same `agent.send({ message, attachments: [focus] })`.

#### D — Agent-driven navigation & mutation

Example tools:

```ts
open_workspace({ workspace: 'notes', noteId })
create_task({ title, dueDate, sourceNoteId })
append_to_note({ noteId, blocks })
show_generated_ui({ schema })
link_entities({ from, to, relation: 'references' })
```

#### E — Notifications as AI loop

Agent activity → Notifications → deep link to entity + restore context panel.

#### F — Psyche as shared memory backend

Not a silo — backend view of agent memory. Other workspaces surface citations; Psyche is admin/editing UI.

### Generalize context drawer

| Tab | Source | Agent use |
|-----|--------|-----------|
| Browser | Web fetch | Research |
| Files | Files workspace | Read/edit |
| Diffs | Code/git | Review |
| Preview | Generated UI | Agent output |
| Memory | Psyche | RAG, citations |
| Trace | Orchestrator | Debug runs |

---

## Shared data between workspaces

### Entity store (domains)

| Entity | Used by |
|--------|---------|
| `Person` / `Contact` | Contacts, Messages, Email, Phone, Slack |
| `Thread` / `Message` | Chat, Messages, Slack, Email, Social |
| `Document` / `Note` | Notes, Files, Reader, Psyche RAG |
| `Task` / `Project` | Tasks, Schedule, Tickets, Orchestrator |
| `Event` | Calendar, Schedule |
| `File` | Files, Sheets, Camera, Transcribe |
| `App` / `Artifact` | Apps, Desktop, Generated UI |
| `Notification` | Notifications, all workspaces |
| `AgentRun` / `Trace` | Orchestrator, Server, Chat |

**Rules:**

- Workspaces **read** via selectors (`useTasks()`, `useActiveNote()`)
- Workspaces **write** via mutations (`taskStore.complete(id)`)
- Cross-workspace nav uses **entity IDs**, not bare `setWorkspaceId`

**Better navigation:**

```ts
// Instead of:
setWorkspaceId('messages')

// Prefer:
navigate({ workspace: 'messages', focus: { kind: 'thread', contactId } })
```

### Entity graph (links everything)

```
Note "Q3 Plan" ──references──▶ Task "Launch beta"
Task "Launch beta" ──blocks──▶ Event "Stakeholder review"
Person "Dana" ──assigned──▶ Task "Launch beta"
Email thread ──spawned──▶ Note "Meeting notes"
```

Extend Notes graph (`buildNotesGraph`) to global graph; Psyche knowledge graph UI visualizes it.

### Sharing mechanisms

1. **Unified search** — one index; ⌘K + agent `search_entities` tool
2. **Event bus** — `task:updated` → Schedule refreshes, notification fires, agent gets tool result
3. **Scratchpad entity** (optional) — shared clip stash between user and agent
4. **Desktop window focus** — `surface.activeWindowId` updates `WorkspaceFocus.surface`
5. **Same data hooks** — window embed and full-screen workspace share hooks via `buildWorkspaceWindowContent()`

---

## Session model

| Session type | Scope | Where shown |
|--------------|-------|-------------|
| **Main session** | Primary agent thread | Chat tabs, default side panel |
| **Scoped threads** | Per-project (optional) | Chat nav sections |
| **Ephemeral turns** | Inline “Summarize” actions | Same session, auto-attached context |

OpenClaw: 1 agent = 1 permanent session (`agent:<id>:main:openclaw-os`).  
Longformer can add project scoping without fragmenting Psyche memory (metadata filters).

**Critical:** Side panel and Chat must share one message store for the active conversation.

---

## Wiring OpenUI + OpenClaw + Longformer

Example end-to-end flow:

1. User in Notes selects paragraph
2. Longformer updates `WorkspaceFocus` + primes assistant
3. Message to OpenClaw with `context: [{ type: 'note', id, snippet }]`
4. Agent tools → `append_to_note`, `create_task`
5. Entity store updates → Notes + Tasks re-render
6. Agent streams OpenUI schema → context drawer Preview tab
7. User “Open as app” → Desktop window via `surface.openApp`

OpenClaw references:

- `ChatAppContext` — cross-route shared data (threads, apps, artifacts, notifications)
- `useThreadWorkspaces` — per-thread uploads, linkedApp, linkedArtifact
- `buildThreadContextPayload` — message context envelope
- `renderer-actions.ts` — `ContinueConversation`, `OpenUrl` from generated UI

---

## Anti-patterns

1. **Per-workspace AI backends** — one runtime, themed prompts only
2. **Duplicated entity state** — one Thread model, multiple views
3. **Agent without focus** — always default-attach `WorkspaceFocus` (user can detach)
4. **Workspace-only navigation** — never navigate without entity ID when context matters
5. **Giant view model** — replace `WorkspaceLayoutViewModel` with stores + registry
6. **Embedded coach chats** — Life Planning AiCoach should prime global assistant, not separate LLM

---

## Phased rollout (AI + data)

| Phase | Deliverables |
|-------|----------------|
| **1 — Context + prime** | `WorkspaceFocus` provider; auto-attach to messages; `primeAssistant()`; unify message stores |
| **2 — Entity store** | Shared stores for Contacts, Tasks, Notes, Files; entity-ID navigation; unified ⌘K search |
| **3 — Agent tools** | Store mutations + navigation; drawer tabs from tool results; OpenUI in drawer |
| **4 — Memory & ops** | Psyche → real memory API; Orchestrator runs; notification deep-links with context |
| **5 — Inline affordances** | Toolbar AI per workspace; replace embedded coaches; agent opens Desktop + generated apps |

---

## Quick wins

1. Collapse nav to 8–10 pinned items; rest via Desktop / Apps / ⌘K
2. Extract **workspace registry** from `workspace-layout.tsx` switch
3. Define **`WorkspaceFocus`** / **`AgentContext`**; thread shell → assistant
4. Pick one **control plane home** (Orchestrator vs Chat)
5. **OpenUI bridge** — agent JSON → `GeneratedSurfaceSchema` or OpenUI Lang → renderer
6. Mark **placeholders** in `workspace-config` (demo vs product)

---

## Tech stack recommendations

### Stack at a glance

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Longformer (React) — shell, workspaces, surface manager, tokens      │
│  OpenUI renderer — streaming chat, inline + app surfaces                │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ WebSocket + HTTP (same origin)
┌───────────────────────────────▼─────────────────────────────────────────┐
│  OpenClaw Gateway — agents, sessions, tools, MCP, crons, channels       │
│  Longformer / OpenClaw OS plugin — UI static, SQLite stores, hooks      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ optional
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
  agent-server            Odysseus APIs           External MCP
  (Code workspace)        (email/calendar…)       (GitHub, Slack…)
```

### Frontend tech stack

#### Keep from UI Experiments (Longformer)

| Piece | Why |
|-------|-----|
| **`longformer-ui`** | Tokens, primitives, 34 workspaces, `AppShell`, `SurfaceManager` — product chrome |
| **CSS modules + design tokens** | Cohesive “OS” look |
| **Vite** | Fast demo/dev; good for static SPA builds |
| **Portable kit model** | `main: src/index.ts` — consumable by any host app |

#### Adopt from OpenClaw OS (claw-client)

| Piece | Why |
|-------|-----|
| **React 19 + TypeScript 5.9** | Align versions across repos |
| **OpenUI stack** | `@openuidev/react-headless`, `react-lang`, `react-ui`, `lang-core` |
| **Engine abstraction** | `OpenClawEngine` implements `Engine` — swap backends |
| **Gateway client** | WebSocket protocol, session keys, device identity |
| **`ChatAppContext`** | Cross-route shared data |
| **`useThreadWorkspaces`** | linkedApp / linkedArtifact / uploads per thread |
| **`primeComposer` event pattern** | Any workspace seeds global agent |
| **Static export → plugin bundle** | Gateway serves UI; no separate frontend server in prod |

#### Adopt from agent-canvas (selectively)

| Piece | Why |
|-------|-----|
| **TanStack Query** | Server state with cache invalidation |
| **Zustand** | UI/session state |
| **Typed HTTP clients** | `@openhands/typescript-client` pattern |
| **Conversation + files + git UX** | Embed as **Code workspace** |

#### Defer / don’t copy wholesale

| Source | Avoid |
|--------|--------|
| **Hermes WebUI** | Vanilla JS + no bundler |
| **Odysseus frontend** | Separate overlapping app |
| **agent-canvas full shell** | HeroUI theme, i18n, entire route tree |
| **Dual CSS without plan** | Tailwind + CSS modules on every component |

#### Host app framework

**Option A — Extend OpenClaw OS (recommended for v1)**

- Evolve claw-client toward Longformer `AppShell` + workspaces, **or**
- Longformer demo becomes new client bundled into OpenClaw plugin
- **Prod:** static SPA at `/plugins/longformer` (same as openclaw-os)

**Option B — Standalone Longformer app**

- Vite SPA + separate backend URL
- More hosting/CORS/auth work; only if independence from OpenClaw is required

#### Package manager

- OpenUI / OpenClaw: **pnpm**
- Longformer today: **npm workspaces**
- **Recommendation:** unify on **pnpm** when merging monorepos

---

## Full platform stack (Odysseus, OpenHands, OpenClaw)

> **Gap note:** Earlier sections focused on frontend roles and “which backend owns what.” This section documents the **actual runtimes, services, databases, and tooling** each project requires so the integrated Longformer vision is deployable—not just wireable in a demo.

Longformer is **UI only** today. A working integrated product needs **three mature stacks** that already exist in your repos, plus **OpenUI** as the render pipeline:

| Platform | What it is | Primary language | Default entry |
|----------|------------|------------------|---------------|
| **OpenClaw + openclaw-os** | Personal agent gateway + workspace plugin | Node.js (gateway, plugin, UI) | `http://localhost:18789` (+ `/plugins/openclawos`) |
| **OpenHands agent-canvas** | Coding-agent UI + local stack launcher | TypeScript UI + **Python** agent-server | `http://localhost:8000` (ingress) |
| **Odysseus** | Self-hosted full productivity AI workspace | **Python** FastAPI + vanilla JS frontend | `http://localhost:7000` |
| **OpenUI** | Gen-UI language + React renderers (library) | TypeScript | npm packages consumed by Claw/Longformer |

These are **not interchangeable**. They overlap in product surface (chat, files, email) but differ in architecture. Longformer composes them; it does not replace their runtimes.

### Platform comparison (what each stack actually runs)

| Capability | OpenClaw Gateway | OpenHands (agent-canvas) | Odysseus |
|------------|------------------|--------------------------|----------|
| **Agent loop / LLM calls** | Gateway agents, provider config in OpenClaw | `openhands-agent-server` (Python SDK) | `src/agent_loop`, `llm_core` (FastAPI) |
| **Tool execution** | Gateway tools + MCP + skills | Terminal, file editor, browser, task tracker tools | `agent_tools`, shell, MCP |
| **Realtime to UI** | Gateway WebSocket (`chat.send`, events) | REST + **WebSocket** (`/sockets`, events API) | **SSE** streaming from FastAPI |
| **Scheduled jobs** | OpenClaw **crons** (gateway) | **openhands-automation** service | In-process task pollers + croniter |
| **Persistent apps/UI** | Plugin **AppStore** (OpenUI app code + SQLite) | Conversations, settings on disk | Documents, presets, sessions in `data/` |
| **Vector / RAG memory** | Via gateway skills / external | Skills, condenser (SDK) | **ChromaDB** + fastembed + `memory.json` |
| **Web search** | Gateway / MCP | Browser tool, MCP | **SearXNG** (bundled in Docker) |
| **Email / calendar** | Channels / tools (if configured) | Not core | **IMAP/SMTP**, **CalDAV**, icalendar |
| **Local model serving** | Provider endpoints in gateway config | LLM via settings API / proxy | **Cookbook** (Ollama, vLLM, llama.cpp, remote SSH) |
| **Sandbox isolation** | Depends on OpenClaw tool setup | **Docker** sandbox mode recommended | Docker or native (host access) |
| **Auth** | Gateway device identity + tokens | Session API key (`X-Session-API-Key`) | bcrypt sessions, 2FA, optional passkeys |
| **UI tech** | Next.js static → plugin (Claw) / Longformer React | React Router + Vite + HeroUI | Vanilla JS modules (no bundler) |

### OpenClaw + openclaw-os (agent orchestration layer)

**Install prerequisite:** [OpenClaw](https://github.com/openclaw/openclaw) gateway (separate from openclaw-os repo).

| Layer | Technology | Notes |
|-------|------------|-------|
| Gateway runtime | **Node.js 20+**, `openclaw` CLI | Agents, sessions, channels (Telegram, Slack, …), cron, MCP |
| Plugin runtime | **jiti** (TS plugins, no build in dev) | `@openuidev/openclaw-os-plugin` |
| Plugin persistence | **`node:sqlite`** | Apps, artifacts, notifications, uploads stores |
| Plugin tools | OpenClaw plugin SDK | `app_create`, `app_update`, SQL exec namespace, cron proposals |
| Workspace UI | Next.js 16 → **static export** → bundled in plugin | `@openuidev/claw-client`; Longformer would follow same bundle path |
| Client ↔ gateway | **WebSocket** + HTTP on same origin | Protocol types inlined from openclaw source |
| Gen UI | **OpenUI Lang** via `before_prompt_build` hook | Session key suffix `:openclaw-os` triggers OpenUI system prompt |
| OpenUI deps | `@openuidev/react-headless`, `react-lang`, `react-ui`, `lang-core` | AG-UI event stream, Zustand chat store |
| Dev tooling | pnpm 9.15+, ESLint 9, Vitest | `pnpm ci` matches GitHub Actions |

**Typical ports:** gateway `18789`, dev client `18790`, plugin UI `http://<gateway>/plugins/openclawos`.

**On-disk state (gateway):** `~/.openclaw/` — workspace, config, credentials, session history (gateway-owned, not Longformer).

### OpenHands / agent-canvas (coding-agent layer)

From `config/defaults.json` and `docs/architecture.md` — version pins change; treat defaults file as source of truth.

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | **React 19**, React Router 7, **Vite 8**, TypeScript | `@openhands/agent-canvas` npm package + `agent-canvas` CLI |
| UI libraries | HeroUI, Monaco, xterm, TanStack Query, Zustand | Heavy; embed as **Code workspace**, don’t merge entire shell |
| Agent runtime | **`openhands-agent-server`** (Python, via **uvx**) | Default pin e.g. `1.29.3` |
| SDK packages | `openhands-sdk`, `openhands-tools`, `openhands-workspace` | Tool registration, workspace git, file editor |
| Automation | **`openhands-automation`** (Python, uvx) | Scheduled/event agent runs; separate DB |
| Ingress | **`scripts/ingress.mjs`** (Node reverse proxy) | Single origin: `/api/automation/*`, `/api/*`, `/*` |
| API client | **`@openhands/typescript-client`** | Typed REST — no raw axios to agent-server in app code |
| Realtime | **socket.io** / events API | Conversation streaming, tool observations |
| Persistence | `~/.openhands/agent-canvas/`, `~/.openhands/automation/` | Settings encryption via **`OH_SECRET_KEY`**; session keys in `session-api-key.txt` |
| Docker prod | **`ghcr.io/openhands/agent-canvas`** all-in-one | entrypoint runs agent-server + automation + static server |
| Dev launcher | `npm run dev` → `dev-with-automation.mjs` | Spawns uvx agent-server, automation, Vite, ingress |
| LLM | User-provided API keys via **settings API** | Proxy URL, model picker; no bundled LLM |

**Typical ports (dev):** ingress `8000`, Vite `3001`, agent-server `18000`, automation `18001`.

**Security:** `dev:docker` sandbox recommended on laptops; dockerless mode gives agents **host filesystem** access.

### Odysseus (productivity + local-LLM workspace)

Full-stack **alternative OS** — useful as **optional service plane**, not as Longformer’s primary agent brain.

| Layer | Technology | Notes |
|-------|------------|-------|
| App server | **FastAPI** + **uvicorn**, Python **3.11+** | `app.py` entry |
| ORM / DB | **SQLAlchemy**, default **SQLite** (`data/app.db`) | Postgres via `DATABASE_URL` for scale |
| Vector store | **ChromaDB** (Docker service or external) | `chromadb-client` + **fastembed** (local ONNX embeddings) |
| Search | **SearXNG** (Docker, pinned image) | `SEARXNG_INSTANCE` |
| Push notifications | **ntfy** (Docker) | Optional alerts |
| Agent features | MCP (`mcp` PyPI), croniter, agent_tools | Built-in MCP e.g. Playwright browser (needs cache) |
| Email | IMAP/SMTP routes | Full inbox in-app |
| Calendar | **CalDAV** sync, icalendar | Tasks + reminders |
| Documents | Rich editor, AI edits, uploads | Overlaps Longformer Notes/Reader |
| Model serving | **Cookbook** — Ollama, vLLM, llama.cpp, remote SSH servers | GPU/Docker overlays; heavy optional path |
| Frontend | **Vanilla JS** (`static/js/`) | No React — don’t merge UI; integrate via API/MCP |
| Docker Compose | odysseus + chromadb + searxng + ntfy | Binds localhost by default |
| Auth | bcrypt, pyotp 2FA, optional WebAuthn | `AUTH_ENABLED=true` default |

**Typical ports:** app `7000`, SearXNG `8080`, ntfy `8091`, ChromaDB host `8100`.

**Data directory:** `./data/` — `app.db`, `memory.json`, `uploads/`, `chroma/`, `settings.json`, etc.

### OpenUI (shared render + stream layer)

Consumed by **openclaw-os** today; Longformer should consume the same packages, not fork streaming.

| Package | Role |
|---------|------|
| `@openuidev/lang-core` | Parser, validation, prompt generation for OpenUI Lang |
| `@openuidev/react-headless` | Zustand chat store, AG-UI stream adapters (OpenAI, SSE) |
| `@openuidev/react-lang` | Renderer for streamed OpenUI Lang |
| `@openuidev/react-ui` | Component library + CSS for rendered output |

Build order: `react-headless` → `react-lang` → `react-ui`.

Longformer’s **59 generated-ui blocks** remain a **design-system / static schema** path; production agent output should stream through OpenUI Lang per OpenClaw OS plugin design.

### Integrated Longformer — what actually has to run

#### Minimum viable (agent OS shell + chat + gen UI)

| Process | Required? |
|---------|-----------|
| **OpenClaw gateway** | Yes |
| **Longformer/openclaw-os plugin** (UI + SQLite stores) | Yes |
| **LLM provider** (OpenAI, Anthropic, local proxy, etc.) | Yes — configured in gateway and/or agent settings |
| **Node.js 20+**, **pnpm** | Yes (build/serve UI, plugin) |
| OpenHands agent-server | No |
| Odysseus | No |

#### Full vision (Longformer doc workspaces + code + optional productivity backend)

| Process | Workspaces served |
|---------|-------------------|
| OpenClaw gateway + extended plugin | Chat, Apps, Artifacts, Crons, Notifications, Orchestrator (partial), entity store |
| OpenHands stack (ingress + agent-server [+ automation]) | Code, Server, Files/git/terminal, Automations |
| Odysseus (optional sidecar) | Email, Calendar, Deep research, Cookbook/local models, Chroma memory API |
| SearXNG / Chroma / ntfy | Only if using Odysseus or replicating its infra separately |

### LLM & inference layer (cross-cutting)

None of the three platforms bundle a **mandatory** cloud LLM. All expect **you to configure inference**:

| Consumer | Where LLM is configured | Typical setup |
|----------|-------------------------|---------------|
| OpenClaw | Gateway config / env | API keys, model IDs, local OpenAI-compatible URLs |
| OpenHands | Agent-server **settings API** (`llm_model`, `llm_api_key`, `llm_base_url`) | LiteLLM proxy, direct provider keys |
| Odysseus | In-app Settings + `.env` (`OPENAI_API_KEY`, `LLM_HOST`, Cookbook) | Ollama on `11434`, remote vLLM, cloud APIs |

**For integrated Longformer:** pick **one primary inference path** for the main agent (OpenClaw gateway) and optionally separate profiles for Code workspace (agent-server settings). Avoid three unrelated model configs unless workspaces truly need different models.

**Local models:** Odysseus Cookbook is the most complete **self-hosted model ops** story (download, serve, GPU). OpenHands and OpenClaw can **point at** those endpoints once served—they don’t replace Cookbook.

### Persistence map (avoid duplicate sources of truth)

| Data | Authoritative store (recommended) | Also exists in |
|------|-----------------------------------|----------------|
| Main agent chat history | **OpenClaw gateway** sessions | — |
| Apps / artifacts / plugin SQL | **claw-plugin SQLite** | — |
| OpenUI app runtime state | Plugin SQL namespace per app | — |
| Coding conversations / events | **agent-server** persistence (`~/.openhands/…`) | — |
| Automation definitions / runs | **automation DB** (`automations.db`) | — |
| Email, calendar, documents (if using Odysseus) | **Odysseus `data/app.db` + files** | — |
| Vector memory (if using Odysseus) | **ChromaDB** + Odysseus memory files | Psyche workspace UI reads via API |
| Longformer notes/tasks (future) | **New plugin entity tables** OR sync from Odysseus | Not in demo yet |

**Rule:** Longformer UI reads from **one authority per entity type**; cross-stack links use stable IDs and agent tools, not duplicated SQLite rows.

### Security & isolation boundaries

| Stack | Risk | Mitigation |
|-------|------|------------|
| OpenClaw gateway | Tools execute with gateway’s trust model | Lock down MCP, secrets in `~/.openclaw`, use session suffix isolation |
| OpenHands agent-server | Shell/file tools on host | Docker sandbox mode; session API keys; don’t expose ingress publicly without auth |
| Odysseus | Full host access in native mode | Docker, `AUTH_ENABLED`, reverse proxy + HTTPS, keep internal ports on `127.0.0.1` |
| Integrated | Multiple APIs on localhost | Single ingress where possible; shared auth story TBD for v1 |

### What the prior plan under-specified

1. **Python / uvx runtime** — OpenHands requires **uv**/`uvx` for agent-server and automation, not just Node.
2. **Odysseus bundled infra** — ChromaDB, SearXNG, ntfy, Cookbook GPU paths — needed if you want Odysseus-grade email/RAG/research without re-building.
3. **Ingress pattern** — agent-canvas’s proxy is the model for multi-backend **single origin** (critical for WebSocket + cookies + CORS).
4. **Encryption keys** — `OH_SECRET_KEY`, session API keys, OpenClaw secrets — must be generated and persisted consistently in dev/prod.
5. **OpenClaw as separate install** — openclaw-os is a **plugin + UI**, not the gateway itself.
6. **SSE vs WebSocket** — Odysseus (SSE) vs OpenClaw/OpenHands (WebSocket/events) — Longformer client needs **adapter layer** if talking to multiple backends.
7. **Automations vs crons vs scheduled tasks** — three different schedulers (see below); Longformer must not collapse them into one UI without an ownership model.
8. **Memory layers** — episodic/semantic/RAG/soul docs vs gateway session history vs OpenHands condenser — Psyche workspace needs a real backend choice.

---

## Automations and memory (cross-platform)

Automations and memory are where the three stacks overlap most confusingly. They are **not one subsystem** today — each platform has its own scheduler and memory model. Longformer should **surface them in unified workspaces** but **delegate authority** per use case.

### Automations — three different systems

| System | What it schedules | Runtime | Persistence | Longformer UI target |
|--------|-------------------|---------|-------------|-------------------|
| **OpenClaw crons** | Agent turns on a timer (`payload.message` → `agentTurn`) | **OpenClaw gateway** | Gateway-owned job store | **Crons** route (claw-client `CronsView`) + **Notifications** |
| **OpenHands automations** | Coding-agent runs: cron **or** GitHub/webhook **events** | **`openhands-automation`** (Python, uvx) | `~/.openhands/automation/automations.db` | **Orchestrator → Jobs** or dedicated **Automations** workspace (agent-canvas patterns) |
| **Odysseus scheduled tasks** | Full assistant loops with tools (bash, files, RAG tools) | **FastAPI `TaskScheduler`** (in-process pollers) | SQLAlchemy `ScheduledTask` in `app.db` | Optional sidecar; **Schedule** workspace for human tasks, not agent crons |

#### OpenClaw crons (personal agent OS — **primary for Longformer v1**)

- Gateway RPC: `cron.list`, `cron.update`, `cron.run`, `cron.remove`, `cron.runs`, `cron.status`
- WebSocket broadcasts `event: "cron"` → UI refreshes (`OpenClawEngine.onCronChanged`)
- Jobs carry `schedule` (cron expr, interval, `at`), `payload.message` (the prompt), optional `sessionKey` / `threadId`
- OpenClaw OS plugin **actively steers** the agent to propose crons for recurring work (“every morning”, “daily digest”) and for heavy prefetch → SQLite snapshot → OpenUI app reads DB
- Notifications from cron runs land in plugin **`NotificationStore`** (`cronId` on records)

**Longformer mapping:** Add a **Crons** nav item (or fold into Notifications + Orchestrator dashboard). Reuse claw-client `CronsView` / `CronDetailTray`. Main agent chat can create crons via natural language; gateway executes them.

#### OpenHands automations (coding / repo ops — **Code workspace**)

- REST API: `/api/automation/v1` (via ingress `/api/automation/*`)
- Triggers: **schedule** (`cron` expression) or **event** (e.g. GitHub `pull_request.opened` + JMESPath filter)
- Each run spins an agent-server **conversation** / sandbox bash; tracks `AutomationRun` with `conversation_id`, `bash_command_id`
- Distinct from OpenClaw crons: tied to **repos, branches, plugins**, automation DB, session API key auth
- agent-canvas UI: `/automations` list, wizard, preset cards, health check, local schedule notice

**Longformer mapping:** **Server / Code / Orchestrator (jobs)** surfaces for dev-centric automations. Do **not** route personal “remind me daily” crons here unless explicitly a coding workflow. Requires **uvx automation sidecar** in the stack.

#### Odysseus scheduled tasks (full-stack assistant — **optional sidecar**)

- `TaskScheduler` background loop executes `ScheduledTask` rows with full agent loop + tool selection (RAG-picked tools + shell defaults)
- Overlaps with calendar reminders, note reminders, email scheduling
- Uses same LLM stack as chat; posts to `/api/tasks/notifications`

**Longformer mapping:** Only if Odysseus is integrated via MCP/HTTP. Otherwise implement human **Schedule/Calendar** in plugin entity store and agent **crons** on OpenClaw for assistant schedules.

### Recommended automation architecture for integrated Longformer

```
User intent
    │
    ├─ "Every morning summarize my inbox"     → OpenClaw cron → main agent session
    ├─ "On PR opened run code review"         → OpenHands automation (event trigger)
    ├─ "Remind me Tuesday about dentist"      → Longformer Schedule/Calendar entity (human)
    │                                          OR Odysseus task (if sidecar)
    └─ "Refresh dashboard data while I sleep" → OpenClaw cron → script/SQLite → OpenUI app
```

**Unified UX rules:**

1. **One “Automations” inbox in UI** can *list* all three sources with a **badge** (`openclaw` | `openhands` | `odysseus`) — but each row mutates through its **native API**.
2. **Notifications workspace** shows *outcomes* (cron finished, automation failed, task due) with deep links to the right editor.
3. **Orchestrator dashboard** shows *fleet* view: running jobs, traces, error rates — fed by gateway cron events + automation runs API + optional Odysseus task status.

**Do not** store OpenHands automation definitions in OpenClaw or vice versa.

---

### Memory — four layers (not one database)

| Layer | System | Storage | Retrieval | Longformer UI |
|-------|--------|---------|-----------|---------------|
| **Session / transcript** | OpenClaw gateway | Session keys, chat history | Full thread in Chat | Chat workspace |
| **Durable user memory** | Odysseus (if used) | `memory.json` + **ChromaDB** (`odysseus_memories`) | Semantic + keyword; `/api/memory` | **Psyche → Memory** |
| **Identity / policy docs** | OpenClaw workspace + plugin | Files like `soul.md`, ethics; plugin SQL | Injected via skills / `before_prompt_build` | **Psyche → Soul.md / Ethics.md** |
| **RAG / knowledge** | Odysseus or custom | Chroma collections, document indexes | RAG pipeline, chunk scores | **Psyche → RAG / Vector DB** |
| **Conversation compression** | OpenHands SDK | Agent-server condenser / skill analysis | Internal to coding sessions | Code workspace (opaque) |
| **App working memory** | OpenClaw plugin | Per-app SQLite namespace | `Query("exec")` in OpenUI apps | Apps / Desktop windows |

#### Odysseus memory (most complete **user memory** product)

- `MemoryManager` → `data/memory.json` (structured entries, timestamps, session_id)
- `MemoryVectorStore` → ChromaDB collection `odysseus_memories` with fastembed / custom embedding lanes
- `MemoryService.remember()` / `recall()` — used post-chat (`run_post_response_tasks` in chat routes)
- `/api/memory` — add, search, import, audit (`memory_extractor`, skills import)
- MCP: `mcp_servers/memory_server.py` for external agents

**If Longformer adopts Odysseus as memory sidecar:** Psyche workspace becomes a **real admin UI** over `/api/memory` + Chroma health — not mock data.

#### OpenClaw / openclaw-os memory (agent-facing, lighter)

- No separate “memory server” in openclaw-os plugin today comparable to Odysseus
- Memory-like behavior comes from:
  - **Persistent sessions** (full history on gateway)
  - **Skills** and workspace files in `~/.openclaw/`
  - **OpenUI apps** with SQLite tables (cron-fed snapshots)
  - Plugin **artifacts** (markdown docs the user refines)
- Claw plugin prompt encourages crons + DB for “memory across days” for **dashboards**, not a general episodic memory API

**For v1 without Odysseus:** extend plugin with **`MemoryStore`** (SQLite or markdown files) + gateway tool `memory_remember` / `memory_recall`, or use OpenClaw’s native memory skills if/when gateway exposes them.

#### OpenHands memory (coding-session scoped)

- Skill activation, condenser, conversation settings — optimized for **long coding trajectories**, not cross-workspace user profile
- `misc_settings.app_preferences` on agent-server for UI prefs — not semantic memory
- Do not use agent-server as Longformer’s global memory backend

#### Longformer Psyche workspace (UI contract)

Mock today (`mock-data/psyche.ts`) defines the **target UX**:

- Memory kinds: episodic, semantic, working, procedural
- Knowledge graph, RAG query log, vector DB health
- Soul.md / Ethics.md identity documents

**Backend options for Psyche (pick one primary):**

| Option | Pros | Cons |
|--------|------|------|
| **A — Odysseus memory API** | Chroma + extraction pipeline already built | Requires Odysseus running; federated auth |
| **B — OpenClaw plugin MemoryStore** | Same origin as gateway; agent tools colocated | Must build extraction/RAG yourself |
| **C — Hybrid** | Crons/sessions on OpenClaw; vectors on Chroma | Two systems; sync discipline required |

**Recommendation:** **C for full vision, B for MVP**

- **MVP:** Plugin SQLite + markdown soul/ethics files; agent writes memory via tools; Psyche reads plugin API
- **Phase 4:** Optional Odysseus Chroma for semantic recall if sidecar is deployed; gateway tools delegate `recall()` to HTTP

### Memory + automations together (common patterns)

1. **Cron → refresh memory snapshot** — OpenClaw cron runs agent turn → writes structured rows to plugin SQL or calls `memory.remember` → Psyche Memory view updates
2. **Automation → code change → memory** — OpenHands automation completes → notification → user asks main agent to “remember we now deploy on Fridays” → plugin memory store
3. **Cross-workspace focus** — `WorkspaceFocus` on a note + `memory.recall("Q3 planning")` in same agent turn — requires **one agent session** (OpenClaw) with tools that read Notes entity store + memory store
4. **RAG for automations** — Odysseus task scheduler already uses RAG tool selection; OpenClaw crons use full agent; OpenHands automations use fixed prompt + repo context

### Infrastructure required (automations + memory)

| Capability | OpenClaw only | + OpenHands | + Odysseus memory |
|------------|---------------|-------------|-------------------|
| Personal scheduled agent | Gateway | — | — |
| GitHub/event coding automation | — | automation + agent-server | — |
| Semantic user memory | Limited (sessions/apps) | — | ChromaDB + fastembed |
| Vector RAG UI (Psyche) | Build or skip | — | Chroma + `/api/memory` |
| Notification feed | Plugin SQLite | Automation run status | ntfy + task notifications |

### Longformer workspace ownership (updated)

| Workspace | Automations role | Memory role |
|-----------|------------------|-------------|
| **Chat** | Create crons via agent; show memory citations inline | Primary interaction surface |
| **Notifications** | Cron/automation/task completion feed | — |
| **Orchestrator** | Fleet: jobs, traces, run history | — |
| **Psyche** | — | Admin: memory entries, RAG, graph, soul/ethics |
| **Schedule / Calendar** | Human reminders (entities) | — |
| **Apps / Desktop** | Cron-fed live dashboards | App-scoped SQL “memory” |
| **Code** (agent-canvas) | OpenHands automations list | Session-only (condenser) |

### Phased delivery

| Phase | Automations | Memory |
|-------|-------------|--------|
| **1** | Wire OpenClaw crons UI + notifications | Session history only (gateway) |
| **2** | Agent proposes crons from chat; cron → notification deep links | Plugin `MemoryStore` + Psyche Memory tab (read/write tools) |
| **3** | Embed OpenHands automations in Code workspace | Soul/ethics markdown in plugin; entity graph links |
| **4** | Unified automations inbox (badged sources) | Optional Odysseus Chroma recall; RAG tab live |
| **5** | Cross-stack policy (which scheduler for which intent) | Unified search: memory + notes + entities |

---

## Backend architecture

### Primary backend: OpenClaw Gateway

System of record for intelligence:

- Agents & sessions
- Tool execution, MCP, skills
- Crons / scheduled jobs
- Multi-channel integrations
- Plugin HTTP routes on same host

**Take from `claw-plugin`:**

- `AppStore`, `ArtifactStore`, `NotificationStore`, `UploadStore` (SQLite via `node:sqlite`)
- `before_prompt_build` hook (session-scoped OpenUI system prompt)
- Tools: `app_create`, `app_update`, SQL namespace, cron wiring
- Static UI serving from plugin

**Extend plugin with:**

- Entity APIs — notes, tasks, threads
- Workspace registry metadata — tool → workspace mapping

### Secondary backend: openhands-agent-server (Code workspace only)

From agent-canvas:

- Conversations, events WebSocket, terminal, file editor, git, automations
- Runs via `uvx openhands-agent-server` or Docker stack

**Role:** Code / Server / Orchestrator surfaces needing a real sandbox — not the global backend.

Integration: Longformer **Code** workspace embeds agent-canvas; gateway can delegate via tool.

### Odysseus — integration target, not core platform

Full-stack AI workspace (FastAPI, SQLite/Postgres, ChromaDB, email, notes, calendar). Huge domain overlap with Longformer.

| Approach | When |
|----------|------|
| **Reference only** | Copy API shapes; implement via OpenClaw tools + Longformer UI |
| **MCP / HTTP adapter** | Odysseus beside gateway; agent tools call it |
| **Merge products** | Only if abandoning gateway+plugin model — high cost |

**Recommendation:** reference + optional MCP bridge.

### Hermes WebUI — patterns only

Useful for SSE streaming, workspace panel, session model — **not** a backend to build on.

### Client + server data split

**Client (Longformer app):**

| Zustand | TanStack Query |
|---------|----------------|
| Active workspace, focus/selection | Apps, artifacts, notifications, crons |
| Surface manager, assistant panel | agent-server conversations |
| Nav pin order | Entity lists (notes, tasks…) |

**Server (OpenClaw plugin + gateway):**

| Store | Owner today | Longformer extension |
|-------|-------------|----------------------|
| Apps / artifacts | claw-plugin SQLite | Apps workspace + Desktop |
| Notifications | claw-plugin | Notifications workspace |
| Uploads | claw-plugin | Files / chat attachments |
| Sessions / messages | OpenClaw gateway | Chat via WebSocket |
| Notes / tasks / calendar | none | New plugin tables or external sync |
| Memory / RAG | OpenClaw + Psyche UI | Gateway tools / MCP |
| Code / git | agent-server | Code workspace only |

**SQLite on gateway** is fine for self-hosted v1. Postgres when multi-tenant or heavy sync is needed.

---

## What to take from each project

| Project | Take | Don’t take |
|---------|------|------------|
| **UI Experiments** | `AppShell`, workspaces, `SurfaceManager`, tokens, generated-ui blocks as design catalog | Mock-all-state-in-`App.tsx` |
| **OpenUI** | `react-headless` store, stream adapters, `react-lang` Renderer, `lang-core`, AG-UI events | Rebuilding chat from scratch |
| **openclaw-os** | Plugin packaging, gateway engine, apps/artifacts/crons/notifications, session keys, mobile shell | Entire Claw UI if Longformer replaces it |
| **agent-canvas** | Agent-server client, code/git/terminal/automation UX, Query patterns | Full app shell, HeroUI, hosted routes |
| **Odysseus** | Feature checklist, FastAPI boundaries as tool backends | Second frontend stack |
| **Hermes** | SSE + workspace panel behavior | Python-only frontend |

---

## Gen UI strategy

Two rendering systems today:

1. **OpenUI Lang** — streaming DSL, apps with Query/Mutation (production in OpenClaw OS)
2. **Longformer `GeneratedSurfaceSchema` + 59 blocks** — static schema → React components

| Use case | Renderer |
|----------|----------|
| Chat streaming, forms, charts | **OpenUI** (`react-lang` + `react-ui`) |
| Durable dashboards / apps | **OpenUI app surface** (`app_create` in plugin) |
| Design system / Storybook | **Longformer blocks** |
| Desktop widget tiles | Longformer primitives OR thin OpenUI apps |

Long-term: bridge OpenUI Lang ↔ Longformer blocks. Short-term: **OpenUI wins for agent output**; Longformer blocks stay token/layout source of truth.

---

## Runtime architecture

### Dev stack (full platform)

```bash
# ── Core agent OS (required for integrated Longformer v1) ──
# Prereqs: Node 20+, pnpm 9+, OpenClaw installed, LLM API key or local proxy
openclaw plugins install -l ./packages/longformer-plugin   # or openclaw-os plugin
openclaw gateway run                                       # :18789

# Longformer / claw-client UI dev (or rely on plugin static bundle)
pnpm --filter longformer-client dev                          # or claw-client :18790

# ── Code workspace (optional) ──
# Prereqs: Node 22+, uv/uvx, Python 3.11–3.13 compatible with openhands-agent-server
cd agent-canvas && npm run dev                               # ingress :8000

# ── Odysseus sidecar (optional — email, calendar, Chroma RAG, Cookbook) ──
# Prereqs: Docker OR Python 3.11+ venv
cd odysseus && docker compose up -d --build                  # :7000 + chromadb + searxng + ntfy
```

### User flows

**1. Chat + gen UI** — Chat → WebSocket → OpenClaw → OpenUI stream → Renderer

**2. Notes + ambient AI** — Notes → `WorkspaceFocus` → assistant → `{ type: 'note', id }` → tool mutates plugin DB → UI refetch

**3. Persistent app** — agent `app_create` → AppStore → Apps + Desktop window

**4. Code** — Code workspace → agent-server REST + WS

**5. Email / calendar (later)** — agent tools → Odysseus HTTP/MCP → Longformer views

---

## Suggested monorepo shape

```
longformer/                    # or extend openclaw-os monorepo
├── packages/
│   ├── longformer-ui/         # shell + workspaces (current kit)
│   ├── longformer-client/     # host app (demo + OpenUI + gateway)
│   ├── longformer-plugin/     # OpenClaw plugin (stores, tools, static UI)
│   ├── longformer-bridge/     # OpenUI ↔ focus context ↔ entity types
│   └── code-workspace/        # embed wrapper for agent-canvas
├── openui/                    # workspace dep (@openuidev/*)
└── agent-canvas/              # optional dep for code workspace
```

Physical merge not required for v1 — npm/pnpm deps on published packages suffice.

---

## Dev & prod topologies

### Topology A — Agent OS only (MVP)

Best match for early Longformer + OpenClaw integration.

```
Browser
  └── OpenClaw Gateway :18789
        ├── WebSocket (chat, agents, crons)
        ├── Plugin HTTP (apps, artifacts, uploads, static Longformer UI)
        └── SQLite (plugin stores)
  └── External LLM API or local OpenAI-compatible endpoint
```

**Processes:** 1 (gateway + plugin). **No Python required.**

### Topology B — Agent OS + coding sandbox (recommended dev)

```
Browser
  └── Ingress :8000 (agent-canvas scripts/ingress.mjs OR Docker agent-canvas image)
        ├── /*           → Longformer static UI (or Vite dev)
        ├── /api/*       → openhands-agent-server :18000
        └── /api/automation/* → openhands-automation :18001

OpenClaw Gateway :18789  ← Longformer Chat workspace (WebSocket, main agent)
```

**Processes:** gateway + ingress + agent-server + automation (+ Vite in dev). **Requires uvx + Node.**

Longformer shell may talk to **two origins** unless you add a **unifying ingress** that also proxies `/plugins/*` or gateway WS — plan this explicitly (see gap #6 in Full platform stack).

### Topology C — Full productivity plane (ambitious)

```
Browser → Longformer UI (plugin-served)
OpenClaw Gateway     — primary agent, apps, crons, notifications
OpenHands stack      — Code / git / terminal / automations workspace
Odysseus :7000       — email, calendar, documents, Chroma memory, SearXNG research
  ├── ChromaDB :8100
  ├── SearXNG :8080
  └── ntfy :8091
```

Agent tools bridge stacks (`call_odysseus_api`, MCP, `open_code_session`). **Not one database** — federated entity IDs + sync tools.

### Production packaging options

| Target | Pattern |
|--------|---------|
| Personal homelab | OpenClaw gateway + plugin (like openclaw-os install.sh); optional agent-canvas Docker beside it |
| Single Docker host | `ghcr.io/openhands/agent-canvas` for code stack; gateway in separate container or host |
| Remote gateway | OpenClaw on VPS; UI served from gateway (no CORS); same as openclaw-os README |
| Odysseus-assisted | Odysseus compose on same host, localhost-only ports, agent reaches via MCP/HTTP |

---

## Prerequisites checklist

### Everyone building integrated Longformer

- [ ] **Node.js 20+** (22+ if hacking agent-canvas launchers)
- [ ] **pnpm 9+** (OpenUI, openclaw-os, future Longformer monorepo)
- [ ] **OpenClaw** installed and gateway running
- [ ] **LLM credentials** or local inference URL configured
- [ ] **Git** access to openui, openclaw-os, agent-canvas repos (or published npm packages)

### OpenClaw OS / Longformer plugin development

- [ ] OpenClaw plugin install (`openclaw plugins install -l …`)
- [ ] OpenUI packages building (`@openuidev/react-headless`, `react-lang`, `react-ui`)
- [ ] Static UI bundle step (Next/Vite export → plugin `static/`)

### Code workspace (OpenHands)

- [ ] **`uv` / `uvx`** on PATH (`agent-canvas` dev scripts fail without it)
- [ ] **Python 3.11–3.13** compatible with pinned `openhands-agent-server` (see `config/defaults.json`)
- [ ] **`openhands-tools`, `openhands-workspace`** pulled transitively via uvx
- [ ] Optional: **Docker** for sandboxed agent-server (`npm run dev:docker`)
- [ ] Disk: `~/.openhands/` for state, secrets, conversations

### Odysseus integration (optional)

- [ ] **Docker Compose** OR Python 3.11+ venv + `requirements.txt`
- [ ] **ChromaDB** reachable (`CHROMADB_HOST` / compose service)
- [ ] **SearXNG** for research features (bundled in compose)
- [ ] Optional: **GPU** / Ollama / vLLM for Cookbook local models
- [ ] Optional: **Playwright MCP** cache (`npx @playwright/mcp`) for browser tools
- [ ] Disk: `./data/` for SQLite, uploads, embeddings cache

### Not required for v1

- Hermes WebUI / Python vanilla frontend stack
- Postgres (SQLite sufficient for gateway plugin + Odysseus single-user)
- Separate Next.js production server for UI (plugin static serve)

---

## Phased tech decisions

| Phase | Frontend | Backend / infra | Gen UI |
|-------|----------|-----------------|--------|
| **0 — Now** | Longformer demo + kit | Mock data in React | Static blocks in Design System |
| **1 — Agent spine** | Longformer shell + OpenUI + gateway client | **OpenClaw gateway** + plugin SQLite | OpenUI Lang in chat |
| **2 — Shared data** | Zustand focus + TanStack Query | Plugin entity tables + WS events | OpenUI apps in Desktop |
| **3 — Code** | agent-canvas embed / library | **uvx agent-server** + ingress + automation | N/A |
| **4 — Productivity** | Notes/Email/Calendar workspaces | Plugin tools **or Odysseus sidecar** (FastAPI + Chroma + SearXNG) | Mixed |
| **5 — Scale** | Same | Postgres, unified ingress, auth | Same |

---

## Hard recommendations

1. **Backend = OpenClaw Gateway + extended plugin**, not a new FastAPI monolith
2. **Chat/gen UI = OpenUI**, not custom streaming from scratch
3. **Shell/workspaces = Longformer UI kit**, gradually wrapping or replacing claw-client layout
4. **Code = agent-canvas + agent-server**, embedded as one workspace
5. **Odysseus = optional data plane** via tools, not main stack
6. **Hermes = UX reference only**
7. **Client state:** Zustand (UI + focus) + TanStack Query (server entities)
8. **Prod deploy:** plugin-served static UI (like openclaw-os), not separate Next server
9. **Unify on pnpm + React 19** when combining repos
10. **Converge gen UI** toward OpenUI; Longformer blocks = design-system source
11. **Plan for multi-runtime dev:** Node (gateway/UI) + **uvx/Python** (OpenHands) + optional **Docker Compose** (Odysseus or agent-canvas sandbox)
12. **Single-origin ingress** where possible when combining OpenHands with gateway UI
13. **One LLM config story** for the main agent; document separate profiles only for Code workspace

### Main risk

**Product overlap without integration boundaries.** Longformer, OpenClaw OS, Odysseus, and agent-canvas each implement “AI workspace.” Win through **composition**: Longformer = shell, OpenClaw = agent + persistence, OpenUI = render pipeline, agent-canvas = code, Odysseus = optional domain services.

---

## Key file references

| Path | Purpose |
|------|---------|
| `packages/longformer-ui/src/components/shell/AppShell/AppShell.tsx` | Shell frame |
| `packages/longformer-demo/src/App.tsx` | Demo integration / mock state |
| `packages/longformer-demo/src/workspace-layout.tsx` | Workspace router |
| `packages/longformer-demo/src/workspace-config.ts` | Workspace IDs & nav |
| `packages/longformer-ui/src/surface-manager/` | Windowing & form factors |
| `packages/longformer-ui/src/components/workspaces/chat/ChatContextPanel.tsx` | Agent + drawer |
| `packages/longformer-ui/src/components/workspaces/generated-ui/blocks/` | Agent-rendered UI (59 blocks) |
| `openclaw-os/packages/claw-plugin/src/index.ts` | Plugin stores, tools, OpenUI prompt |
| `openclaw-os/packages/claw-client/src/lib/engines/openclaw/OpenClawEngine.ts` | Gateway engine |
| `openclaw-os/packages/claw-client/src/lib/session-workspace.ts` | linkedApp / linkedArtifact |
| `openclaw-os/packages/claw-client/src/components/chat/ChatAppContext.tsx` | Cross-route shared app data |
| `openui/packages/react-headless/` | Chat store, streaming adapters |
| `agent-canvas/config/defaults.json` | Version pins, ports, paths for OpenHands stack |
| `agent-canvas/scripts/dev-with-automation.mjs` | Full dev stack launcher (ingress + uvx) |
| `agent-canvas/docker/entrypoint.sh` | Production all-in-one container layout |
| `odysseus/docker-compose.yml` | ChromaDB, SearXNG, ntfy bundled services |
| `odysseus/docs/setup.md` | Odysseus env vars, ports, Cookbook, MCP |
| `odysseus/requirements.txt` | FastAPI, SQLAlchemy, chromadb-client, MCP deps |

---

## Next steps

- [ ] Workspace-by-workspace matrix (backend owner, merge candidate, rail vs desktop-only)
- [ ] TypeScript interfaces for `EntityStore`, `WorkspaceFocusProvider`, agent message envelope
- [ ] Entity types → minimal v1 schema mapping
- [ ] Chat + OpenClaw session keys + OpenUI rendering through `ChatContextPanel`
- [ ] ADR: build-vs-buy per workspace (real API v1 vs mock)
- [ ] Dependency graph for first integrated prototype (Node + uvx + optional Docker)
- [ ] Unified ingress design (gateway WS + agent-server REST on one origin)
- [ ] Automations ownership matrix: which user phrases route to OpenClaw cron vs OpenHands automation vs Schedule entity
- [ ] Memory backend ADR: plugin MemoryStore (MVP) vs Odysseus Chroma (phase 4)
- [ ] Wire Psyche workspace to real API (plugin or Odysseus `/api/memory`)
- [ ] Migrate demo from monolithic `App.tsx` to workspace registry + per-workspace stores
