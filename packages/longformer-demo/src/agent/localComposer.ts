/**
 * Local surface composer — a deterministic, offline stand-in for the agent.
 *
 * When no LLM is configured the demo still needs "type a prompt, get UI" to
 * work, so this module pattern-matches the prompt against a handful of
 * intents and assembles a plausible block payload for each. It deliberately
 * returns untyped JSON (`unknown`), not `GeneratedBlock[]`: the output flows
 * through the same `parseGeneratedSurface` validation boundary as real agent
 * output, so the prototype exercises the production path end to end.
 *
 * When a research `EvidencePack` is supplied, exploratory prompts compose
 * from the evidence instead of canned data — real photos and real links,
 * even with no LLM connected.
 */
import type { EvidencePack } from "./research";

// ---------------------------------------------------------------------------
// Intent matching
//
// First keyword hit wins, top to bottom; the last entry is a catch-all
// dashboard so every prompt produces something visual.
// ---------------------------------------------------------------------------

interface Intent {
  id: string;
  keywords: RegExp;
  /** Builds the surface's blocks; `topic` is the cleaned-up prompt text. */
  compose: (topic: string) => unknown[];
  summary: (topic: string) => string;
}

/** Title-case the first letter for display inside generated block titles. */
function display(topic: string): string {
  const trimmed = topic.trim().replace(/[.?!]+$/, "");
  if (!trimmed) return "Your request";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Small talk gets a conversational reply with no generated surface (and no
 * research round-trip) — building a dashboard for "hi" reads as ignoring
 * the user. Exported so the orchestrator can skip the research step too.
 */
const SMALL_TALK =
  /^\s*(hi|hey|hello|yo|sup|howdy|good (morning|afternoon|evening)|who are you\??|what (are|can) you( do)?\??|help)\s*[.?!]*\s*$/i;

export function isSmallTalk(prompt: string): boolean {
  return SMALL_TALK.test(prompt);
}

const INTENTS: Intent[] = [
  {
    id: "chat",
    keywords: SMALL_TALK,
    summary: () =>
      "Hi! I'm Longformer — describe something you want to build or organize and I'll generate an interface for it. Try \"plan a weekend trip to Lisbon\" or \"track my monthly budget\".",
    compose: () => [],
  },
  {
    id: "tasks",
    keywords: /\b(task|todo|to-do|checklist|chores?|errands?)\b/i,
    summary: () => "Here's a task checklist to track that — check items off as you go.",
    compose: (topic) => [
      {
        id: "lc-tasks",
        type: "taskChecklistCards",
        cards: [
          {
            id: "tc1",
            title: display(topic),
            items: [
              { label: "Break the work into concrete steps", completed: true },
              { label: "Schedule the first block of focus time", completed: false },
              { label: "Line up anything you need from others", completed: false },
              { label: "Review progress at the end of the day", completed: false },
            ],
            progress: 25,
            progressLabel: "1 of 4",
            actionLabel: "Add task",
          },
        ],
      },
      {
        id: "lc-tasks-steps",
        type: "timelineSteps",
        title: "Suggested order",
        steps: [
          { id: "s1", label: "Plan", completed: true, showConnector: true },
          { id: "s2", label: "Execute", showConnector: true },
          { id: "s3", label: "Review", showConnector: false },
        ],
      },
    ],
  },
  {
    id: "schedule",
    keywords: /\b(schedule|calendar|meeting|appointment|agenda|plan (my|the) (day|week))\b/i,
    summary: () => "I sketched a schedule view with the key sessions blocked in.",
    compose: (topic) => [
      {
        id: "lc-schedule-events",
        type: "eventCards",
        title: display(topic),
        cards: [
          {
            id: "ev1",
            label: "Morning",
            title: "Deep work block",
            startTime: "9:00 AM",
            endTime: "11:00 AM",
            timeLeft: { icon: "clock", label: "Starts in 20 min" },
          },
          {
            id: "ev2",
            label: "Afternoon",
            title: "Review & sync",
            startTime: "2:00 PM",
            endTime: "2:45 PM",
          },
        ],
      },
      {
        id: "lc-schedule-slots",
        type: "scheduleSlots",
        title: "Open slots",
        slots: [
          { id: "sl1", name: "Focus time", mode: "Solo", timeRange: "11:15 AM – 12:30 PM", tone: "accent" },
          { id: "sl2", name: "Office hours", mode: "Drop-in", timeRange: "4:00 PM – 5:00 PM", tone: "success" },
        ],
      },
    ],
  },
  {
    id: "budget",
    keywords: /\b(budget|expens\w*|spend\w*|cost|money|financ\w*)\b/i,
    summary: () => "Here's a spending snapshot with the biggest categories called out.",
    compose: (topic) => [
      {
        id: "lc-budget-stats",
        type: "statCards",
        title: display(topic),
        cards: [
          { id: "b1", label: "This month", value: "$1,842", caption: "of $2,400 budget", icon: "wallet", tone: "accent", visualization: { type: "ring", percent: 77 } },
          { id: "b2", label: "Largest category", value: "Dining", caption: "$486 so far", icon: "shopping-cart", tone: "warning" },
          { id: "b3", label: "vs last month", value: "-8%", caption: "Trending down", icon: "dollar-sign", tone: "success" },
        ],
      },
      {
        id: "lc-budget-insights",
        type: "insightCards",
        cards: [
          {
            id: "bi1",
            label: "Suggestion",
            title: "Dining is pacing 22% over budget",
            description: "Shifting two meals a week to groceries keeps the month on track.",
          },
        ],
      },
    ],
  },
  {
    id: "trip",
    keywords: /\b(trip|travel|vacation|flight|itinerar\w*|visit\w*|weekend in)\b/i,
    summary: () => "I put together a first-pass itinerary with stays worth a look.",
    compose: (topic) => [
      {
        id: "lc-trip-media",
        type: "mediaCards",
        title: display(topic),
        cards: [
          {
            id: "tm1",
            tone: "accent",
            title: "Boutique stay, old town",
            description: "Walkable to the main sights, rooftop breakfast included.",
            badges: [{ icon: "star", label: "4.8" }],
            actionLabel: "View stay",
          },
          {
            id: "tm2",
            tone: "success",
            title: "Guesthouse by the water",
            description: "Quiet neighborhood, easy transit into the center.",
            badges: [{ icon: "star", label: "4.6" }],
            actionLabel: "View stay",
          },
        ],
      },
      {
        id: "lc-trip-steps",
        type: "timelineSteps",
        title: "Itinerary skeleton",
        steps: [
          { id: "d1", label: "Day 1 — arrive, old town walk", completed: false, showConnector: true },
          { id: "d2", label: "Day 2 — museums & markets", completed: false, showConnector: true },
          { id: "d3", label: "Day 3 — day trip, pack & depart", completed: false, showConnector: false },
        ],
      },
    ],
  },
  {
    id: "form",
    keywords: /\b(form|sign[- ]?up|register|survey|intake|rsvp)\b/i,
    summary: () => "Here's a draft of the form fields — tell me what to add or drop.",
    compose: (topic) => [
      {
        id: "lc-form",
        type: "form",
        title: display(topic),
        fields: [
          { id: "f1", label: "Full name", value: "" },
          { id: "f2", label: "Email", value: "" },
          { id: "f3", label: "How did you hear about us?", value: "" },
        ],
      },
      {
        id: "lc-form-tiles",
        type: "selectionTiles",
        title: "Optional fields",
        tiles: [
          { id: "t1", label: "Phone", size: "sm" },
          { id: "t2", label: "Company", size: "sm", selected: true },
          { id: "t3", label: "Dietary needs", size: "sm" },
        ],
      },
    ],
  },
  {
    id: "dashboard",
    keywords: /./,
    summary: () => "I generated a quick dashboard for that — want me to go deeper on any tile?",
    compose: (topic) => [
      {
        id: "lc-dash-heading",
        type: "text",
        text: display(topic),
        tone: "heading",
      },
      {
        id: "lc-dash-stats",
        type: "statCards",
        cards: [
          { id: "d1", label: "Status", value: "On track", caption: "Updated just now", icon: "check", tone: "success" },
          { id: "d2", label: "Progress", value: "64%", icon: "target", tone: "accent", visualization: { type: "ring", percent: 64 } },
          { id: "d3", label: "This week", value: "12", caption: "items moved", icon: "zap", tone: "neutral" },
        ],
      },
      {
        id: "lc-dash-insights",
        type: "insightCards",
        cards: [
          {
            id: "di1",
            label: "Next step",
            title: "Pick one focus for tomorrow",
            description: "Momentum compounds — a single named priority beats a long list.",
          },
        ],
      },
    ],
  },
];

export interface LocalComposition {
  /** Untyped surface JSON, ready for `parseGeneratedSurface`. */
  surfaceJson: unknown;
  /** Conversational reply text that accompanies the surface. */
  summary: string;
}

/** Trim a snippet to card length without cutting mid-word. */
function cardText(text: string | undefined, max = 140): string | undefined {
  if (!text) return undefined;
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * Compose a surface directly from research evidence: photo cards for the
 * sources that have images, link callouts for the rest. Every URL and image
 * comes from the pack — nothing is invented.
 */
function composeFromEvidence(prompt: string, evidence: EvidencePack): LocalComposition {
  const withImage = evidence.sources.filter((source) => source.image).slice(0, 3);
  const linkOnly = evidence.sources.filter((source) => !withImage.includes(source)).slice(0, 3);

  const blocks: unknown[] = [
    { id: "re-heading", type: "text", text: display(prompt), tone: "heading" },
  ];
  if (withImage.length > 0) {
    blocks.push({
      id: "re-media",
      type: "mediaCards",
      cards: withImage.map((source, index) => ({
        id: `rm${index}`,
        title: source.title,
        description: cardText(source.description ?? source.snippet),
        image: source.image,
        imageAlt: source.title,
        badges: [{ icon: "search", label: "Researched" }],
        actionLabel: "Read more",
        href: source.url,
      })),
    });
  }
  if (linkOnly.length > 0) {
    blocks.push({
      id: "re-sources",
      type: "insightCards",
      title: "Sources",
      cards: linkOnly.map((source, index) => ({
        id: `rs${index}`,
        label: "Source",
        title: source.title,
        description: cardText(source.snippet ?? source.description, 120),
        href: source.url,
      })),
    });
  }
  return {
    surfaceJson: { id: `research-${Date.now()}`, blocks },
    summary: `I researched "${evidence.query}" and pulled together ${evidence.sources.length} real sources — the cards link out to each one.`,
  };
}

/** Intents whose canned data is worse than real research when we have it. */
const EVIDENCE_PREFERRED = new Set(["dashboard", "trip"]);

/**
 * Compose a surface for a prompt using the first matching intent. When
 * evidence is available and the matched intent is exploratory (the generic
 * dashboard or the canned trip planner), compose from evidence instead.
 */
export function composeLocalSurface(prompt: string, evidence?: EvidencePack | null): LocalComposition {
  const intent = INTENTS.find((candidate) => candidate.keywords.test(prompt)) ?? INTENTS[INTENTS.length - 1];
  if (evidence && evidence.sources.length > 0 && EVIDENCE_PREFERRED.has(intent.id)) {
    return composeFromEvidence(prompt, evidence);
  }
  return {
    surfaceJson: {
      id: `local-${intent.id}-${Date.now()}`,
      blocks: intent.compose(prompt),
    },
    summary: intent.summary(prompt),
  };
}
