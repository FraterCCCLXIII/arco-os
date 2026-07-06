# UI Experiments — Demo App Index + Primitive Library Plan

> Status: DRAFT v0.1 (Jul 2026). Indexes the demo apps in this workspace, gives each a spec direction, and lays out the extraction plan for the shared core component library — the ecosystem's shadcn-equivalent, built as a token contract plus a generative block registry. Companion to `DESIGN-SYSTEM-SPEC.md` (which defines the architecture this plan executes) and `Arco-Prototype-2/docs/open-standards-map.md` (the runtime/protocol half of the standard).

## 1. Headline finding

The primitive library largely already exists, and it is already spec'd. `packages/longformer-ui` contains 84 primitives, 59 Zod-validated generative blocks, 11 shell components, 44 workspace modules, and the `--lf-*` token system. `DESIGN-SYSTEM-SPEC.md` (D1/D2) already answers "shadcn or Tailwind?":

- Take **shadcn's registry/copy-in distribution model** without its theme or Tailwind coupling.
- Take **Tailwind's role** as a universal styling contract, but express it as `--lf-*` tokens that CSS Modules, Tailwind (via a `@theme` preset), and future native renderers all consume.
- What neither shadcn nor Tailwind has — and what makes this library different — is **Tier 2: blocks** that ship a schema + prompt description + adaptivity descriptor, so the library is AI-generatable by construction.

The work is therefore extraction, conflict cleanup, and wiring to Arco — not invention.

## 2. Demo app index

Rough counts: 7 product experiments, 13 reference clones (research only, excluded from the product build), ~375 TSX files in the kit.

| App | Path | Role | Stack | Verdict |
|---|---|---|---|---|
| **longformer-ui** (CSS Modules) | `packages/longformer-ui` | The primitive library itself: tokens, 84 primitives, 59 blocks, shell, SurfaceManager | React 18 + TS, CSS Modules, Zod 4 | **Core** |
| **longformer-ui-tailwind** | `packages/longformer-ui-tailwind` | Parallel port of the full kit in Tailwind v4 mapped to the same tokens (~375 duplicate files) | React 18 + TS, Tailwind v4 | **Merge** |
| **longformer-demo** | `packages/longformer-demo` | Flagship host: 43 workspaces, mock data, agent loop (prompt → LLM/local → validated blocks). Deployed on Vercel | React 18, Vite, React Router 7 | **Core** |
| **longformer-demo-tailwind** | `packages/longformer-demo-tailwind` | Same demo shell consuming the Tailwind kit | Vite, Tailwind v4 | **Merge** |
| **longformer-www** | `packages/longformer-www` | Marketing + spec site; warm parchment palette (intentionally distinct brand) | React 18, Vite, CSS Modules | **Keep** (re-base as theme override) |
| **proto** | `proto/` | Python proof-of-mechanism: AI picks from 8 fixed templates, JSON Schema validation, capability gate + audit | Python 3, openai, jsonschema | **Harvest + retire** |
| **Forge landing** | `index.html` (root) | Standalone vanilla-HTML "build apps from a prompt" template catalog; third palette | Single-file HTML/CSS/JS | **Harvest + retire** |

## 3. Per-app spec direction

### 3.1 longformer-ui — Core

This IS the shadcn-equivalent; everything else in the ecosystem consumes it. Its spec defines:

1. **Package boundary:** split into `@lf/tokens`, `@lf/primitives`, `@lf/blocks`, `@lf/runtime` — zero shell imports (the D5/§10.8 seam rule from `DESIGN-SYSTEM-SPEC.md`).
2. **The Generation Contract:** every block ships `defineBlock({ schema, description, adaptivity, examples, render })` — schema, validator, prompt, docs, and render from one definition.
3. **Adaptivity descriptor per block:** size classes via container queries, `inputProfiles`, reflow behavior (D8) — replaces the `FormFactor` enum as layout driver.
4. **Tier boundaries:** workspaces (44) are demo/reference tier, NOT library exports; primitives and blocks are the published surface.
5. **Conformance suite seed:** the Design System workspace renders every registry example — formalize as the visual-regression + few-shot corpus.

### 3.2 longformer-ui-tailwind — Merge

Proved D1's point (Tailwind consumes tokens; tokens never depend on Tailwind). Two hand-maintained component trees will drift.

