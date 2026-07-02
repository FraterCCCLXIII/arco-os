import type { DirectMessage, MessageContact } from "longformer-ui";

export const messageContacts: MessageContact[] = [
  {
    id: "c1",
    name: "Riley Chen",
    status: "online",
    lastMessage: "Sounds good, I'll confirm with the caterer now",
    timestamp: "2m",
    unreadCount: 2,
  },
  {
    id: "c2",
    name: "Product Team",
    isGroup: true,
    lastMessage: "Jordan: Updated the picnic poster mockups",
    timestamp: "24m",
  },
  {
    id: "c3",
    name: "Jordan Hayes",
    status: "away",
    lastMessage: "typing…",
    timestamp: "1h",
    typing: true,
  },
  {
    id: "c4",
    name: "Sam Patel",
    status: "offline",
    lastMessage: "Thanks for covering the morning shift!",
    timestamp: "Yesterday",
  },
  {
    id: "c5",
    name: "Meridian Bot",
    status: "online",
    lastMessage: "Reminder: picnic setup starts at 9:00 AM",
    timestamp: "2d",
  },
];

export const messageThreads: Record<string, DirectMessage[]> = {
  c1: [
    { id: "m1", senderId: "c1", content: "Hey! Did you see the updated catering menu for Saturday?", timestamp: "10:02 AM" },
    { id: "m2", senderId: "me", content: "Yep — the vegetarian option looks perfect.", timestamp: "10:04 AM" },
    { id: "m3", senderId: "c1", content: "Great, I'll ask them to add a nut-free dessert tray too.", timestamp: "10:05 AM" },
    { id: "m4", senderId: "me", content: "Perfect, that covers the allergy note from last week's signup sheet.", timestamp: "10:06 AM" },
    { id: "m5", senderId: "c1", content: "Sounds good, I'll confirm with the caterer now", timestamp: "10:07 AM" },
  ],
  c2: [
    { id: "m1", senderId: "jordan", senderName: "Jordan Hayes", content: "Updated the picnic poster mockups — new welcome banner and map callout", timestamp: "9:40 AM" },
    { id: "m2", senderId: "riley", senderName: "Riley Chen", content: "Nice, the map makes the parking lot much easier to find", timestamp: "9:42 AM" },
    { id: "m3", senderId: "me", content: "Agreed — let's send this to print tomorrow.", timestamp: "9:44 AM" },
    { id: "m4", senderId: "jordan", senderName: "Jordan Hayes", content: "On it 👍", timestamp: "9:45 AM" },
  ],
  c3: [
    { id: "m1", senderId: "c3", content: "Quick one — should we put the welcome table near the main gate or the pavilion?", timestamp: "Yesterday" },
    { id: "m2", senderId: "me", content: "Main gate works better — people see it before they spread out.", timestamp: "Yesterday" },
  ],
  c4: [
    { id: "m1", senderId: "c4", content: "Thanks for covering the morning shift!", timestamp: "Yesterday" },
    { id: "m2", senderId: "me", content: "Of course — happy to help with setup.", timestamp: "Yesterday" },
  ],
  c5: [
    { id: "m1", senderId: "c5", content: "Reminder: picnic setup starts at 9:00 AM", timestamp: "2d" },
    { id: "m2", senderId: "c5", content: "Bring sunscreen · water stations open at 10:00", timestamp: "2d" },
  ],
};
