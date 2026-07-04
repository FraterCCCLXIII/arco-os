import type { EmailDetailMessage, EmailThread } from "longformer-ui-tailwind";

export const threads: EmailThread[] = [
  {
    id: "t1",
    senderName: "Sam Patel",
    subject: "Summer picnic volunteer schedule",
    preview: "Thanks to everyone who signed up — here's the final shift list for Saturday...",
    timestamp: "9:12 AM",
    unread: true,
    starred: true,
  },
  {
    id: "t2",
    senderName: "Jordan Hayes",
    subject: "Re: Event poster draft",
    preview: "The layout looks great — I left a couple of notes on the welcome banner copy...",
    timestamp: "8:47 AM",
    unread: true,
  },
  {
    id: "t3",
    senderName: "Facilities Desk",
    subject: "Room change for Thursday workshop",
    preview: "The community room is booked, so we moved you to Redwood Hall B...",
    timestamp: "Yesterday",
  },
  {
    id: "t4",
    senderName: "Riley Chen",
    subject: "Updated color palette for signage",
    preview: "Attached the revised palette for banners and name tags — mostly warmer accent tones...",
    timestamp: "Yesterday",
  },
  {
    id: "t5",
    senderName: "Volunteer Coordination",
    subject: "Your panel schedule for Thursday",
    preview: "Here's the finalized lineup and moderator notes for the neighborhood forum...",
    timestamp: "Mon",
  },
];

export const threadMessages: Record<string, { subject: string; messages: EmailDetailMessage[] }> = {
  t1: {
    subject: "Summer picnic volunteer schedule",
    messages: [
      {
        id: "m1",
        senderName: "Sam Patel",
        timestamp: "9:12 AM",
        body: (
          <div>
            <p>Hi everyone — the volunteer schedule for Saturday is set. Highlights:</p>
            <ul>
              <li>Check-in table covered from 10:00–11:30 AM</li>
              <li>Two food stations staffed through lunch service</li>
              <li>Cleanup crew confirmed for 2:30 PM</li>
            </ul>
            <p>Reply if you need to swap a shift.</p>
          </div>
        ),
      },
    ],
  },
  t2: {
    subject: "Re: Event poster draft",
    messages: [
      {
        id: "m1",
        senderName: "Jordan Hayes",
        timestamp: "8:47 AM",
        body: (
          <p>
            This looks great — left a couple of notes on the welcome banner copy. Mostly wording tweaks, nothing
            blocking print.
          </p>
        ),
      },
    ],
  },
};
