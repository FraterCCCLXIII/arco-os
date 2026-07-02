import type {
  SlackChannel,
  SlackDirectMessage,
  SlackMember,
  SlackMessage,
  SlackNavItem,
  SlackWorkspaceItem,
} from "longformer-ui";

export const slackWorkspaces: SlackWorkspaceItem[] = [
  { id: "ws-all-hands", label: "All Hands", initials: "AH", accent: "#611f69", unreadCount: 3 },
  { id: "ws-longformer", label: "Longformer", initials: "LF", accent: "#1264a3" },
  { id: "ws-design", label: "Design Guild", initials: "DG", accent: "#2bac76", unreadCount: 1 },
  { id: "ws-infra", label: "Infra", initials: "IN", accent: "#e01e5a" },
];

export const slackNavItems: SlackNavItem[] = [
  { id: "home", label: "Home", icon: "home", active: true },
  { id: "dms", label: "DMs", icon: "chat", badgeCount: 8 },
  { id: "activity", label: "Activity", icon: "bell", badgeCount: 23 },
  { id: "files", label: "Files", icon: "folder" },
  { id: "later", label: "Later", icon: "bookmark" },
];

export const slackChannels: SlackChannel[] = [
  { id: "ch-daily-dogfood", name: "daily-dogfood", unread: true },
  { id: "ch-dev-rel", name: "dev-rel" },
  { id: "ch-events", name: "events", unread: true, mentionCount: 1 },
  { id: "ch-general", name: "general" },
  { id: "ch-infra", name: "infra" },
  { id: "ch-logistics", name: "logistics-core-app-team" },
  { id: "ch-product", name: "product-updates" },
  { id: "ch-random", name: "random" },
];

export const slackDirectMessages: SlackDirectMessage[] = [
  { id: "dm-riley", name: "Riley Chen", status: "online", unreadCount: 2 },
  { id: "dm-jordan", name: "Jordan Hayes", status: "away" },
  { id: "dm-sam", name: "Sam Patel", status: "offline" },
  { id: "dm-design", name: "Product Team", isGroup: true, unreadCount: 1 },
  { id: "dm-casey", name: "Casey Walsh", status: "offline" },
  { id: "dm-bot", name: "Meridian Bot", status: "online" },
];

export const slackMembers: Record<string, SlackMember> = {
  "casey-walsh": {
    id: "casey-walsh",
    name: "Casey Walsh",
    title: "Developer Relations",
    email: "casey.walsh@meridian.dev",
    status: "offline",
    deactivated: true,
  },
  "riley-chen": {
    id: "riley-chen",
    name: "Riley Chen",
    title: "Staff Engineer",
    email: "riley@meridian.dev",
    status: "online",
  },
  "jordan-hayes": {
    id: "jordan-hayes",
    name: "Jordan Hayes",
    title: "Product Design",
    email: "jordan@meridian.dev",
    status: "away",
  },
  "sam-patel": {
    id: "sam-patel",
    name: "Sam Patel",
    title: "Engineering Manager",
    email: "sam@meridian.dev",
    status: "offline",
  },
  me: {
    id: "me",
    name: "Alex Morgan",
    title: "Founder",
    email: "alex@meridian.dev",
    status: "online",
  },
};

export const slackChannelTopics: Record<string, string> = {
  "ch-events": "Community events, meetups, and volunteer gatherings",
  "ch-general": "Team announcements and general chat",
  "ch-infra": "Facilities, rentals, and event logistics",
  "ch-logistics": "Picnic and forum planning coordination",
};

