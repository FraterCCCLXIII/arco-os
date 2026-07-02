export const siteMeta = {
  name: "Longformer",
  tagline: "A presentation OS for integrated AI work",
  description:
    "One shell for chat, code, files, and generated apps. Plug in OpenClaw, OpenHands, and OpenUI — agents share focus context across every workspace.",
} as const;

export const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Architecture", href: "#architecture" },
  { label: "Principles", href: "#principles" },
  { label: "FAQ", href: "#faq" },
] as const;

export const integrations = [
  "OpenClaw Gateway",
  "OpenHands agent-canvas",
  "OpenUI Lang",
  "Odysseus",
] as const;

export const features = [
  {
    title: "Stable shell",
    description:
      "Nav rail, sidebar, main, and context panel — switch workspaces without reshuffling chrome.",
    href: "#platform",
    linkLabel: "Explore the shell",
  },
  {
    title: "Agent surface",
    description:
      "Chat, Orchestrator, Psyche, and inline generated UI — the brain stays in the context panel.",
    href: "#platform",
    linkLabel: "See agent UX",
  },
  {
    title: "Code workspace",
    description:
      "OpenHands agent-canvas embedded for terminals, diffs, and repo work — not a separate product tab.",
    href: "#architecture",
    linkLabel: "View architecture",
  },
  {
    title: "Generated apps",
    description:
      "Describe an app in chat; OpenUI renders it inside Desktop windows and the Apps grid.",
    href: "#architecture",
    linkLabel: "How gen-UI works",
  },
] as const;

export const principles = [
  {
    id: "I",
    title: "Shell stability",
    body: "Chrome is invariant. Workspaces plug into sidebar and main slots without remounting the frame.",
  },
  {
    id: "II",
    title: "Engine boundaries",
    body: "OpenClaw owns agent orchestration. OpenHands owns the coding sandbox. OpenUI owns streamed UI. Longformer composes — it does not fork.",
  },
  {
    id: "III",
    title: "Shared focus context",
    body: "The assistant knows which workspace and entity you are viewing. AI actions attach to real focus, not orphaned prompts.",
  },
  {
    id: "IV",
    title: "Generated UI is first-class",
    body: "Agents emit OpenUI blocks in chat and ship full apps to Desktop. Rendering is not a bolt-on widget.",
  },
  {
    id: "V",
    title: "Multi-form-factor surfaces",
    body: "The same workspace renders full-screen, as a desktop window, on phone stack, or as a watch glance via SurfaceManager.",
  },
  {
    id: "VI",
    title: "Surgical integration",
    body: "One product experience without merging every repo into a monolith. Plug engines in per workspace.",
  },
] as const;

export const faqItems = [
  {
    question: "Is Longformer a product or a prototype?",
    answer:
      "UI Experiments is the design prototype. The production path is a Longformer client served from the OpenClaw plugin with real gateway-backed stores.",
  },
  {
    question: "Do I need every backend running?",
    answer:
      "MVP: OpenClaw gateway plus OpenUI. Add OpenHands for the Code workspace. Odysseus is optional for productivity and RAG services.",
  },
  {
    question: "How is this different from agent-canvas alone?",
    answer:
      "agent-canvas is the coding engine. Longformer is the full OS shell — chat, desktop, apps, memory, and ~34 reference workspaces around it.",
  },
  {
    question: "Is this another AI chat sidebar?",
    answer:
      "No. Longformer is the presentation layer where agents, entity data, and generated UI share one session and focus model.",
  },
] as const;

export const architectureLayers = [
  { label: "Viewers", detail: "Browser, desktop, phone, watch" },
  { label: "Longformer shell", detail: "AppShell · SurfaceManager · tokens" },
  { label: "Engines", detail: "OpenClaw · OpenHands · OpenUI · Odysseus" },
  { label: "Workspaces", detail: "Chat, Code, Apps, Notes, Orchestrator, …" },
] as const;
