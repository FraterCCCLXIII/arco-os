import type { DocBlockNode } from "longformer-ui-tailwind";

export const notesBlocks: DocBlockNode[] = [
  {
    id: "b2",
    type: "paragraph",
    text: "Open questions for the summer picnic:",
  },
  {
    id: "b3",
    type: "bulletList",
    items: [
      { id: "i1", text: <><strong>Rain backup</strong>: community center vs. school gym.</> },
      { id: "i2", text: <><strong>Food stations</strong>: one line or two parallel lines.</> },
      { id: "i3", text: <><strong>Kids area</strong>: face painting or craft table.</> },
    ],
  },
  { id: "b4", type: "paragraph", text: "Still to confirm:" },
  {
    id: "b5",
    type: "flowSteps",
    steps: ["RSVP headcount", "Assign volunteer shifts", "Send reminders", "Open the gates"],
  },
  {
    id: "b6",
    type: "paragraph",
    text: "Keep the checklist simple so volunteers can follow it on the day of the event.",
  },
  { id: "b7", type: "heading", level: 2, text: "Shift Coverage" },
  {
    id: "b8",
    type: "bulletList",
    items: [
      {
        id: "i4",
        text: <><strong>Welcome table</strong> — check-in, maps, and allergy notes.</>,
      },
      {
        id: "i5",
        text: <><strong>Food stations</strong> — two volunteers per station during lunch.</>,
        children: [
          { id: "i5a", text: "Confirm serving utensils and labels" },
          { id: "i5b", text: "Note vegetarian and nut-free options" },
        ],
      },
      { id: "i6", text: <><strong>Cleanup crew</strong> — teardown starts at 2:30 PM.</> },
    ],
  },
  {
    id: "b9",
    type: "callout",
    icon: "sparkles",
    text: "Simple checklist: confirm headcount, assign shifts, send reminders — then open the gates.",
  },
];