1. Ship `@lf/tailwind-preset`: only the `@theme` block mapping `--spacing-lf-*`, `--radius-lf-*`, `--color-lf-*` to token vars.
2. Human product code may use Tailwind via the preset; library components stay CSS Modules.
3. The conversion script (`convert-css-to-tailwind.mjs`) becomes a codegen check, not a second source of truth.

### 3.3 longformer-demo — Core

The permanent sandbox and the reference implementation the standard needs. Product ships the core-seven workspaces; the other ~36 stay as the design catalog.

1. **Interface seam per workspace:** `NotesStore` / `AgentSession`-style providers with mock and real implementations — swapping is a provider change (§10.3).
2. **Workspace registry contract:** id, layout builder, size-class support, required engines — the `satisfies Record<WorkspaceId, …>` pattern formalized.
3. **Agent loop contract:** the `generateSurface` pipeline (prompt from registry → engine → `parseGeneratedSurface` trust boundary → render) as the documented host integration.
4. **Core-seven boundary:** Chat, Generated/Apps, Desktop, Notes, Tasks/Calendar, Files, Settings ship; everything else is registry-generated on demand.

### 3.4 longformer-demo-tailwind — Merge

One demo host is enough once the Tailwind kit reduces to a preset. Fold anything unique back into `longformer-demo`. Its only lasting artifact is proof that the demo composes against either styling edition through the same public API.

### 3.5 longformer-www — Keep (re-base as theme override)

The brand identity is valuable, but it reuses `--lf-*` names with **different values** — a real collision.

1. **Theme override contract:** a theme is a file that reassigns `--lf-*` values under a scope (`data-lf-theme="parchment"`) — never a parallel definition of the same names.
2. First test of multi-brand theming: one token contract, two visual identities (OS dark-blue vs marketing parchment).
3. Adopt `@lf/tokens` as a dependency; site-specific components stay local.

### 3.6 proto — Harvest + retire

Its two ideas already won: template-bound generation became the block registry; the capability gate matches Arco's grant/audit model.

