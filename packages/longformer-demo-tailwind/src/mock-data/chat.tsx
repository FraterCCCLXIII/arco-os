import {
  AgentActionBlock,
  AgentFileChip,
  AgentFileCreationBlock,
  AgentStatusLine,
  AgentThoughtBlock,
  AgentTodoCard,
  ChatInlineSurface,
  type ChatMessage,
  type ComposerErrorItem,
  type ComposerFileChangeItem,
  type ComposerQueuedItem,
  type ComposerTaskItem,
  type ComposerTypeaheadItem,
  type PromptChipItem,
  type UsageStats,
} from "longformer-ui-tailwind";
import {
  officeSuiteCompareSchema,
  officeSuiteListSchema,
  pizzaOptionsSchema,
  pizzaOrderFormSchema,
  projectRiskCardsSchema,
  projectRiskPreviewSchema,
} from "./chat-ui-surfaces";

export const demoUsage: UsageStats = {
  contextUsedK: 596.3,
  contextLimitK: 200,
  fiveHourPercent: 0,
  weeklyPercent: 0,
};

const TYPEAHEAD_RESEARCH_BASE = "can you do some hard thinking on the most recent research";

/** Demo query completions for the composer typeahead drawer. */
export const composerTypeaheadItems: ComposerTypeaheadItem[] = [
  { id: "ta-1", text: `${TYPEAHEAD_RESEARCH_BASE} in psychology` },
  { id: "ta-2", text: `${TYPEAHEAD_RESEARCH_BASE} findings` },
  { id: "ta-3", text: `${TYPEAHEAD_RESEARCH_BASE} issue` },
  { id: "ta-4", text: `${TYPEAHEAD_RESEARCH_BASE} article` },
  { id: "ta-5", text: `${TYPEAHEAD_RESEARCH_BASE} question` },
];

/** Agent task progress shown in the drawer docked above the chat composer. */
export const agentTaskDrawerTitle = "Task 4 of 5 in progress";
export const agentTaskItems: ComposerTaskItem[] = [
  { id: "t1", label: "Scaffold project and install dependencies", status: "completed" },
  { id: "t2", label: "Set up design tokens and theme switcher", status: "completed" },
  { id: "t3", label: "Create chat data model and mock transcripts", status: "completed" },
  { id: "t4", label: "Build builder UI (prompt + live preview + code)", status: "active" },
  { id: "t5", label: "Wire up page, layout, fonts and verify in browser", status: "pending" },
];

/** User messages queued while the agent is busy. */
export const queuedMessageDrawerTitle = "2 messages queued";
export const queuedMessageItems: ComposerQueuedItem[] = [
  { id: "q1", label: "Summarize volunteer sign-up sheet" },
  { id: "q2", label: "Draft rain backup venue email" },
];

/** Agent/tool failures surfaced above the composer. */
export const errorMessageDrawerTitle = "1 error needs attention";
export const errorMessageItems: ComposerErrorItem[] = [
  {
    id: "e1",
    label: "Failed to fetch permit status",
    detail: "City permits API returned 503 — retrying in 30s",
  },
];

/** Agent file edits shown in the composer drawer stack. */
export const fileChangeDrawerTitle = "6 Files";
export const fileChangeItems: ComposerFileChangeItem[] = [
  { id: "f1", path: "ComposerDrawerStack.tsx", additions: 38, kind: "tsx" },
  { id: "f2", path: "ComposerDrawerStack.module.css", additions: 6, kind: "css" },
  { id: "f3", path: "ComposerQueuedList.tsx", additions: 31, kind: "tsx" },
  { id: "f4", path: "ComposerQueuedList.module.css", additions: 37, kind: "css" },
  { id: "f5", path: "ComposerErrorList.module.css", additions: 53, kind: "css" },
  { id: "f6", path: "ComposerErrorList.tsx", additions: 35, kind: "tsx" },
];

export const promptChips: PromptChipItem[] = [
  { id: "volunteer-digest", label: "Volunteer digest", icon: "sparkles" },
  { id: "event-report", label: "Event report", icon: "check" },
  { id: "supply-check", label: "Supply check", icon: "terminal" },
  { id: "vendor-audit", label: "Vendor audit", icon: "folder" },
  { id: "schedule-review", label: "Schedule review", icon: "code" },
];

