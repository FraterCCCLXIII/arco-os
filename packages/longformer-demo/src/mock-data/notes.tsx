import type { DocBlockNode } from "longformer-ui";

export const notesBlocks: DocBlockNode[] = [
  {
    id: "b2",
    type: "paragraph",
    text: "Rename the surface away from abstract \u201cAutomations.\u201d Candidates:",
  },
  {
    id: "b3",
    type: "bulletList",
    items: [
      { id: "i1", text: <><strong>Workflows</strong>: most understandable, broad enough for SDLC and non-SDLC.</> },
      { id: "i2", text: <><strong>Agents on a Schedule</strong>: explicit, but clunky.</> },
      { id: "i3", text: <><strong>Playbooks</strong>: enterprise-friendly, implies repeatable process.</> },
    ],
  },
  { id: "b4", type: "paragraph", text: "The current mental model should become:" },
  {
    id: "b5",
    type: "flowSteps",
    steps: ["When this happens", "Give the agent this context", "Let it do this", "Review / test", "Enable"],
  },
  {
    id: "b6",
    type: "paragraph",
    text: "That is more trustable than \u201cask chat to create an automation.\u201d",
  },
  { id: "b7", type: "heading", level: 2, text: "Breaking It Up" },
  {
    id: "b8",
    type: "bulletList",
    items: [
      {
        id: "i4",
        text: <><strong>Automations</strong> — dashboard of active automations, recent runs, usage, artifacts created.</>,
      },
      {
        id: "i5",
        text: <><strong>Workflows</strong> — event and webhook based automations.</>,
        children: [
          { id: "i5a", text: "Searches code repos for scope of implementation" },
          { id: "i5b", text: "Adds notes to the ticket with the agent findings" },
        ],
      },
      { id: "i6", text: <><strong>Routines</strong> — cron based automations, UI reflects scheduled automations.</> },
    ],
  },
  {
    id: "b9",
    type: "callout",
    icon: "sparkles",
    text: "This mental model — context in, review step, then enable — is the shared spine for every Longformer workspace, not just automations.",
  },
];
