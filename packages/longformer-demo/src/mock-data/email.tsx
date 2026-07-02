import type { EmailDetailMessage, EmailThread } from "longformer-ui";

export const threads: EmailThread[] = [
  {
    id: "t1",
    senderName: "Priya Nair",
    subject: "Weekly engineering summary is ready",
    preview: "Synthesized this week's PRs, rollouts, and incidents into an update...",
    timestamp: "9:12 AM",
    unread: true,
    starred: true,
  },
  {
    id: "t2",
    senderName: "Marcus Webb",
    subject: "Re: Agent Canvas review",
    preview: "This looks great — left a couple of comments on the diff panel...",
    timestamp: "8:47 AM",
    unread: true,
  },
  {
    id: "t3",
    senderName: "Automation: CI Watchdog",
    subject: "3 flaky tests detected on main",
    preview: "Suggested fixes attached. No action needed if you agree with triage...",
    timestamp: "Yesterday",
  },
  {
    id: "t4",
    senderName: "Dana Cho",
    subject: "Design tokens for the new theme",
    preview: "Sent over the updated palette — mostly refinements to the accent...",
    timestamp: "Yesterday",
  },
  {
    id: "t5",
    senderName: "Recruiting",
    subject: "Your interview loop for Thursday",
    preview: "Here's the finalized schedule and interviewer panel for...",
    timestamp: "Mon",
  },
];

export const threadMessages: Record<string, { subject: string; messages: EmailDetailMessage[] }> = {
  t1: {
    subject: "Weekly engineering summary is ready",
    messages: [
      {
        id: "m1",
        senderName: "Priya Nair",
        timestamp: "9:12 AM",
        body: (
          <div>
            <p>Hi team — this week's summary is ready. Highlights:</p>
            <ul>
              <li>Shipped the Agent Canvas MVP behind a flag</li>
              <li>Closed out 14 PRs, 2 rollbacks (both same root cause)</li>
              <li>No new P0/P1 incidents</li>
            </ul>
          </div>
        ),
      },
    ],
  },
  t2: {
    subject: "Re: Agent Canvas review",
    messages: [
      {
        id: "m1",
        senderName: "Marcus Webb",
        timestamp: "8:47 AM",
        body: <p>This looks great — left a couple of comments on the diff panel. Mostly nits, nothing blocking.</p>,
      },
    ],
  },
};
