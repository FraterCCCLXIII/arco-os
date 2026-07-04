# Future Ideas — Paradigm Candidates

> Status: SPECULATIVE (ideas 1–4) — not on any roadmap. Companion to `Project-planning.md` (runtime/integration) and `DESIGN-SYSTEM-SPEC.md` (design system / generation / security). Ideas 1–4 are candidate **paradigm shifts** beyond the current plan — "genuinely different," not "a well-architected version of the current one." The final section (**inference economy**) is different in kind: a design center that should inform the current architecture now. Captured July 2026 from brainstorm sessions; revisit when the core product (spec §10 core seven, planning P0–P2) is real.

---

## Table of contents

1. [Capabilities, not apps](#1-ditch-apps-as-the-unit--capabilities--views)
2. [Model as the shell](#2-local-model-as-the-shell-not-a-service-the-shell-calls)
3. [The graph is the OS](#3-the-graph-is-the-os--files-apps-and-permissions-are-graph-views)
4. [Scoped agent-to-agent negotiation](#4-federatedlocal-agents-with-scoped-identity-negotiating-on-your-behalf)
5. [Assessment & sequencing](#assessment--sequencing)
6. [Hooks into the current architecture](#hooks-into-the-current-architecture)
7. [Inference economy — every model call must justify its existence](#inference-economy--every-model-call-must-justify-its-existence)

---

## 1. Ditch "apps" as the unit — capabilities + views

Even the current model keeps **apps** as the top-level object (manifests, marketplace, trust tiers). The radical version: **there are no apps, only capabilities and views.**

- A **capability** is a small, composable function: `send-message`, `edit-document`, `query-calendar`, `run-model`.
- A **view** is a rendering of one or more capabilities for a context.
- The marketplace sells **capabilities and view-templates separately**; the system (or user, or AI) composes them at runtime.

This is Unix pipes / iOS Shortcuts–App Intents pushed all the way: "opening an app" stops being a meaningful user action. You stop asking *"which app do I use for X"* and start asking *"what do I want done"* — the system assembles the capability chain live.

**Why it's disruptive:** it breaks the app-store business model at the root. Monetization shifts to capability-usage or subscription-to-capability-bundles — a real economic redesign, not just a UI one.

**Risk:** this is what many "AI OS" pitches promise and few deliver. Capability composition without an app boundary makes **permissioning and predictability much harder** — you lose the "this app can only do X" mental model that makes today's sandboxing legible to users. If we go here, the capability-token system (`DESIGN-SYSTEM-SPEC.md` D10) isn't optional infrastructure — **it is the entire security model**, because there's no app boundary to fall back on.

---

## 2. Local model as the shell, not a service the shell calls

Every current "AI-first OS" concept — including ours — treats the model as a **service invoked by the app layer**. The radical framing: **the model-inference process is the window manager / shell process.**

No separate UI shell that calls an AI. The shell's rendering loop is itself continuously conditioned on device state, user history, and running processes — the way a game engine's render loop is continuously conditioned on game state. The "desktop" is one continuous inference output, not discrete AI-generated screens stitched into a traditional UI toolkit.

This is what some generative-UI research demos (Project Astra–adjacent work, "world model as interface" experiments) gesture at, but nobody has shipped it as a daily-driver shell — for good reason: **latency and determinism**. A render loop that depends on live inference for every frame is a UX nightmare with today's models.

**The plausible hybrid:** deterministic template rendering (the D5/D8 registry model) for 95% of the frame, with a continuously-running low-latency local model doing only **anticipatory pre-fetch and layout weighting** — deciding *what to surface*, not drawing pixels. That's genuinely different from "call the LLM, get JSON, render template" — closer to a **recommender system fused into the render pipeline**.

---

## 3. The graph is the OS — files, apps, and permissions are graph views

The current plan treats the semantic graph (entity store) as **one subsystem alongside** a filesystem, an app registry, and a permissions system. The radical version collapses all of them into the graph:

- There is **no separate filesystem** — files are graph nodes.
- Apps are graph nodes.
- Permissions are **edges with scope metadata**.
- Sync is **graph replication** (CRDT).

This is the old "everything is an object in a persistent store" idea (Smalltalk images, IBM OS/400 single-level store, the WinFS ambition) **married to an AI query layer instead of SQL**.

**Why now and not in 1995:** WinFS and OS/400-style stores never went mainstream because querying a giant object graph in natural, ad hoc ways was too hard for humans with SQL-like tools — you needed a rigid schema-first mental model. **An LLM sitting on top of a graph store is the first plausible answer to "how do normal humans navigate a schema-less persistent object space"** — natural language becomes the query language.

This is probably the single most technically defensible "why is this actually new now" argument in the whole concept: graph-native OSes aren't a new idea; the interface that makes them usable didn't exist before LLMs.

---

## 4. Federated/local agents with scoped identity, negotiating on your behalf

Instead of one "assistant" that acts **as you**, model the system as **many narrow agents**, each cryptographically scoped to a specific capability and a specific counterparty, negotiating with other agents over a shared protocol:

- Your calendar agent talks to a restaurant's booking agent.
- Your shopping agent talks to a merchant's agent.
- Both sides run their counterparty-facing agent **on their own device/infrastructure** — neither needs to trust a central platform.

This is the "agentic web" idea (agent-to-agent commerce protocols), but most current pitches keep it cloud/enterprise-facing. Bringing it down to the **personal-OS level** is a genuinely different trust topology than "an assistant acts as you across the internet" — and it maps directly onto the local-first, capability-token security model already specified (D10).

---

## Assessment & sequencing

| # | Idea | Novelty | Buildability | Verdict |
|---|------|---------|--------------|---------|
| **3** | Graph-as-OS + NL query layer | High | **High** — CRDT sync, capability security, and LLM-as-query-interface are all real, working tech today, just never combined this way | **The one to bet on.** Deepest structural change that requires solving nothing currently unsolved |
| **1** | Capabilities, not apps | High | Medium | Most disruptive to the business model of computing; hardest to make legible/safe for end users |
| **2** | Model as render loop | High | **Low today** — latency/hardware not there for daily-driver use | Great **north star to design toward**, premature to build |
| **4** | Scoped agent negotiation | Medium | Medium | A **layer on top** of whichever of the others gets built, not a foundation by itself |

---

## Hooks into the current architecture

None of these require abandoning the current plan — each has a natural on-ramp from what's already specified:

| Idea | On-ramp that already exists |
|------|------------------------------|
| **1 — Capabilities** | The §10.8 **action-intent vocabulary** (`task.create`, …) *is* a capability layer in embryo; the AppManifest's `actions` field could become the composition unit. D10 capability tokens are the required security model |
| **2 — Model as shell** | The registry's per-surface vocabulary filtering (D5/D8) is the deterministic 95%; a local model doing "layout weighting" plugs in as a ranking signal, not a rewrite |
| **3 — Graph-as-OS** | The **entity store** (planning Phase 2) is the seed graph; Psyche is its admin UI; CRDT federation is already parked in spec §8. Migration path: entity store → files-as-entities → apps-as-entities → permissions-as-edges |
| **4 — Agent negotiation** | OpenClaw sessions + MCP are the protocol substrate; D10's scoped, expiring grants are the identity primitive. Relay-style protocol-spec thinking applies |

**Guardrail:** don't let any of these leak into P0–P2 scope. The current plan (core seven + gen-apps + capability security) is the prerequisite for all four — a shipped graph with real user data is what makes idea #3 testable at all.

---

## Inference economy — every model call must justify its existence

> Unlike ideas 1–4, this is not a paradigm shift to defer — it's a **design center** that should inform the current architecture from the start. Most "AI-first" pitches quietly assume inference is cheap and gets cheaper, which is exactly backwards for something that runs on watches and stays local. The biggest lever isn't a faster model — it's **using inference only where nothing else will do the job**. Layers below run from "avoid inference entirely" to "make the inference you do run as cheap as possible."

### Layer 1 — Avoid inference: cache and reuse intent, don't regenerate it

- **Deterministic template rendering, AI only for selection.** If 95% of what the AI does is "pick which layout/component to show," that's a **classification** decision, not a generation task. Classification can run on a tiny model — or no model, a decision tree — instead of a full LLM call. (Connects directly to the D5 registry / bounded-vocabulary model.)
- **Memoize AI decisions per context signature.** Same device + app + data-state combination seen before, nothing meaningfully changed → replay the cached UI/action decision instead of re-inferring. UI states repeat far more than people assume; nobody needs fresh reasoning every time they open their calendar.
- **Speculative decoding / draft-then-verify is an energy trick, not just a latency trick.** A small local model drafts; a larger model is invoked only to verify/correct when the draft is uncertain. Most turns never escalate.
- **Push work to compile-time, not runtime.** If an app's manifest is stable, its UI-template mapping can be precompiled once at install/update time (possibly cloud-side with a bigger model) rather than inferred live on every launch. Ahead-of-time compilation vs JIT: spend the energy once, amortize forever.

### Layer 2 — Route by task difficulty, not default-to-biggest-model

- **Tiered model cascade.** A tiny on-device model (hundreds of MB, sub-1W) handles the majority of intent classification and simple queries; only genuinely novel/complex requests escalate to a bigger local model; only genuinely hard ones escalate to cloud. Same principle as the provider-agnostic routing harness, but with **joules-per-request as a first-class routing metric**, not just latency/cost.
- **Task-specific small models beat general models for narrow jobs.** A distilled, fine-tuned few-hundred-million-parameter model for "classify this UI intent" outperforms a general 70B model on that task at a tiny fraction of the energy. Well-established (distillation, quantization, task-specific fine-tunes) — ignored whenever "call the flagship model" is the default.
- **Quantization and sparsity as default, not optimization-later.** 4-bit/8-bit models and structured sparsity cut inference energy substantially with modest quality loss for the narrow tasks that dominate a UI-orchestration workload.

### Layer 3 — Rethink where "AI" is even the right tool

- **Rules/heuristics for anything predictable.** Screen-size breakpoints, contrast adjustment, layout reflow are pure deterministic code (as in responsive design today — and per D8, container queries). Reserve inference for genuinely ambiguous judgment calls, not things with a correct deterministic answer.
- **Event-driven, not polling.** Most of the energy cost of "always-on AI awareness across apps" is *checking* rather than *reacting*. The graph/orchestrator wakes only on actual state-change events (push-based) instead of periodically re-evaluating everything — the same principle mobile OSes use for background-refresh budgets.
- **Batch and defer non-urgent inference.** Anything outside the interactive path (indexing, summarization, embedding generation for the graph) runs during charging/idle windows — the Apple-overnight-processing / Google-Photos-background-indexing pattern. Default to **deferred batch**, not eager real-time, for everything non-interactive.

### Layer 4 — Hardware and system-level angles

- **NPUs over GPUs for inference.** Dedicated neural accelerators (Apple Neural Engine, Qualcomm Hexagon, Tensor TPU cores) do fixed-function matrix math at a fraction of GPU power for the same workload. An OS that mandates **NPU-first scheduling** for model calls, falling back to GPU/CPU only when unavailable, is a real lever most software stacks don't enforce.
- **Analog / in-memory compute** — the speculative-but-real research frontier. Compute-in-memory avoids shuttling weights between memory and compute (the dominant energy cost in current accelerators); potentially an order-of-magnitude jump. **Watch, don't bet on for v1.**
- **Energy-aware scheduling as an OS primitive.** Modern mobile OSes schedule background tasks around battery/thermal state — extend the same scheduler to inference calls, treating "which model tier to invoke" as a dimension **the scheduler negotiates**, not something each app decides independently.

### Layer 5 — Protocol-level efficiency

- **Compress intent, not just data.** If agents/apps exchange structured intents (per idea #1 and spec §10.8), a terse, schema-constrained wire format is vastly cheaper to produce/parse/transmit than natural language round-tripped through a model on both ends. Reserve NL for the **human-facing edges**; use typed protocol messages for machine-to-machine legs. This avoids the wasteful pattern — common in current agent frameworks — of "model generates text, another model parses that text back into structure."
- **Locality-aware compute placement.** Run inference where the data already lives (phone, home hub) instead of round-tripping to cloud — saves network energy *and* the redundant compute of re-serializing context on each hop. This is the direct **energy** argument for local-first, beyond privacy. (Pairs with the idle-compute-mesh parking-lot item: the fleet pools compute, but jobs still run nearest the data.)

### The unifying principle

The biggest efficiency win isn't a better model — it's an architecture that treats **every inference call as something that has to justify its own existence**: cached, tiered, deferred, or replaced with deterministic code, rather than "ask the AI" as the default first move.

Ironically this also makes the system **more predictable and easier to secure** (per D10): fewer live inference calls means a smaller, more auditable attack/hallucination surface. The efficiency goal and the security goal point the same direction — a good sign this is the right design center rather than a tradeoff to fight.

### Hooks into the current architecture

| Principle | Where it already lands |
|-----------|------------------------|
| AI-as-selection, deterministic render | D5 Generation Contract + D8 container queries — the registry *is* the "avoid inference" architecture |
| Declarative-first execution | D9 logic ladder — L1 interpretation costs no inference at all |
| Event-driven awareness | OpenClaw crons + `WorkspaceFocus` events; avoid polling loops in the orchestrator design from day one |
| Tiered routing | The LLM routing layer (planning doc "one LLM config story") should carry an energy/tier policy field, not just provider/cost |
| Compile-time work | Precompile manifest → template mapping at `app_create` / `app_update` time, not per launch |
| Typed machine-to-machine legs | §10.8 action intents — never round-trip NL between system components |