export const slackChannelMessages: Record<string, SlackMessage[]> = {
  "ch-events": [
    {
      id: "e1",
      senderId: "casey-walsh",
      senderName: "Casey Walsh",
      content: "Heads up — we're locking the summer picnic agenda by Friday. Drop any last-minute activity ideas in this thread.",
      timestamp: "Jun 23rd at 11:27 AM",
    },
    {
      id: "e2",
      senderId: "riley-chen",
      senderName: "Riley Chen",
      content: "Can we add a volunteer orientation session? @Sam Patel and I have a draft outline in the shared doc: https://docs.meridian.dev/picnic-agenda",
      timestamp: "Jun 23rd at 11:31 AM",
    },
    {
      id: "e3",
      senderId: "jordan-hayes",
      senderName: "Jordan Hayes",
      content: "Love it. I'll bring printed posters and a map of the pavilion layout.",
      timestamp: "Jun 23rd at 11:34 AM",
    },
    {
      id: "e4",
      senderId: "me",
      senderName: "Alex Morgan",
      content: "Perfect — let's keep the Thursday afternoon block open for a walkthrough with the facilities team.",
      timestamp: "Jun 23rd at 11:38 AM",
    },
  ],
  "ch-general": [
    {
      id: "g1",
      senderId: "sam-patel",
      senderName: "Sam Patel",
      content: "Welcome to everyone who joined this week 👋 Introduce yourself in #random when you get a chance.",
      timestamp: "Jun 22nd at 9:02 AM",
    },
  ],
  "ch-infra": [
    {
      id: "i1",
      senderId: "riley-chen",
      senderName: "Riley Chen",
      content: "Pavilion setup window is open until 4pm PT on Friday.",
      timestamp: "Jun 23rd at 8:15 AM",
    },
  ],
  "ch-daily-dogfood": [
    {
      id: "d1",
      senderId: "jordan-hayes",
      senderName: "Jordan Hayes",
      content: "Testing the new check-in flow today — feedback welcome.",
      timestamp: "Jun 23rd at 10:00 AM",
    },
  ],
  "ch-dev-rel": [
    {
      id: "r1",
      senderId: "casey-walsh",
      senderName: "Casey Walsh",
      content: "Drafting the volunteer welcome packet for next week's forum.",
      timestamp: "Jun 21st at 3:40 PM",
    },
  ],
  "ch-logistics": [
    {
      id: "l1",
      senderId: "sam-patel",
      senderName: "Sam Patel",
      content: "Supply run moved to tomorrow at 11am.",
      timestamp: "Jun 23rd at 9:55 AM",
    },
  ],
  "ch-product": [
    {
      id: "p1",
      senderId: "jordan-hayes",
      senderName: "Jordan Hayes",
      content: "Fall events calendar review is scheduled for next Tuesday.",
      timestamp: "Jun 20th at 2:10 PM",
    },
  ],
  "ch-random": [
    {
      id: "x1",
      senderId: "riley-chen",
      senderName: "Riley Chen",
      content: "Anyone else excited for the picnic lemonade stand?",
      timestamp: "Jun 22nd at 4:22 PM",
    },
  ],
};

export const slackDirectMessageThreads: Record<string, SlackMessage[]> = {
  "dm-riley": [
    { id: "dm1", senderId: "riley-chen", senderName: "Riley Chen", content: "Can you review the welcome table layout?", timestamp: "10:02 AM" },
    { id: "dm2", senderId: "me", senderName: "Alex Morgan", content: "On it — looks great so far.", timestamp: "10:04 AM" },
  ],
  "dm-jordan": [
    { id: "dm3", senderId: "jordan-hayes", senderName: "Jordan Hayes", content: "Uploaded updated poster mockups for the picnic.", timestamp: "Yesterday" },
  ],
  "dm-sam": [
    { id: "dm4", senderId: "sam-patel", senderName: "Sam Patel", content: "Thanks for the quick turnaround on the volunteer list.", timestamp: "Yesterday" },
  ],
  "dm-design": [
    { id: "dm5", senderId: "jordan-hayes", senderName: "Jordan Hayes", content: "Updated colors for the event signage.", timestamp: "9:40 AM" },
    { id: "dm6", senderId: "riley-chen", senderName: "Riley Chen", content: "Looks ready to print 🎉", timestamp: "9:42 AM" },
  ],
  "dm-casey": [
    { id: "dm7", senderId: "casey-walsh", senderName: "Casey Walsh", content: "Can you confirm the forum session title?", timestamp: "Jun 21st" },
  ],
  "dm-bot": [
    { id: "dm8", senderId: "dm-bot", senderName: "Meridian Bot", content: "Reminder: picnic setup starts at 9:00 AM", timestamp: "2d ago" },
  ],
};

export const slackSenderToMemberId: Record<string, string> = {
  "casey-walsh": "casey-walsh",
  "riley-chen": "riley-chen",
  "jordan-hayes": "jordan-hayes",
  "sam-patel": "sam-patel",
  me: "me",
};