export const assistantPromptChips: PromptChipItem[] = [
  { id: "summarize", label: "Summarize this page", icon: "sparkles" },
  { id: "draft-reply", label: "Draft a reply", icon: "reply" },
  { id: "explain", label: "Explain this", icon: "code" },
  { id: "find-related", label: "Find related notes", icon: "search" },
];

export const chatConversationTabs = [
  { id: "c1", label: "Plan the summer picnic", swatch: "var(--lf-accent)", closable: true },
  { id: "c2", label: "Research an office app", icon: "sparkles" as const, closable: true },
  { id: "c3", label: "Order me a pizza", icon: "sparkles" as const, closable: true },
];

export const assistantConversationTabs = [
  { id: "slack-workspace", label: "Groups workspace", swatch: "var(--lf-accent)", closable: true },
  { id: "settings-page", label: "Large settings page", icon: "sparkles" as const, closable: true },
  { id: "more-widgets", label: "More widgets", icon: "sparkles" as const, closable: true },
];

export const assistantConversationNavItems = [
  { id: "agent", label: "Agent" },
  { id: "ask", label: "Ask" },
];

export const chatConversationNavItems = assistantConversationNavItems;

/** Event planning thread — user asks for interactive risk cards mid-conversation. */
export const reviewProjectConversation: ChatMessage[] = [
  {
    id: "c1-m1",
    role: "user",
    content: "Can you help plan the Meridian summer picnic and flag anything we might forget?",
    timestamp: "9:41 AM",
  },
  {
    id: "c1-m2",
    role: "agent",
    thinking: {
      label: "Thinking",
      steps: [
        { id: "s1", text: "Review venue details, catering notes, and volunteer sign-ups" },
        { id: "s2", text: "Check permit deadlines and weather backup options" },
        { id: "s3", text: "Compare headcount against supply and staffing plans" },
      ],
    },
    content: (
      <>
        <p>
          Here&rsquo;s a quick pass on the picnic plan: pavilion rental is confirmed, catering is booked for 120
          guests, but there&rsquo;s no rain backup location and the permit paperwork is still pending.
        </p>
        <ChatInlineSurface label="Risk preview" schema={projectRiskPreviewSchema} />
        <p>Want me to expand this into an interactive checklist with suggested fixes?</p>
      </>
    ),
    timestamp: "9:41 AM",
  },
  {
    id: "c1-m3",
    role: "user",
    content: "Yes — show me the risks and suggested fixes as interactive cards I can work through.",
    timestamp: "9:42 AM",
  },
  {
    id: "c1-m4",
    role: "agent",
    thinking: {
      label: "Generating UI",
      steps: [
        { id: "s1", text: "Build risk register from event details" },
        { id: "s2", text: "Attach pre-event checklist and vendor follow-ups" },
      ],
    },
    content: (
      <>
        <p>
          Built an interactive module from the plan — risk cards, a pre-event checklist, and vendor follow-ups you
          can track.
        </p>
        <ChatInlineSurface label="Event planning module" schema={projectRiskCardsSchema} />
        <p>Want me to draft reminder emails for volunteers with open shifts?</p>
      </>
    ),
    timestamp: "9:42 AM",
  },
];

