# Longformer Design System & Generative-UI Frontend Spec

> Status: DRAFT v0.2 — iterate freely. Companion to `Project-planning.md` (which covers runtime/backend). This doc covers the **design system + frontend generation architecture** (styling, standards to adopt, how to author components/blocks/containers so an AI can reliably generate apps), the **adoption/standardization strategy** (§9), and the **lean product build strategy** for the flagship app itself (§10).

---

## Table of contents

1. [Goals & constraints](#1-goals--constraints)
2. [Current-state assessment](#2-current-state-assessment)
3. [Key decisions](#3-key-decisions)
   - [The 2026 generative-UI standards landscape](#the-2026-generative-ui-standards-landscape-context-for-d2d3)
   - [D1 — Styling: Tokens-first, CSS Modules core, Tailwind optional](#d1--styling-tokens-first-css-modules-core-tailwind-optional-not-required-never-the-ai-surface)
   - [D2 — shadcn/ui: Reference + cherry-pick](#d2--shadcnui-reference--cherry-pick-dont-adopt-as-the-system)
   - [D3 — Standards: AG-UI transport + spec-pluggable payload (A2UI-first, OpenUI optional)](#d3--standards-ag-ui-transport--spec-pluggable-payload-a2ui-first-openui-optional)
   - [D4 — Component architecture: four tiers](#d4--component-architecture-four-tiers-one-contract)
   - [D5 — The Generation Contract](#d5--the-generation-contract-single-source--schema--validator--prompt--docs--render)
   - [D6 — Two renderers, one registry](#d6--two-renderers-one-registry-bridge-static--streaming)
   - [D7 — Cross-device & cross-platform](#d7--cross-device--cross-platform)
   - [D8 — Adaptivity model (informed by Android adaptive apps)](#d8--adaptivity-model-informed-by-android-adaptive-apps)
4. [Recommended architecture](#4-recommended-architecture)
5. [AI generation flow (target)](#5-ai-generation-flow-target)
6. [Short-term plan (prototype)](#6-short-term-plan-prototype--weeks-low-risk)
7. [Long-term plan](#7-long-term-plan)
8. [Open questions / brainstorm](#8-open-questions--brainstorm-to-iterate)
9. [Adoption & standardization strategy](#9-adoption--standardization-strategy-what-it-takes-to-become-a-community-standard)
10. [Product build strategy — the lean flagship app](#10-product-build-strategy--the-lean-flagship-app)
    - [10.6 Install story](#106-install-story--one-app-engines-install-themselves) · [10.7 Generated-app lifecycle](#107-generated-app-lifecycle--apps-as-first-class-family-members) · [10.8 Portability & marketplace](#108-portability--marketplace--apps-that-outlive-the-platform) · [10.9 External services as heads](#109-external-services-as-heads--the-social-app-test-case)
11. [Appendix — decision summary](#11-appendix--decision-summary)

---

## 1. Goals & constraints

**Product goal.** A single design system + rendering runtime that lets an AI reliably generate apps, cards, blocks, and full app containers — across form factors (desktop/tablet/phone/watch/widget) and eventually across platforms — inside an AI-IDE workspace that fuses work + personal tools.

**Non-negotiables driving every decision:**

1. **Bounded generation surface.** The AI should assemble from a *typed, validated vocabulary*, not emit arbitrary CSS/HTML/Tailwind. This is what makes generation reliable, themeable, and safe.
2. **Themeability.** Full light/dark/custom theming via tokens; no hardcoded values (already the house rule).
3. **Portability.** The kit is consumed by a host app today and should be consumable by openclaw-os / odyssey / openhands later without a heavy build coupling.
4. **One source of truth per concept** (tokens, component contract, prompt) — no drift between "what renders," "what the AI is told it can use," and "what's documented."

---

## 2. Current-state assessment

| Layer | Today | Verdict |
|---|---|---|
| Tokens | `--lf-*` CSS custom props, light/dark blocks, JS mirror in `tokens.ts` | ✅ Keep. Strong foundation. |
| Styling | CSS Modules + `cx()` | ✅ Keep as core. Good theming + portability, zero runtime cost. |
| Primitives | ~90 components, `forwardRef`, token-driven | ✅ Keep; needs a manifest layer. |
| Gen-UI | `GeneratedSurfaceSchema` (plain JSON) → 59 blocks via a big `switch` | ⚠️ Great concept; the discriminated union + switch won't scale to hundreds of blocks and has no runtime validation or prompt generation. |
| Multi-device | `SurfaceManager` + policies per form factor | ✅ Keep; blocks should *declare* form-factor support. |
| AI prompt | (implicit — the model must "know" the 59 block shapes) | ❌ Missing. No generated grammar/prompt from the schema. Biggest gap. |

**Takeaway:** you already have ~80% of a generative design system. The missing 20% is a *contract/registry layer* that turns each block into (schema + validator + prompt + docs + render mapping) from one definition, plus a decision on how streaming fits in.

---

## 3. Key decisions

### The 2026 generative-UI standards landscape (context for D2/D3)

"Standard" splits into **three layers**, and no single project owns all of them. Picking wisely means composing the right layer at each level rather than betting the product on one library.

| Layer | Role (*how* vs *what*) | 2026 contenders | Notes |
|---|---|---|---|
| **Transport** | *How* agent↔UI messages stream (events, bidirectional state) | **AG-UI** (CopilotKit); MCP / A2A for context & agent-to-agent | AG-UI is becoming infrastructure — AWS Bedrock AgentCore + Microsoft Agent Framework shipped support in 2026. OpenUI's `react-headless` already speaks AG-UI events. |
| **Gen-UI spec** (payload) | *What* to render, as data | **A2UI** (Google, Apache-2.0), **MCP Apps / MCP-UI** (Anthropic + OpenAI), **OpenUI** (thesys) | This is the contested layer. See breakdown below. |
| **Frameworks / SDKs** | Batteries-included DX | CopilotKit, Vercel AI SDK (RSC = experimental), Tambo, assistant-ui, OpenUI `react-ui` | Consume, don't marry. |

The three payload specs embody **two philosophies**, and the difference is decisive for a *unified, themeable, adaptive* design system:

- **Native-first / "UI-as-data"** — agent emits an abstract component blueprint (JSON); the client renders it with **its own native, themed components**. This is **exactly the Longformer model** (schema/blocks → our themed components, per D5). **A2UI** (Google, Apache-2.0, cross-platform — already in Google's GenUI SDK for Flutter and Gemini Enterprise, CopilotKit day-zero support) is the leading native-first spec, and multiple 2026 analyses call it the convergence winner. **OpenUI** is also native-first but delivered as a streaming *language* optimized for token efficiency.
- **Resource-first / iframe** — a tool returns a URI to pre-built HTML/JS rendered in a **sandboxed iframe**. **MCP Apps / MCP-UI** (official MCP extension, Jan 2026). Great for *third-party / untrusted* tool UIs and security isolation, but it **does not use our design system** (each app ships its own HTML → can't be uniformly themed or made adaptive). Complementary, not a substitute.

Prior art worth studying for the "JSON schema → cross-platform native render" pattern: **DivKit** (Yandex, open-source SDUI, iOS/Android/Web) and **Microsoft Adaptive Cards**.

Sources: [QubitTool — A2UI vs AG-UI vs Vercel](https://qubittool.com/blog/a2ui-vs-ag-ui-vercel-agent-ui-comparison) · [CopilotKit — State of Agentic UI](https://www.copilotkit.ai/blog/the-state-of-agentic-ui-comparing-ag-ui-mcp-ui-and-a2ui-protocols) · [innFactory — A2UI vs MCP-UI](https://innfactory.ai/en/blog/a2ui-vs-mcp-ui-comparison-of-user-interfaces-for-agentic-ai/) · [MCP Apps announcement](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/) · [MCP-UI](https://mcpui.dev/guide/introduction.html) · [DivKit](https://github.com/divkit/divkit).

### D1 — Styling: Tokens-first, CSS Modules core, Tailwind optional (not required, never the AI surface)

**Recommendation:** Do **not** rewrite the kit in Tailwind. Keep CSS Modules + `--lf-*` tokens as the styling core.

Rationale:

- The **AI never authors styles** in the target architecture — it emits schema/DSL that maps to pre-styled, pre-themed components. Tailwind's value (fast class-based authoring) applies to *human* app code, not to generation. Letting a model emit raw Tailwind = unbounded, unverifiable, hard-to-theme output. That's the opposite of the goal.
- CSS Modules + custom properties already give you runtime theming (light/dark/custom) with zero JS, which Tailwind alone doesn't (Tailwind needs CSS-var theming *anyway* to be themeable — i.e. you'd end up back at `--lf-*`).
- Portability: a `.module.css` + tokens bundle drops into any React host; no Tailwind config/preset coupling required.

**But make Tailwind a first-class *option* for product/app-shell authoring**, via a **Tailwind v4 `@theme` preset that maps utilities to the same `--lf-*` tokens**. That way human-written product code (and any shadcn-style components you pull in) can use Tailwind without forking the token system. Rule: *Tailwind consumes tokens; tokens never depend on Tailwind.*

Decision matrix:

| Surface | Styling |
|---|---|
| Design-system components (primitives, blocks) | CSS Modules + tokens (core) |
| AI-generated output | Schema/DSL → prebuilt components (no CSS/Tailwind emitted) |
| Human product/app code, one-off screens | Tokens directly, or optional Tailwind-token preset |
| Third-party components you adopt (e.g. Radix-based) | Their styles re-skinned via token overrides |

### D2 — shadcn/ui: Reference + cherry-pick, don't adopt as the system

**Recommendation:** Treat shadcn/ui as *inspiration and a distribution-model blueprint*, not a dependency or theme.

- **Adopt the idea, not the code:** shadcn's real innovation is the **registry / "copy-in components" distribution model** (a CLI that installs source into your repo). This is *exactly* the right model for shipping Longformer components into openclaw-os / odyssey / openhands later, and for letting the AI "install" new blocks. Build a **Longformer registry** in this spirit (see D5/§7).
- **Optionally adopt Radix primitives** (unstyled, a11y-correct behaviors) *under* complex interactive components (Menu, Modal/Dialog, Tooltip, Popover, Tabs) if your hand-rolled versions ever fall short on accessibility/edge cases. You already have these, so this is opportunistic, not required.
- **Do not** adopt shadcn's Tailwind theme, its component styling, or its New-York/default aesthetic — you have a stronger, more distinctive token system and an "OS" look.

### D3 — Standards: AG-UI transport + spec-pluggable payload (A2UI-first, OpenUI optional)

**Recommendation:** Don't marry a single gen-UI spec. Adopt the **AG-UI transport**, keep the payload **spec-pluggable** from one registry manifest, and treat the **native-first / "UI-as-data"** philosophy (which A2UI leads) as the primary target because it *is* our architecture. OpenUI remains a first-class optional binding; MCP Apps covers third-party tool UIs. (Supersedes the earlier "converge on OpenUI" framing once the 2026 landscape is accounted for — see the landscape section above.)

Layer-by-layer:

- **Transport → adopt AG-UI.** It's becoming infrastructure (AWS/Microsoft), it's the bidirectional agent↔UI event layer we'd otherwise hand-roll, and OpenUI's `react-headless` already emits AG-UI events — so this is low-friction *and* future-proofs us regardless of which payload spec wins.
- **Payload → be spec-pluggable, A2UI-first.** The Generation Registry (D5) is the single source; add **emitters** so one block manifest can serialize to **A2UI** (native-first, Apache-2.0, cross-platform, converging), **OpenUI Lang** (streaming + token efficiency), and our own **`GeneratedSurfaceSchema`** JSON. We render every one of them into the *same* Longformer components. This makes us the component/adaptivity layer that plugs into whichever spec the ecosystem standardizes on — a far safer bet than tying the product to one.
- **Why A2UI-first, not OpenUI-first:** A2UI's model is *exactly* ours (agent sends an abstract JSON blueprint → client renders with its own themed, native components), it's cross-platform (aligns with D7/D8 multi-device goals), Apache-2.0, Google-backed, and analyses point to it as the convergence winner. OpenUI is philosophically compatible and stronger on streaming/token-efficiency, so we keep it as a supported binding — especially on the **openclaw-os plugin path** (`@openuidev/openclaw-os-plugin`) that already speaks OpenUI.
- **Third-party / untrusted app UIs → MCP Apps (iframe-sandboxed).** Complementary to first-party themed blocks; use it where isolation matters more than design-system consistency.
- **Still useful from OpenUI regardless of spec choice:** `@openuidev/lang-core` for prompt/grammar generation from a component library, and `@openuidev/react-lang` / `react-headless` for streaming render + chat store. These fill the "no generated prompt today" gap immediately (D5) even before A2UI emitters land.

Why not fork any of them: all three specs are evolving external standards with parser/streaming/eval you don't want to maintain. Owning **emitters + a renderer over your own components** gives control of the design language without owning a spec.

### D4 — Component architecture: four tiers, one contract

```
Tier 0  Tokens          --lf-*  (color, space, radius, type, motion, z, elevation)
Tier 1  Primitives      Button, Card, Input, Avatar, Badge, Menu, Modal…  (atoms)
Tier 2  Blocks          data-driven composites the AI assembles (StatCards, CalendarSchedule, MediaCards…)
Tier 3  Containers      layout/app frames: AppShell slots, Desktop window, Phone stack, Widget tile, GeneratedSurface
```

- **Primitives** = themeable atoms, styling core (CSS Modules).
- **Blocks** = the **unit of AI generation**. Pure-data props (no functions on the wire), each with a schema + prompt description + form-factor support.
- **Containers** = where generated content lives: the `SurfaceManager` form-factor frames + a generic "app container" template so a generated app has consistent chrome (header, toolbar, body, actions) regardless of contents.

### D5 — The Generation Contract (single source → schema + validator + prompt + docs + render)

This is the centerpiece. Replace the implicit 59-type union + hand-maintained knowledge with a **manifest per block**:

```ts
// one definition per block → drives everything
defineBlock({
  type: "statCards",
  schema: z.object({ /* Zod */ }),        // → runtime validation + JSON Schema
  description: "Grid of KPI stat cards…",  // → prompt / model instruction
  formFactors: ["desktop","tablet","phone","widget"],  // adaptivity + filtering
  capabilities: ["display","metric"],      // → tagging / retrieval / policy
  examples: [ /* golden samples */ ],       // → few-shot + Storybook + tests
  render: (props) => <StatCards {...props} />,
})
```

From this one object you generate, with no drift:

1. **Runtime validation** (reject/repair malformed AI output before render).
2. **JSON Schema / grammar** for constrained decoding or tool-call args.
3. **The system prompt / OpenUI library definition** (via `lang-core`) — the AI's menu.
4. **The design catalog / Storybook** (Design System workspace) from `examples`.
5. **The render mapping** (kills the giant `switch`; renderer becomes `registry[type].render`).

This is the convergence point of your current schema approach and OpenUI: both static `GeneratedSurfaceSchema` JSON and streaming OpenUI Lang resolve to the **same registry**.

### D6 — Two renderers, one registry (bridge static ↔ streaming)

| Use case | Renderer | Backed by |
|---|---|---|
| Chat streaming, forms, live charts | Streaming payload (OpenUI Lang / A2UI) via streaming renderer | shared registry |
| Durable dashboards / generated apps | A2UI / OpenUI app surface *or* static `GeneratedSurfaceSchema` | shared registry |
| Design catalog / Storybook | Longformer blocks direct | registry `examples` |
| Desktop widget tiles | primitives or thin blocks | shared registry |

Short-term the two renderers coexist; long-term both read the registry so a block authored once is renderable by either path. This is the "bridge OpenUI Lang ↔ Longformer blocks" from planning, made concrete.

### D7 — Cross-device & cross-platform

- **Now (web, all form factors):** tokens + `SurfaceManager` policies already do this; blocks must *declare* `formFactors` (D5) so the generator only offers valid blocks per surface, and blocks adapt layout via token-driven breakpoints/container queries.
- **Later (non-web / native):** keep tokens as the **portable contract**. Introduce a **token pipeline (e.g. Style Dictionary)** that emits `--lf-*` CSS *and* platform outputs (RN/Swift/Compose/JSON) from one source. Because the AI targets *component contracts*, not CSS, a native renderer can implement the same registry types later without changing the generation layer.

### D8 — Adaptivity model (informed by Android adaptive apps)

Android's adaptive-apps guidance ([developer.android.com/adaptive-apps](https://developer.android.com/adaptive-apps)) codifies patterns we should adopt wholesale, because "generate an app that works on any device" is only credible if adaptivity is a *property of every block and container*, not a per-app afterthought. The core lesson: **break layout by available window size, not by device type**, then reflow via reusable canonical layouts and preserve continuity across form factors.

**What we already have (keep):** `SurfaceManager` reflow policies (`reflowTabletWindows` splits into 1/2/3 panes), phone navigation stack, watch glances, widget tiles, and per-form-factor `allowDrag/allowResize/maxVisible` rules. This is a strong adaptive substrate.

**The gap to close:** we currently drive layout off the `FormFactor` enum (`desktop | tablet | phone | watch | widget`) — a *device class*. Android moved away from this to **window size classes** because a foldable, a resized desktop window, a tablet split-pane, and a phone in landscape all vary *continuously*. A desktop window at 380px wide should look like the phone layout; our enum can't express that.

Concrete adoption plan:

| Android concept | Longformer mapping | Action |
|---|---|---|
| **Window size classes** (Compact / Medium / Expanded, on width *and* height) | New primary adaptive axis, evaluated per *container* (window/pane), not per viewport | Add size-class breakpoints driven by **CSS container queries** so a block adapts to its window/pane, not the screen |
| **Device class** | `FormFactor` becomes an **input/intent profile** (pointer vs touch, watch, widget), not the sole layout driver | Keep enum for input + chrome; layout keys off size class |
| **Canonical layouts** (list-detail, supporting-pane, feed) | **Container** tier templates (Tier 3) | Formalize `list-detail` (ListPane + main), `supporting-pane` (context panel), `feed/grid`, `single-focus` as named layouts the AI selects |
| **Reflow / adapt** | Existing reflow policies + block-level collapse | Blocks declare reflow behavior (columns → rows, hide-secondary, summarize) |
| **Continuity** (resume across form factors) | `SurfaceManagerState` (phoneStack, watchGlanceIndex, window rects) | Formalize (de)serialization of surface + focus state so switching form factor resumes in place |
| **All input types** (mouse, touch, keyboard, stylus, a11y) | `lf-focusable` + tokens | Add pointer-vs-touch hit-target tokens; ensure every block is keyboard-navigable and ARIA-correct |
| **Foldable postures** (tabletop/book) | Tablet split policy | Future: hinge-aware two-pane variant of the tablet policy |
| **Avoid letterboxing / compat mode** | — | **Hard rule: generated output is fully fluid** — no fixed device widths, container-query based; a block must render at any size |

**Impact on the Generation Contract (D5):** replace the flat `formFactors: FormFactor[]` field with a richer `adaptivity` descriptor so the generator and renderer reflow *deterministically* instead of guessing:

```ts
defineBlock({
  type: "statCards",
  // …schema, description, examples, render…
  adaptivity: {
    inputProfiles: ["pointer", "touch"],   // was: formFactors
    minWidth: 220,                          // px the block needs before it must reflow
    idealColumns: { compact: 1, medium: 2, expanded: 4 },
    onCompact: "stack",                     // stack | scroll | summarize | hide-secondary
  },
})
```

This lets the AI target **canonical layouts + size-class hints** rather than pixel coordinates — which is exactly what makes a single generated app "adaptive by construction" across phone, tablet, desktop window, watch glance, and widget.

---

## 4. Recommended architecture

```
        ┌──────────────────────────────────────────────┐
        │  Token source (Style Dictionary, future)      │
        │   → theme.css (--lf-*)  → native tokens later │
        └───────────────────────┬──────────────────────┘
                                 ▼
   ┌───────────────── longformer-ui ─────────────────────┐
   │  Primitives (CSS Modules + tokens)                    │
   │  Blocks  ──registered──▶  Generation Registry         │
   │  Containers / SurfaceManager                          │
   └───────────────────────┬───────────────┬──────────────┘
                            │               │
              (prompt/grammar gen)     (render mapping)
                            ▼               ▼
        Payload emitters:  A2UI · OpenUI Lang · GeneratedSurfaceSchema
                            │               │
             OpenUI lang-core  ──▶  react-lang (stream)   ── Chat
             JSON Schema       ──▶  GeneratedSurface (static) ── Apps/Desktop
                            ▲
             AG-UI transport ── LLM (OpenClaw agent)
```

---

## 5. AI generation flow (target)

1. Registry generates the **system prompt / OpenUI library** = the model's allowed vocabulary (filtered by the target surface's size class, input profile, and capabilities per D8).
2. Agent emits **OpenUI Lang** (streaming) or **block JSON** (static/tool-call).
3. Output is **validated** against the registry schema (Zod), auto-repaired if possible.
4. Renderer resolves each node via `registry[type].render` into themed Longformer components.
5. Ephemeral → inline in Chat; durable → `app_create` → Apps + Desktop window (a **Container** template).

---

## 6. Short-term plan (prototype — weeks, low risk)

1. **Add a registry + Zod schemas** for the existing 59 blocks; refactor `GeneratedSurface`'s `switch` to `registry[type].render`. (Mechanical, high leverage.)
2. **Generate the system prompt from the registry** — even a simple serializer unblocks reliable generation *today*.
3. **Add runtime validation + repair** on generated schemas.
4. **Spike OpenUI in Chat**: `react-lang` + `react-headless`, one small Longformer component library registered into OpenUI, stream a couple of block types end-to-end.
5. Keep Vite + CSS Modules + npm workspaces as-is. No Tailwind yet.
6. Feed `examples` from the registry into the Design System workspace as the living catalog.
7. **Adaptivity spike:** convert 2–3 blocks to **container-query size classes** and add the `adaptivity` field (D8) to their manifests; verify they reflow correctly inside a resized desktop window, a tablet pane, and the phone stack.

---

## 7. Long-term plan

1. **Unify on the registry** so every payload emitter (A2UI, OpenUI Lang, our own JSON) and the static schema share one source; deprecate the bespoke union.
2. **Ship a Longformer registry/CLI** (shadcn-style) so components/blocks can be "installed" into host apps (openclaw-os / odyssey / openhands) and by the AI itself.
3. **Optional Tailwind-token preset** for product authoring; adopt Radix behaviors where a11y demands.
4. **Style Dictionary token pipeline** → multi-platform token outputs; prototype one non-web renderer against the registry.
5. Converge on **pnpm + React 19** when merging monorepos (per planning doc).
6. **App Container template system** (chrome, permissions, data-binding slots) so generated apps are first-class, installable, and consistent.

---

## 8. Open questions / brainstorm (to iterate)

- **Schema library:** Zod (great DX, JSON-Schema export) vs TypeBox/Valibot (lighter, JSON-Schema-native). Registry design should stay schema-lib-agnostic.
- **Constrained decoding:** do we want grammar-constrained generation (guaranteed-valid output) or validate-and-repair? Affects model/provider choice.
- **Interactivity contract:** generated blocks currently render display-only. How do actions/mutations flow back (OpenUI Query/Mutation vs Longformer event bus vs agent tool round-trip)? Needs a standard "action" primitive on the wire.
- **Data binding:** static snapshot data vs live-bound (block references an entity ID from the shared store). Impacts caching and the entity-store work in the planning doc.
- **How much of OpenUI `react-ui` do we use** vs render everything through Longformer components? Recommend: use OpenUI as pipeline, render Longformer components — but confirm charts/tables aren't worth adopting from `react-ui`.
- **Registry as the AI's "app store":** should the AI be able to *author new blocks* (compose primitives) at runtime, or only assemble existing ones? Big product lever.
- **Versioning/theming per app:** do generated apps get their own theme scope (token overrides) so multiple "apps" can look distinct within one shell?
- **Doc/catalog tooling:** Storybook vs your existing Design System workspace as the canonical catalog.
- **Size-class thresholds:** what width/height breakpoints define Compact/Medium/Expanded for our surfaces (Android uses ~600/840dp width)? Do watch/widget get their own classes below Compact?
- **Canonical layout set:** which named layouts do we commit to (list-detail, supporting-pane, feed, single-focus, …) and can the AI compose them, or only pick one per app container?
- **Container queries support:** confirm the target browsers/webviews (openclaw-os, agent-canvas, odyssey) support CSS container queries, else provide a ResizeObserver fallback in the renderer.
- **Core-seven boundary (§10):** is Email in or out of the initial product? (It's the strongest Odysseus pull, but also the heaviest non-core surface.) Same question for Orchestrator vs folding fleet visibility into Chat.
- **Joplin vs plugin SQLite for Notes:** full Joplin engine (sync, E2EE, mobile apps for free) vs a simple plugin table (lean, no extra process). Decide at v0.2 based on whether sync/mobile matters by then.
- **AppManifest formalization (§10.7/10.8):** when does the manifest become part of the versioned spec (§9.2)? The `actions`/`data`/`portability` fields need schema definitions before the marketplace can exist.
- **Action intent vocabulary:** is there a standard set of intents (`task.create`, `calendar.add`, …) or free-form intents with JSON-schema payloads? A small standard vocabulary maximizes app interoperability across hosts.
- **Manifest signing & identity:** what signs marketplace manifests (author keys, registry attestation)? Needed before shared apps can be trusted.

---

## 9. Adoption & standardization strategy (what it takes to become a community standard)

A *library* gets used; a *standard* gets **implemented by other people**. Everything below is about crossing that gap: separating the open spec from our implementation, driving switching cost to near-zero, building network effects, and being honest about positioning in a space that already has incumbents at every layer (AG-UI, A2UI, MCP Apps, OpenUI, shadcn/ui — see the landscape section in §3).

### 9.1 Positioning — own a *different layer*; be spec-pluggable, don't collide

The payload-spec layer already has strong, well-backed contenders (A2UI from Google, MCP Apps from Anthropic/OpenAI, OpenUI from thesys) and the transport layer is consolidating on AG-UI (AWS/Microsoft). Launching a *rival* transport or payload spec would fragment the ecosystem and we'd probably lose. So don't.

- **Our defensible, differentiated contribution is a different layer:** the **adaptive, themeable design-system + component-contract/registry** (Tiers 0–3, the D5 manifest, the D8 adaptivity model). None of the transport/payload standards own this.
- **Strategy: be the standard component + adaptivity layer that is *spec-pluggable*** — one registry manifest emits A2UI / OpenUI Lang / our own JSON (D3) and renders them all into our themed, adaptive components, over AG-UI transport. Contribute the adaptivity descriptor + canonical layouts upstream (e.g. as an A2UI-compatible extension). *Compose with the winning specs; don't compete with them.*
- Keep our core spec **language-, framework-, and payload-agnostic** so no single spec is load-bearing — this is what lets us ride whichever standard the ecosystem converges on (currently trending A2UI) without a rewrite.
- One-liner that stakes the claim without overlapping: **"the adaptive, themeable component-contract layer for generative UI"** (vs AG-UI = the transport, A2UI/OpenUI = the payload spec, shadcn = static component distribution).

### 9.2 Separate the spec from the implementation

A standard is a *versioned document + machine-readable schema*, not a repo. To be implementable by others we must publish, independently of `longformer-ui`:

- A **versioned spec** of the Generation Contract: block manifest shape, the JSON Schema/grammar format, the **token contract** (`--lf-*` names + semantics), the **adaptivity descriptor** (D8), and the **canonical-layout catalog**.
- A **spec site** + the `longformer-ui` React **reference implementation**.
- A **conformance test suite** so anyone can build a compatible renderer (Vue/Svelte/native/another design system) and *prove* compliance. Conformance is precisely what turns "our library" into "a standard."

### 9.3 Minimize switching cost — meet people where they are

- **Adapters, not ultimatums.** The registry must accept *any* component — teams keep their shadcn/Radix/Tailwind/in-house components and register them into the contract. Adoption cannot require abandoning existing investments.
- **Incremental.** Usable one block at a time; no all-or-nothing rewrite.
- **Escape hatches.** Eject-to-source (shadcn-style), bring-your-own-renderer, override tokens. Zero lock-in is a feature.
- **Table-stakes DX.** CLI (`create`, `add`, prompt/schema generation), starter templates, a live playground (prompt → streamed render), copy-paste snippets — the bar shadcn and OpenUI both already set.

### 9.4 Network effects — an open registry / marketplace

The real moat is a flywheel, not the code:

- Third parties publish **blocks / components / themes** to a shared, decentralized registry (git-URL or npm based, like shadcn registries). More blocks → more useful to the AI → more contributors.
- Every entry ships **schema + prompt + examples + a11y + adaptivity** so it is instantly AI-usable on install.
- Verified vs community tiers; discoverability; versioned entries.

### 9.5 Trust, safety, quality — the serious-adoption gate

- **Security:** generated UI is *data, never executable code*. Document the model explicitly — validate-before-render, no arbitrary JS/HTML/CSS execution, sandboxed. This is a hard blocker for enterprise adoption if left implicit.
- **Accessibility:** WCAG-compliant primitives by default; **a11y is part of conformance**, not optional.
- **i18n / RTL / density / reduced-motion:** built into tokens + contract, not bolted on.
- **Performance:** streaming + token efficiency (lean on OpenUI's ~67%-vs-JSON claim) + small runtime.
- **Stability:** semver, published deprecation policy, and **codemods/migrations** for both the spec and the packages.

### 9.6 Governance & licensing

- **Permissive license (MIT or Apache-2.0)** — non-negotiable for a standard. (Apache-2.0 adds a patent grant, which some enterprises prefer.)
- **Open, transparent governance:** public roadmap, an **RFC process** for spec changes, `CONTRIBUTING`, code of conduct, changelog. Consider a **neutral spec repo** so it doesn't read as single-vendor even while we drive it.
- **Model- and vendor-agnostic** core — works with any LLM/provider and any framework.

### 9.7 Proof & narrative

- **Dogfood in public:** the UI Experiments product is the flagship reference implementation (built per §10) — "one prompt, generated live across phone / tablet / desktop window / watch glance / widget" is the demo that sells the whole thesis (and showcases D8 adaptivity).
- **First integrations as proof points:** openclaw-os, agent-canvas, odyssey — each a "someone else implemented/consumed it" data point.
- Benchmarks + case studies once real.

### 9.8 Adoption scorecard (standard-readiness checklist)

| Requirement | Why it matters | Status |
|---|---|---|
| Versioned, human-readable spec doc | Others can implement it | ☐ |
| Machine-readable schema (contract + tokens + adaptivity) | Tooling + validation + conformance | ☐ |
| Conformance test suite | Turns library → standard | ☐ |
| Reference implementation (`longformer-ui`) | Something to point at | ◑ (kit exists) |
| Permissive license (MIT/Apache-2.0) | Legal adoptability | ☐ |
| CLI + starter templates | Low barrier to entry | ☐ |
| Live playground | Instant "aha" | ☐ |
| Docs site w/ examples | Learnability | ◑ (this spec) |
| Adapters (shadcn / Tailwind / Radix / BYO) | No switching cost | ☐ |
| Open registry / marketplace | Network effects | ☐ |
| Accessibility baseline (in conformance) | Serious use + inclusivity | ◑ (`lf-focusable`, tokens) |
| Documented security/sandbox model | Enterprise gate | ☐ |
| Semver + migration codemods | Trust over time | ☐ |
| Public governance + RFC process | Not single-vendor | ☐ |
| Framework-agnostic core | Multi-ecosystem reach | ☐ |
| Model/provider-agnostic | No AI lock-in | ◑ (OpenUI is provider-agnostic) |
| i18n / RTL support | Global adoption | ☐ |
| Community channels (Discord, GitHub) | Momentum | ☐ |

Legend: ☐ not started · ◑ partial · ✅ done.

---

## 10. Product build strategy — the lean flagship app

The design system needs community adoption (§9), but we are *also* building a real product on it — the AI workspace the UI Experiments repo prototypes. These two goals reinforce each other (the product is the flagship reference implementation) **only if the product stays lean**. This section is about how to build the actual app so it (a) doesn't bloat, (b) stays fast to prototype and iterate on, and (c) reuses existing open-source apps instead of rebuilding their functionality.

### 10.1 The prime directive: compose, don't rebuild

Every capability in the ~50-workspace prototype maps to an existing, mature open-source project. Rebuilding any of them is how the product bloats and dies. The rule: **Longformer owns the shell, the design system, and the generative-UI surface. Everything else is an engine we mount.**

| Capability | Don't rebuild | Reuse instead | Integration mode |
|---|---|---|---|
| Agent runtime, sessions, crons, channels | Chat backends, schedulers | **OpenClaw Gateway** + plugin (per `Project-planning.md`) | Primary backend; serves our UI as a plugin |
| Coding agent, terminal, git, automations | Code workspace internals | **[agent-canvas](https://github.com/OpenHands/agent-canvas)** (MIT) + OpenHands agent-server; speaks **ACP**, so Claude Code / Codex / any ACP agent work too | Library embed as the Code workspace |
| Notes / notebooks, sync, E2EE, mobile | Notes storage/sync engine | **[Joplin](https://github.com/laurent22/joplin)** (55k★) — offline-first Markdown, sync, plugin API, or its data API as a service | Data backend behind our Notes workspace |
| Email, calendar (CalDAV), documents, deep research, local models | Productivity services | **[Odysseus](https://github.com/pewdiepie-archdaemon/odysseus)** (80k★) — FastAPI services | Optional sidecar via HTTP/MCP tools (⚠ AGPL — keep at arm's length over API, never link/vendored) |
| RAG, model management, multi-provider chat plumbing | Inference/RAG stack | **[Open WebUI](https://github.com/open-webui/open-webui)** (144k★) — 9 vector DBs, web search, STT/TTS, RBAC | Reference architecture + optional API backend (⚠ branding-preservation license — treat as service, don't fork UI) |
| Agent workspace / gen-UI serving | Plugin packaging, app persistence | **[openclaw-os](https://github.com/thesysdev/openclaw-os)** (MIT) — plugin serves static UI from gateway, `app_create` AppStore, OpenUI prompt hook | The packaging blueprint; potentially replace claw-client with our shell |
| Everything above the line | — | **Longformer**: AppShell, SurfaceManager, tokens, blocks, registry, generated apps | The product itself |

License note: agent-canvas and openclaw-os are MIT (safe to embed); Odysseus is **AGPL-3.0** and Open WebUI has a **branding-preservation license** — both must stay separate processes we talk to over HTTP/MCP, never merged into our codebase.

### 10.2 Anti-bloat rules

Bloat is the default failure mode of "OS-like" apps (compare: Open WebUI ships RBAC + SCIM + 9 vector DBs; agent-canvas ships HeroUI + Monaco + xterm). We avoid it structurally, not by discipline:

1. **The demo's ~50 workspaces are a design catalog, not a product backlog.** The product ships with a *core seven*: **Chat (agent), Generated/Apps, Desktop, Notes, Tasks/Calendar, Files, Settings**. Everything else exists only as blocks/templates the AI can generate on demand — that's the product thesis anyway: *don't hand-build 50 apps; make the AI able to generate them*.
2. **Every non-core capability is a detachable engine.** If removing a feature requires touching the shell, it was integrated wrong. Engines mount per workspace (Code = agent-canvas embed; Email = Odysseus tools) and lazy-load: heavy deps (Monaco, xterm, chart libs) arrive only when their workspace opens.
3. **One dependency budget, enforced.** The core shell keeps roughly its current footprint (React + lucide + our kit; no state library until Phase 2, then only Zustand + TanStack Query per the planning doc). New deps need a reason the registry/adapters can't cover.
4. **No speculative platform features.** No RBAC, SSO, multi-tenant, i18n scaffolding until a real user needs them. Single-user self-hosted first — the same sequencing Open WebUI, Odysseus, and openclaw-os all followed while growing.
5. **The registry is the extension point, not the codebase.** New cards/blocks/apps land as registry entries (data + manifest), not as new workspace code. Code contributions to the shell should be rare; registry contributions should be constant.

### 10.3 Fast iteration loop

What makes prototyping fast is *keeping the mock-first workflow while adding real engines behind interfaces*:

- **Keep `longformer-demo` as the permanent sandbox.** Mock data, instant Vite reload, no backend needed. New UI ideas always land here first — this repo already proved that loop works.
- **Interface seam per workspace.** Each workspace consumes a thin data interface (e.g. `NotesStore`, `AgentSession`) with two implementations: mock (demo) and real (gateway/engine). Swapping is a provider change, not a rewrite. This is the split the planning doc already prescribes (registry + stores replacing the god-object `App.tsx`).
- **The design catalog is the test bed.** The Design System workspace renders every registry block from its `examples` — visual regression coverage and AI few-shot corpus in one place, no Storybook build needed until we want one.
- **Generated-first prototyping.** Once the registry emits prompts (§6), the fastest way to prototype a new workspace is to *ask the agent to generate it* from existing blocks — dogfooding the product as the dev tool.
- **Ship as a plugin, not an app server.** Follow openclaw-os packaging: static Vite export bundled into an OpenClaw plugin, served from the gateway (same origin, no CORS, no separate frontend server). Dev = Vite hot reload against a running gateway; prod = one process.

### 10.4 Two-track development

Track the standard (§9) and the product (this section) as separate deliverables sharing one codebase:

| | Track A — Product | Track B — Standard |
|---|---|---|
| Deliverable | Lean flagship app (7 core workspaces) on OpenClaw | Spec + registry + conformance + CLI |
| Optimizes for | Iteration speed, small footprint, real users | Implementability by others, zero switching cost |
| Ships from | `longformer-client` + `longformer-plugin` | `longformer-ui` + future spec repo |
| Proves | The experience works | The contract works |

The dependency between them is one-directional by design: the product consumes the registry exactly like a third party would. If the product ever needs a private hook into the design system, that's a spec gap to fix, not a shortcut to take.

### 10.5 Sequenced build plan (product)

1. **Now:** registry + prompt generation (§6 items 1–3) inside the existing demo; no backend.
2. **v0.1 (single process):** demo shell + OpenClaw gateway plugin, Chat workspace speaking OpenUI/AG-UI, generated blocks inline. Core seven workspaces only, mock data for Notes/Tasks.
3. **v0.2 (engines):** `app_create` persistence (openclaw-os pattern) for durable generated apps in Desktop; agent-canvas embedded as Code workspace (lazy-loaded); Notes backed by plugin SQLite or Joplin data API.
4. **v0.3 (optional planes):** Odysseus sidecar for email/calendar/research tools; Open WebUI-style RAG only if a real need appears.
5. **Each release, re-check §10.2:** anything that grew without a user need gets demoted back to a registry entry or an optional engine.

### 10.6 Install story — one app, engines install themselves

The trap is treating OpenClaw, agent-canvas, Odysseus etc. as things *the user* installs. They should be things **the app installs for itself**. Three moves get to a single-install experience:

**a) One process at the front — the gateway-plugin pattern, all the way.** openclaw-os proves the shape: `openclaw plugins install …` → the plugin bundles our static UI, the gateway serves it at one origin (no CORS, no second server). The user-facing install is either a one-shot `install.sh` that installs OpenClaw *and* the plugin (openclaw-os's installer already does the plugin half), or a single Docker image bundling gateway + plugin (the agent-canvas all-in-one `ghcr.io` image is the template — one container whose entrypoint supervises everything).

**b) A desktop wrapper for the "double-click" audience.** A thin **Tauri** app (preferred over Electron for footprint, per §10.2's dependency budget) whose only jobs are: supervise the gateway process, open the UI in a webview, handle tray/notifications/deep links. Open WebUI's desktop app validates the pattern. Critically it's a *wrapper*, not a fork — it ships the same static UI bundle.

**c) Engines self-provision on first use.** Heavy backends only exist once their workspace is opened: opening **Code** runs `uvx openhands-agent-server` (reusing agent-canvas's launcher logic, not inventing provisioning); enabling **Email/Research** pulls the Odysseus compose profile or points at an existing instance (AGPL stays at arm's length either way). Every engine gets a health/lifecycle card in Settings — think "extensions," not "infrastructure."

| Tier | User does | What runs |
|---|---|---|
| 0 | Nothing (hosted playground) | Demo with mock data |
| 1 | One command or one container | Gateway + plugin (UI, chat, generated apps) |
| 2 | Download desktop app | Tauri wrapper supervising Tier 1 |
| — | Clicks a workspace | Engines self-provision on demand |

### 10.7 Generated-app lifecycle — apps as first-class family members

Generated apps feel native — rather than like embedded widgets — because in this architecture **an app is data, not code**. "Installing" one is persisting a manifest:

```jsonc
// AppManifest (sketch — iterate)
{
  "identity":   { "id": "...", "name": "Trip Planner", "icon": "map", "hue": "teal", "description": "..." },
  "surface":    { "layout": "list-detail", "blocks": [ /* GeneratedBlock[] / registry payload */ ] },
  // adaptivity inherited from blocks (D8) — renders as window, phone page,
  // watch glance, or widget tile for free via SurfaceManager
  "data":       { /* entity bindings into the shared store — see 10.8 */ },
  "actions":    [ /* declared intents the app's buttons may invoke — see 10.8 */ ],
  "meta":       { "version": "1.2.0", "author": "agent|user", "permissions": [], "createdFrom": "<prompt>" }
}
```

Lifecycle, built on infrastructure that already exists or is planned:

1. **Generate** — agent streams the surface inline in Chat (ephemeral).
2. **Install** — "Open as app" → `app_create` (openclaw-os AppStore pattern, plugin SQLite). The manifest is now durable.
3. **Appear everywhere** — `SurfaceWindow` already keys on `appId`, and we have the `AppIcon` primitive, Apps workspace (marketplace + installed), and phone home screen block, so an installed manifest automatically shows up in the app grid, Desktop icons, dock, phone pages, and as a widget candidate. No per-app wiring.
4. **Belong** — it inherits tokens (theme), size-class adaptivity, and — the key differentiator — **shared entities**: a generated Trip Planner binds to the *same* tasks/contacts/calendar the built-in workspaces use, so built-ins and generated apps interoperate instead of siloing (leans on the entity-store work in `Project-planning.md` Phase 2).
5. **Update by prompt** — "make the budget tab weekly" → agent patches the manifest in place, version bumps (openclaw-os already demonstrates prompt-updates-in-place).
6. **Share** — a manifest is a small JSON artifact: export/import, or publish to the §9.4 registry.

**App trust tiers** (why the bounded generation surface of D5 pays off):

| Tier | Contents | Trust model |
|---|---|---|
| 1 | Pure block composition (data only) | Fully trusted, fully themed — validated against registry schema, nothing executes |
| 2 | Blocks + declared action intents routed through agent tools | Capability-scoped; install-time permission prompts |
| 3 | Real third-party code | MCP Apps iframe sandbox; visually badged "external" — precisely because it can't be themed/adaptive |

The elegant consequence: **the core-seven workspaces and generated apps converge on the same manifest format over time.** Notes or Tasks become, in effect, pre-installed apps with richer bindings — which keeps the shell honest (no private APIs, per §10.4) and makes "the AI builds apps like the ones that shipped in the box" literally true.

### 10.8 Portability & marketplace — apps that outlive the platform

Portability falls out of the same property: data can be re-rendered anywhere there's a conformant renderer, snapshotted, signed, and shipped. The work is being deliberate about the two things that *aren't* naturally portable (actions, data bindings) and shipping a small standalone runtime.

**The portability ladder** — each rung trades fidelity for reach; one manifest exports to all of them:

| Rung | What ships | Runs in | Keep / lose |
|---|---|---|---|
| 1. Platform app | manifest in AppStore | Our shell (gateway plugin) | Everything: theme, adaptivity, live data, agent actions |
| 2. Embedded app | manifest + `longformer-runtime` npm package | Any React app | Theme + adaptivity kept; host provides data/action adapters |
| 3. Drop-in web | manifest + CDN browser bundle (script + stylesheet, no build) | Any webpage, iframe, CMS | Same as 2; OpenUI's `browser-bundle` is the template |
| 4. Standalone PWA | manifest + runtime compiled to a static site (can be one HTML file) | Any browser; installable on a phone; offline-capable | Live platform data becomes snapshot or local storage |
| 5. Other AI ecosystems | manifest exported as **MCP App** (sandboxed HTML resource) or **A2UI payload** | Claude, ChatGPT, Gemini, any MCP/A2UI host | MCP keeps our look inside an iframe; A2UI trades our theming for the host's native components — maximal reach |

Rung 5 is strategically the most interesting: the D3 spec-pluggable emitters mean marketplace apps aren't locked into our platform — **"build an app in Longformer, use it in Claude"** is an adoption hook none of the current gen-UI players emphasize.

**The portability contract** — two manifest fields declared abstractly rather than wired to platform internals:

- **Actions → intents, not tool calls.** A button declares `{ "action": "task.create", "payload": <schema> }`; the *host* binds it: in-platform → agent tool; embedded → host callback; standalone → HTTP/MCP endpoint the manifest names; offline → queued or disabled. One `ActionBinder` interface in the runtime.
- **Data → bindings with declared fallbacks.**

```jsonc
"data": {
  "tasks":  { "entity": "task", "query": "...", "fallback": "snapshot" },      // baked-in data
  "prices": { "source": "https://api...", "fallback": "stale-or-hide" }
}
```

In-platform, bindings resolve to the shared entity store; embedded, the host supplies an `EntityProvider`; standalone, the runtime ships a localStorage/IndexedDB adapter. **Export = resolve bindings per target** (snapshot export bakes data in for rungs 4–5; live export keeps connector URLs). The manifest carries a computed `portability` grade (`offline-complete` / `needs-host-data` / `needs-agent`) which the marketplace displays before install.

**Marketplace mechanics** — closer to *npm for manifests* than an app store with binaries:

- **Distribution:** shadcn-registry-style — any git URL or npm package can host apps; the official index is a curated catalog over that. No central gatekeeper, which also fits §9's standardization story.
- **Integrity:** manifests are semver-versioned and signed; installs pin a version; prompt-updates create new versions → shared apps have history and rollback.
- **Security review is tractable by construction:** Tier-1 apps are data validated against schema (nothing executes — automated review suffices); Tier-2 apps declare capability scopes (`task.create`, `network:api.example.com`) shown as install-time permissions; Tier-3 is iframe-sandboxed and badged. This tiering is what makes a *safe* community marketplace possible where "AI app stores" built on generated code struggle.
- **Marketplace portability:** an entry = manifest + declared spec version + minimum block set it needs. Anyone implementing the §9.2 conformance suite can host the same apps — the marketplace itself is portable across implementations, which is the standard-not-library endgame.
- **Block availability:** a shared app referencing block types the installing host lacks needs a resolution step — the registry auto-installs missing block definitions (they're also data + a render mapping) or the app declares a minimum block-set version, npm-dependency-range style. The manifest should carry this from day one.

### 10.9 External services as heads — the social-app test case

The engine pattern generalizes beyond the §10.1 table: **anything with an open API or protocol becomes a themed, adaptive workspace or generated app** rendered through our blocks. The shell is a presentation OS; external services are headless backends we put a "head" on. Social apps make a good test case because they span all three integration classes:

| Class | Example | How it mounts | Ships as |
|---|---|---|---|
| **Connected service** (open API, remote) | Mastodon, Bluesky / AT Protocol, Lemmy | Adapter behind an interface seam (§10.3) — connect to any instance via REST/OAuth/streaming, the way official mobile clients do. No background process. | **Tier-2 generated app** — data bindings (`{ "source": "mastodon", "query": "timeline/home" }`) + action intents (`post.create`, `post.boost`) via the ActionBinder |
| **Supervised local engine** (p2p, runs in background) | Nostr, Scuttlebutt, Holepunch/Pear | §10.6 self-provisioning — opening the workspace spawns/supervises the local node (like Code spawns `uvx agent-server`), health card in Settings. Nostr is lightest (mostly websocket relay connections). | Tier-2 app + engine declaration |
| **Closed platform** (no open API) | Facebook, Instagram | No meaningful public API; scraping/automation violates ToS. Only option: sandboxed iframe/webview, unthemed. | **Tier-3 external embed**, badged — or nothing |

**The boundary rule:** whether we can serve a UI for something is decided by *does it expose an open API or protocol*, not *is it popular*. Closed platforms get the Tier-3 escape hatch at best.

What this class of integration requires from the manifest/runtime (feeds §8 open questions):

- **Account connections:** OAuth flows need a redirect surface — the single-origin gateway plugin handles this, but manifests must declare `requires account connection: <service>` so install-time UX can prompt for it.
- **Realtime data:** Mastodon streaming / Nostr subscriptions push data over our AG-UI/WebSocket layer into **live-bound** blocks — this makes the §8 "snapshot vs live data binding" question concrete.
- **Entity mapping:** posts/profiles/DMs map into the shared entity store like notes and contacts do — which is what lets the agent operate across social + calendar + notes in one context (e.g. summarize your feed, draft replies, generate a topic dashboard bound to your social data).

The product angle worth noting: a p2p social engine + this shell + the agent = a fully self-hosted social client with AI in the loop — a combination none of the reference projects offer.

---

## 11. Appendix — decision summary

| Question | Decision | One-liner |
|---|---|---|
| Tailwind? | **No for the system; optional token-preset for product code** | AI emits schema, not CSS — Tailwind isn't the generation surface. |
| shadcn/ui? | **Reference + registry model + optional Radix** | Adopt the distribution idea, not the theme/dependency. |
| Standards (transport + spec) | **AG-UI transport; spec-pluggable payload, A2UI-first, OpenUI optional; MCP Apps for 3rd-party** | Don't marry one spec — emit many from one registry, render into our components. |
| Component model | **Tokens → Primitives → Blocks → Containers** | Blocks are the AI's unit of generation. |
| Generation | **One manifest per block → schema+prompt+render+docs** | Kill drift; single source of truth. |
| Renderers | **Two paths, one registry** | Static JSON and streaming Lang share components. |
| Cross-platform | **Tokens as portable contract; Style Dictionary later** | AI targets contracts, not CSS. |
| Adaptivity | **Break by window size class (container queries), not device type; canonical layouts** | Fluid-by-construction; blocks declare size/reflow hints. |
| Standardization | **Compose with the winning specs (A2UI/AG-UI/OpenUI); publish an open spec + conformance suite; zero switching cost** | Own the adaptive component-contract layer; a library is used, a standard is implemented by others. |
| Product build | **Lean flagship: shell + 7 core workspaces; everything else = engines (OpenClaw, agent-canvas, Joplin, Odysseus) or AI-generated** | Compose, don't rebuild; the demo's 50 workspaces are a catalog, not a backlog. |
| Install story | **One command/container (gateway + plugin); Tauri wrapper for desktop; engines self-provision on first use** | The user installs one app; the app installs its own backends. |
| Generated apps | **App = AppManifest (data, not code) → `app_create` → appears in Apps/Desktop/phone/widgets; 3 trust tiers** | Core workspaces and generated apps converge on one manifest format. |
| Portability | **Abstract intents + data bindings with fallbacks; standalone runtime; export to npm/CDN/PWA/MCP App/A2UI; npm-for-manifests marketplace** | Apps are signed, versioned JSON — they outlive the platform. |
| External services | **Open API/protocol → connected service or supervised p2p engine (as marketplace apps); closed platforms → Tier-3 embed at best** | The shell is a presentation OS; the boundary rule is "open protocol," not popularity. |
