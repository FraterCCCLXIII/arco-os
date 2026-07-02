import type { NotePage } from "longformer-ui";
import { WikiLink } from "longformer-ui";

function link(noteId: string, label: string, onNavigate: (id: string) => void) {
  return <WikiLink label={label} onClick={() => onNavigate(noteId)} />;
}

/** Build wikilink helpers bound to a navigation handler. */
export function createNoteLinks(onNavigate: (id: string) => void) {
  return {
    to: (noteId: string, label: string) => link(noteId, label, onNavigate),
  };
}

/** Obsidian-inspired digital garden vault with interconnected notes. */
export function buildNotesVault(onNavigate: (id: string) => void): NotePage[] {
  const { to } = createNoteLinks(onNavigate);

  return [
    {
      id: "writing-telepathy",
      title: "Writing is telepathy",
      tags: ["evergreen"],
      folder: "ideas",
      links: ["on-writing", "evergreen-notes", "books"],
      blocks: [
        {
          id: "wt-p1",
          type: "paragraph",
          text: (
            <>
              From {to("on-writing", "On Writing")} — ideas can travel through time and space when we write.
            </>
          ),
        },
        { id: "wt-h1", type: "heading", level: 2, text: "Ideas can travel through time and space" },
        {
          id: "wt-p2",
          type: "paragraph",
          text: "All the hours we spend in the sending place and the receiving place are compressed into a single moment. See also Evergreen notes for how to cultivate these durable ideas.",
        },
        {
          id: "wt-list",
          type: "bulletList",
          items: [
            { id: "wt-i1", text: "Writing collapses distance between author and reader." },
            { id: "wt-i2", text: "Links like this one turn notes into a web: Evergreen notes." },
            { id: "wt-i3", text: "Reading lists anchor the practice — see Books." },
          ],
        },
        { id: "wt-h2", type: "heading", level: 2, text: "Quote" },
        {
          id: "wt-callout",
          type: "callout",
          icon: "quote",
          text: "Telepathy, of course. It's amusing when you stop to think about it — but still, pretty neat. Miscommunication only begins when the reader and writer fail to share enough context.",
        },
      ],
    },
    {
      id: "evergreen-notes",
      title: "Evergreen notes",
      tags: ["evergreen", "meta"],
      folder: "references",
      links: ["writing-telepathy", "on-writing", "books"],
      blocks: [
        {
          id: "en-p1",
          type: "paragraph",
          text: "Evergreen notes are written and refined over time. They should be densely linked — start from Writing is telepathy as an example.",
        },
        { id: "en-h1", type: "heading", level: 2, text: "Properties" },
        {
          id: "en-list",
          type: "bulletList",
          items: [
            { id: "en-i1", text: "Atomic — one idea per note." },
            { id: "en-i2", text: "Concept-oriented — titles name ideas, not meetings." },
            { id: "en-i3", text: "Densely linked — wikilinks to related notes like On Writing and Books." },
          ],
        },
      ],
    },
    {
      id: "on-writing",
      title: "On Writing",
      folder: "references",
      links: ["writing-telepathy", "books"],
      blocks: [
        {
          id: "ow-p1",
          type: "paragraph",
          text: "Stephen King's memoir on the craft. The telepathy passage inspired Writing is telepathy.",
        },
        {
          id: "ow-p2",
          type: "paragraph",
          text: "Pair with Books for a fuller reading list of craft titles.",
        },
      ],
    },
    {
      id: "books",
      title: "Books",
      folder: "references",
      links: ["on-writing", "evergreen-notes", "travel"],
      blocks: [
        { id: "bk-h1", type: "heading", level: 2, text: "Currently reading" },
        {
          id: "bk-list",
          type: "bulletList",
          items: [
            { id: "bk-i1", text: "On Writing — Stephen King" },
            { id: "bk-i2", text: "How to Take Smart Notes — Sönke Ahrens" },
            { id: "bk-i3", text: "A travelogue picked up from Travel" },
          ],
        },
      ],
    },
    {
      id: "travel",
      title: "Travel",
      folder: "references",
      links: ["books", "daily-journal"],
      blocks: [
        {
          id: "tr-p1",
          type: "paragraph",
          text: "Places worth revisiting. Notes from trips often seed new evergreen ideas back in Ideas.",
        },
      ],
    },
    {
      id: "daily-journal",
      title: "Daily · 2026-06-26",
      folder: "daily",
      links: ["writing-telepathy", "weekly-demos"],
      blocks: [
        {
          id: "dj-p1",
          type: "paragraph",
          text: "Refined the telepathy note and prepped materials for the Community Forum.",
        },
      ],
    },
    {
      id: "weekly-demos",
      title: "06-26-2026 Community Forum",
      folder: "projects",
      links: ["agent-canvas", "company-handbook"],
      blocks: [
        { id: "wd-h1", type: "heading", level: 2, text: "Agenda" },
        {
          id: "wd-list",
          type: "bulletList",
          items: [
            { id: "wd-i1", text: "Neighborhood welcome session" },
            { id: "wd-i2", text: "Vendor layout walkthrough" },
            { id: "wd-i3", text: "Link to Company Handbook for volunteer onboarding" },
          ],
        },
      ],
    },
    {
      id: "agent-canvas",
      title: "Vendor Layout Study",
      folder: "projects",
      links: ["weekly-demos", "scratchpad"],
      blocks: [
        {
          id: "ac-p1",
          type: "paragraph",
          text: "Compare booth and signage layouts for the summer picnic. Scratchpad has rough sketches.",
        },
      ],
    },
    {
      id: "getting-started",
      title: "Getting Started",
      folder: "meta",
      links: ["evergreen-notes", "company-handbook"],
      blocks: [
        {
          id: "gs-p1",
          type: "paragraph",
          text: "Welcome to the vault. Start with Evergreen notes, then browse the graph to see how ideas connect.",
        },
      ],
    },
    {
      id: "one-on-one",
      title: "1:1 notes",
      folder: "meta",
      links: ["weekly-demos"],
      blocks: [
        {
          id: "oo-p1",
          type: "paragraph",
          text: "Standing topics for coordinator sync. Event prep tracked in Community Forum notes.",
        },
      ],
    },
    {
      id: "scratchpad",
      title: "Scratchpad",
      folder: "ideas",
      links: ["agent-canvas"],
      blocks: [
        {
          id: "sc-p1",
          type: "paragraph",
          text: "Unstructured capture. Promote durable ideas into evergreen notes when ready.",
        },
      ],
    },
    {
      id: "company-handbook",
      title: "Company Handbook",
      folder: "projects",
      links: ["getting-started", "agent-team-wiki"],
      blocks: [
        {
          id: "ch-p1",
          type: "paragraph",
          text: "Policies and culture doc. Onboarding path starts at Getting Started; engineering details live in Agent Team Wiki.",
        },
      ],
    },
    {
      id: "agent-team-wiki",
      title: "Volunteer Team Wiki",
      folder: "projects",
      links: ["company-handbook", "agent-canvas"],
      blocks: [
        {
          id: "at-p1",
          type: "paragraph",
          text: "Shared notes for event volunteers. See Vendor Layout Study for booth planning.",
        },
      ],
    },
    {
      id: "user-feedback",
      title: "Picnic Planning Notes",
      folder: "projects",
      links: ["weekly-demos", "agent-canvas"],
      blocks: [
        {
          id: "uf-p1",
          type: "paragraph",
          text: "Open questions for the summer picnic:",
        },
        {
          id: "uf-list",
          type: "bulletList",
          items: [
            { id: "uf-i1", text: "Rain backup location — community center vs. school gym." },
            { id: "uf-i2", text: "Food stations — one line or two parallel lines." },
            { id: "uf-i3", text: "Kids area — face painting or craft table." },
          ],
        },
        { id: "uf-h1", type: "heading", level: 2, text: "Still To Confirm" },
        {
          id: "uf-list2",
          type: "bulletList",
          items: [
            { id: "uf-i4", text: "Final headcount from RSVP form." },
            { id: "uf-i5", text: "Parking volunteer shift coverage." },
            { id: "uf-i6", text: "Permit approval from parks department." },
          ],
        },
        {
          id: "uf-callout",
          type: "callout",
          icon: "sparkles",
          text: "Simple checklist: confirm headcount, assign shifts, send reminders — then open the gates.",
        },
      ],
    },
  ];
}

/** Map sidebar page IDs to vault note IDs. */
export const sidebarToNoteId: Record<string, string> = {
  p1: "user-feedback",
  p2: "weekly-demos",
  p3: "agent-canvas",
  p4: "getting-started",
  p5: "one-on-one",
  p6: "scratchpad",
  p7: "company-handbook",
  p8: "agent-team-wiki",
};

export const defaultNoteId = "writing-telepathy";

/** Sidebar lists derived from the vault for the demo app. */
export const vaultRecentPages = [
  { id: "writing-telepathy", label: "Writing is telepathy", meta: "now" },
  { id: "p1", label: "Picnic Planning Notes", meta: "2h" },
  { id: "p2", label: "06-26-2026 Community Forum", meta: "1d" },
];

export const vaultPrivatePages = [
  { id: "p4", label: "Getting Started" },
  { id: "p5", label: "1:1 notes" },
  { id: "p6", label: "Scratchpad" },
];

export const vaultTeamspacePages = [
  { id: "p7", label: "Company Handbook" },
  { id: "p8", label: "Volunteer Team Wiki" },
];

export function resolveNoteId(pageId: string): string {
  return sidebarToNoteId[pageId] ?? pageId;
}