/** Office suite research — agent proactively shows listings, user requests comparison UI. */
export const officeAppConversation: ChatMessage[] = [
  {
    id: "c2-m1",
    role: "user",
    content: "Research an office suite with docs, sheets, and a shared calendar for a 12-person team.",
    timestamp: "10:05 AM",
  },
  {
    id: "c2-m2",
    role: "agent",
    content: (
      <>
        <AgentThoughtBlock duration="brief">
          <p>
            There&rsquo;s a <code>longformer-www</code> package which is likely &ldquo;our website&rdquo;. Let me
            explore it.
          </p>
        </AgentThoughtBlock>
        <AgentActionBlock
          title="List www package structure"
          command="ls, head"
          output={[
            "site-content.ts",
            "packages/longformer-www/src/styles:",
            "  global.css",
            "  shared.module.css",
          ]}
        />
        <AgentStatusLine>Explored 24 files</AgentStatusLine>
        <AgentTodoCard
          items={[
            {
              id: "todo-1",
              status: "active",
              label:
                "Create spec-content.ts with condensed spec data (decisions, tiers, roadmap, scorecard, product, appendix)",
            },
            {
              id: "todo-2",
              status: "pending",
              label:
                "Build spec page sections (hero, foundation, decisions, architecture, roadmap, product, appendix) with CSS modules",
            },
            {
              id: "todo-3",
              status: "pending",
              label: "Add spec.html entry, spec-main.tsx, vite multi-page config, header link from main site",
            },
            {
              id: "todo-4",
              status: "pending",
              label: "Typecheck, run dev server, visually verify with screenshots",
            },
          ]}
        />
        <AgentThoughtBlock duration={67} defaultOpen={false}>
          <p>Mapped spec sections to page components and identified shared token dependencies.</p>
        </AgentThoughtBlock>
        <p>
          Now three example manifests, deliberately varied — including one you can improvise a fourth from live.
        </p>
        <AgentFileCreationBlock
          files={[
            {
              id: "manifest-tasklist",
              label: "Example manifest: task list app",
              filename: "tasklist.json",
              path: "manifests/tasklist.json",
            },
            {
              id: "manifest-contact",
              label: "Example manifest: contact card app",
              filename: "contact.json",
              path: "manifests/contact.json",
            },
            {
              id: "manifest-habit",
              label: "Example manifest: daily habit tracker",
              filename: "habit.json",
              path: "manifests/habit.json",
            },
          ]}
        />
        <AgentFileChip path="packages/longformer-www/src/content/spec-content.ts" kind="ts" />
        <p>
          I narrowed it to three strong fits for a 12-person team. Here&rsquo;s a shortlist with pricing and feature
          tags — Lark Suite leads on flexible docs, Harbor Office on spreadsheets, Summit 365 on shared calendars.
        </p>
        <ChatInlineSurface label="Office suite shortlist" schema={officeSuiteListSchema} />
      </>
    ),
    timestamp: "10:05 AM",
  },
  {
    id: "c2-m3",
    role: "user",
    content: "Put the top options side by side so I can compare features and pick one.",
    timestamp: "10:06 AM",
  },
  {
    id: "c2-m4",
    role: "agent",
    thinking: {
      label: "Generating UI",
      steps: [
        { id: "s1", text: "Build feature-fit scorecards for top three suites" },
        { id: "s2", text: "Add selection tiles and rollout timeline" },
      ],
    },
    content: (
      <>
        <p>Side-by-side comparison on the dimensions you asked for, plus a rollout timeline if you pick Lark Suite.</p>
        <ChatInlineSurface label="Comparison module" schema={officeSuiteCompareSchema} />
      </>
    ),
    timestamp: "10:06 AM",
  },
];

/** Pizza order — agent shows nearby picks, user asks for ETAs and customization form. */
export const pizzaOrderConversation: ChatMessage[] = [
  {
    id: "c3-m1",
    role: "user",
    content: "Order me a pizza for tonight — something close by with good reviews.",
    timestamp: "6:18 PM",
  },
  {
    id: "c3-m2",
    role: "agent",
    thinking: {
      label: "Thinking",
      steps: [
        { id: "s1", text: "Search delivery radius and filter by rating ≥ 4.5" },
        { id: "s2", text: "Rank by ETA and menu match" },
      ],
    },
    content: (
      <>
        <p>Found three highly-rated spots within 2 miles with delivery under 35 minutes. Tony&rsquo;s is the top pick.</p>
        <ChatInlineSurface label="Nearby restaurants" schema={pizzaOptionsSchema} />
      </>
    ),
    timestamp: "6:18 PM",
  },
  {
    id: "c3-m3",
    role: "user",
    content: "Show delivery ETAs and let me customize the order before you place it.",
    timestamp: "6:19 PM",
  },
  {
    id: "c3-m4",
    role: "agent",
    thinking: {
      label: "Generating UI",
      steps: [
        { id: "s1", text: "Fetch delivery windows for top two restaurants" },
        { id: "s2", text: "Pre-fill order form from past preferences" },
      ],
    },
    content: (
      <>
        <p>
          Delivery windows for Tony&rsquo;s and Slice House, plus a customization form with your usual order pre-filled.
          Confirm and I&rsquo;ll place it.
        </p>
        <ChatInlineSurface label="Order builder" schema={pizzaOrderFormSchema} />
      </>
    ),
    timestamp: "6:19 PM",
  },
];

/** @deprecated Use reviewProjectConversation — kept as alias for existing imports. */
export const activeConversation = reviewProjectConversation;

export const chatTabConversations: Record<string, ChatMessage[]> = {
  c1: reviewProjectConversation,
  c2: officeAppConversation,
  c3: pizzaOrderConversation,
};
