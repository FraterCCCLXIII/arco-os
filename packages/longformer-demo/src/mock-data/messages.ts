import type { DirectMessage, MessageContact } from "longformer-ui";

export const messageContacts: MessageContact[] = [
  {
    id: "c1",
    name: "Dana Cho",
    status: "online",
    lastMessage: "Sounds good, I'll push the fix now",
    timestamp: "2m",
    unreadCount: 2,
  },
  {
    id: "c2",
    name: "Design Team",
    isGroup: true,
    lastMessage: "Marcus: Updated the mockups in Figma",
    timestamp: "24m",
  },
  {
    id: "c3",
    name: "Marcus Webb",
    status: "away",
    lastMessage: "typing…",
    timestamp: "1h",
    typing: true,
  },
  {
    id: "c4",
    name: "Priya Nair",
    status: "offline",
    lastMessage: "Thanks for the review!",
    timestamp: "Yesterday",
  },
  {
    id: "c5",
    name: "Longformer Bot",
    status: "online",
    lastMessage: "Your deployment succeeded ✅",
    timestamp: "2d",
  },
];

export const messageThreads: Record<string, DirectMessage[]> = {
  c1: [
    { id: "m1", senderId: "c1", content: "Hey! Did you see the review comments on the WebSocket PR?", timestamp: "10:02 AM" },
    { id: "m2", senderId: "me", content: "Yep, just looked — the payload size cap makes sense.", timestamp: "10:04 AM" },
    { id: "m3", senderId: "c1", content: "Cool, I'll add validation for the message shape too.", timestamp: "10:05 AM" },
    { id: "m4", senderId: "me", content: "Perfect, that closes out the security note from Bugbot.", timestamp: "10:06 AM" },
    { id: "m5", senderId: "c1", content: "Sounds good, I'll push the fix now", timestamp: "10:07 AM" },
  ],
  c2: [
    { id: "m1", senderId: "marcus", senderName: "Marcus Webb", content: "Updated the mockups in Figma — new empty states for Tasks + Notifications", timestamp: "9:40 AM" },
    { id: "m2", senderId: "dana", senderName: "Dana Cho", content: "Nice, the notification grouping looks much cleaner now", timestamp: "9:42 AM" },
    { id: "m3", senderId: "me", content: "Agreed — let's ship it in the next demo build.", timestamp: "9:44 AM" },
    { id: "m4", senderId: "marcus", senderName: "Marcus Webb", content: "On it 👍", timestamp: "9:45 AM" },
  ],
  c3: [
    { id: "m1", senderId: "c3", content: "Quick one — should the rail collapse by default on mobile widths?", timestamp: "Yesterday" },
    { id: "m2", senderId: "me", content: "Yeah, let's default collapsed under 760px like the other panes.", timestamp: "Yesterday" },
  ],
  c4: [
    { id: "m1", senderId: "c4", content: "Thanks for the review!", timestamp: "Yesterday" },
    { id: "m2", senderId: "me", content: "Of course — nice work on the CI watchdog.", timestamp: "Yesterday" },
  ],
  c5: [
    { id: "m1", senderId: "c5", content: "Your deployment succeeded ✅", timestamp: "2d" },
    { id: "m2", senderId: "c5", content: "3 checks passed · 0 warnings", timestamp: "2d" },
  ],
};