1. Harvest: capability-gated actions (confirm + audit before execute) fold into the block action-intent contract and Arco's grant store.
2. Harvest: "AI never invents layout" is now the bounded-vocabulary rule (spec non-negotiable #1).
3. Archive under `reference/` with a LEARNINGS note; no further development.

### 3.7 Forge landing — Harvest + retire

Earlier positioning superseded by longformer-www.

1. Harvest: template-catalog browsing UX (search, filter, detail modal) informs the Apps workspace and the §10.8 marketplace surface.
2. Remove the third palette; if the page stays live, restyle via a token override theme.

## 4. The primitive library: tier model and v1 targets

| Tier | Contents | Today | v1 target |
|---|---|---|---|
| **0 — Tokens** | `--lf-*` custom properties + TS mirror + Tailwind `@theme` preset | 1 `theme.css` + `tokens.ts` | Single canonical `theme.css`; named theme overrides (parchment, arco); DTCG source file feeding CSS + future native outputs |
| **1 — Primitives** | Button, Input, Textarea, Checkbox, Switch, Label, Badge, Chip, Avatar, Card, Modal, Menu, Tabs, Tooltip, HoverCard, ScrollArea, Divider, EmptyState, ListItem, ResizablePane, Kbd… | 84 (incl. ~50 domain cards) | ~25 true atoms ship as primitives; the ~50 domain card/widget components **reclassify as blocks** (they are data-driven composites, not atoms) |
| **2 — Blocks** | The AI's generation vocabulary: TextBlock, FormBlock, StatCardsBlock, ListingCardsBlock, CardGridBlock, CodeBlock, chart/finance/fitness families — each with Zod schema + prompt + adaptivity + examples + render | 59 (14 strict schemas, rest envelope-checked) | ~10 highest-use blocks with full `defineBlock` manifests; strict schemas for all shipped blocks; adaptivity descriptor required |
| **3 — Containers + shell** | AppShell, NavRail, ListPane, TopBar, FloatingChat, Composer stack, AgentBlock stack, SurfaceManager, canonical layouts (list-detail, supporting-pane, feed, single-focus) | 11 shell + SurfaceManager | Shell trio + Composer + SurfaceManager with named canonical layouts the AI selects by name |

### Conflicts to resolve before extraction

1. **Token collision:** longformer-www reuses `--lf-*` names with different values than the kit — same name must never mean two things; www becomes a named theme override.
2. **Three accent families** (OS blue `#5b8def`, parchment brown `#8a4b2f`, Forge indigo `#4f46e5`) — one canonical palette; others become themes.
3. **Duplicate component trees:** the Tailwind edition hand-duplicates ~375 files — reduce to a `@theme` preset before the trees drift.

## 5. Reuse map

| Component stack | Source today | Consumers | Priority |
|---|---|---|---|
| Form controls (Button, Input, Switch, Tabs, Modal, Menu…) | longformer-ui primitives | Every app + Arco settings/chat surfaces + generated apps | **P0** |
| Token contract + theme provider | `tokens/theme.css` + ThemeProvider | All apps; www + Forge as override themes; Arco via `--os-*` forwarding | **P0** |
| Block registry infrastructure (defineBlock, validate, catalog prompt) | `generated-ui/registry/` | Demo agent loop, Arco generative apps, future third-party registries | **P0** |
| Composer stack (input, toolbar, prompt chips, attach menu) | chat workspace (15+ files) | Demo chat, Arco chat, Hermes/OpenClaw pattern (reference) | P1 |
| Agent message blocks (thought, tool call, todo, file) | `chat/agent-blocks/` | Demo chat, Arco AgentEvent rendering | P1 |
| Shell trio (NavRail + main + context panel) + resizable splits | `components/shell/` | Demo workspaces, Arco desktop shell, any future host | P1 |
| SurfaceManager (windows, form-factor policies, drag/resize) | `surface-manager/` | Demo desktop, Arco window manager (currently separate impl) | P2 |
| List-detail canonical layout | email/notes/messages workspaces (ad hoc) | All master-detail workspaces + generated apps via layout name | P2 |
| ContextMeter / token ring | reference only (OpenClaw, Hermes) | Chat surfaces in demo + Arco | P2 |

## 6. Convergence with Arco: two halves of one standard

Arco's standards map defines Module 1 of its open standard as "UI language + binding." Longformer owns the other half. Neither repo alone is the standard.

| Arco supplies (runtime/protocol half) | Longformer supplies (design-system half) |
|---|---|
| openui-lang grammar and streaming (or its fork) | `--lf-*` token contract + theme overrides (multi-brand proof via www) |
| Query/Mutation → toolProvider live-data binding, no LLM round-trip | Primitive library (~25 atoms) styled by tokens only |
| `mergeStatements` patch semantics for agent-driven app updates | Block registry: Zod schema + prompt + examples + adaptivity per block |
| os.* capability intents, grants, audit — the action security model | Adaptivity model: size classes, container queries, canonical layouts |
| App manifest + bridge (install, permissions, per-window tokens) | SurfaceManager containers (window / phone / watch / widget) |

**The join point is the registry.** One `defineBlock` manifest emits everything both sides need: the openui-lang library definition Arco's prompts and linter consume, the A2UI/JSON payload schemas the spec-pluggable strategy (D3) requires, and the render mapping into Longformer components. Arco's generated apps then render Longformer-themed, adaptivity-aware blocks instead of raw `@openuidev/react-ui` components — exactly the "decouple the vocabulary from React / from upstream" change the fork analysis calls for.

## 7. Sequenced plan

**Phase 0 — Resolve conflicts (days)**
1. Declare `tokens/theme.css` canonical; convert www's palette to a scoped theme override; delete Forge's palette.
2. Pick `longformer-demo` as the single demo host; freeze the Tailwind demo.
3. Archive `proto/` into `reference/` with its learnings noted.

**Phase 1 — Extract the library (weeks)**
1. Split `@lf/tokens`, `@lf/primitives` (~25 atoms), `@lf/blocks`, `@lf/runtime` with zero shell imports.
2. Reclassify the ~50 domain cards from primitives to blocks with `defineBlock` manifests.
3. Reduce the Tailwind edition to `@lf/tailwind-preset` (the `@theme` mapping only).

**Phase 2 — Registry as product (weeks)**
1. shadcn-style CLI: `lf add <block>` copies source + manifest into any host; registry hostable from git/npm.
2. Strict Zod schemas + adaptivity descriptors for all 59 blocks; catalog prompt generated from the registry.
3. Design System workspace formalized as the conformance/visual-regression catalog.

**Phase 3 — Arco bridge (weeks)**
1. Registry emitter for openui-lang library definitions; Arco's `generate-prompts` consumes it.
2. Arco `AppSurface` renders registry blocks (Longformer components) instead of `@openuidev/react-ui`.
3. Map Arco's toolProvider to the block action-intent contract (`ActionBinder`) — one action model across both repos.
