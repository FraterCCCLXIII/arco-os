import type { ChatMessage, PromptChipItem, UsageStats } from "longformer-ui";

export const demoUsage: UsageStats = {
  contextUsedK: 596.3,
  contextLimitK: 200,
  fiveHourPercent: 0,
  weeklyPercent: 0,
};

export const promptChips: PromptChipItem[] = [
  { id: "standup", label: "Standup digest", icon: "sparkles" },
  { id: "ship-report", label: "Ship report", icon: "check" },
  { id: "ci-watchdog", label: "CI watchdog", icon: "terminal" },
  { id: "dep-audit", label: "Dependency audit", icon: "folder" },
  { id: "pr-review", label: "PR review digest", icon: "code" },
];

export const assistantPromptChips: PromptChipItem[] = [
  { id: "summarize", label: "Summarize this page", icon: "sparkles" },
  { id: "draft-reply", label: "Draft a reply", icon: "reply" },
  { id: "explain", label: "Explain this", icon: "code" },
  { id: "find-related", label: "Find related notes", icon: "search" },
];

export const assistantConversationTabs = [
  { id: "slack-workspace", label: "Groups workspace", swatch: "var(--lf-accent)", closable: true },
  { id: "settings-page", label: "Large settings page", icon: "sparkles" as const, closable: true },
  { id: "more-widgets", label: "More widgets", icon: "sparkles" as const, closable: true },
];

export const activeConversation: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "Can you review the project and flag anything risky before we ship?",
    timestamp: "9:41 AM",
  },
  {
    id: "m2",
    role: "agent",
    thinking: {
      label: "Thinking",
      steps: [
        { id: "s1", text: "Scan repo structure, docs, and key source areas" },
        { id: "s2", text: "Read the README and spot-check app/package entry points" },
        { id: "s3", text: "Check for uncommitted changes and test coverage" },
      ],
    },
    content: (
      <div>
        <p>Here&rsquo;s a quick pass on the repo:</p>
        <ul>
          <li>Clear layering — core is headless, UI is presentation-only.</li>
          <li>Tests pass for core (10/10 via vitest).</li>
          <li>WebSocket gateway trusts message shape with no runtime validation.</li>
        </ul>
        <p>Want me to open a PR for the validation gap?</p>
      </div>
    ),
    timestamp: "9:41 AM",
  },
];
