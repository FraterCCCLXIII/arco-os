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
  { id: "dm-dana", name: "Dana Cho", status: "online", unreadCount: 2 },
  { id: "dm-marcus", name: "Marcus Webb", status: "away" },
  { id: "dm-priya", name: "Priya Nair", status: "offline" },
  { id: "dm-design", name: "Design Team", isGroup: true, unreadCount: 1 },
  { id: "dm-jamie", name: "Jamie Steinberg", status: "offline" },
  { id: "dm-bot", name: "Longformer Bot", status: "online" },
];

export const slackMembers: Record<string, SlackMember> = {
  "jamie-steinberg": {
    id: "jamie-steinberg",
    name: "Jamie Steinberg",
    title: "Developer Relations",
    email: "jamie.steinberg@longformer.dev",
    status: "offline",
    deactivated: true,
  },
  "dana-cho": {
    id: "dana-cho",
    name: "Dana Cho",
    title: "Staff Engineer",
    email: "dana@longformer.dev",
    status: "online",
  },
  "marcus-webb": {
    id: "marcus-webb",
    name: "Marcus Webb",
    title: "Product Design",
    email: "marcus@longformer.dev",
    status: "away",
  },
  "priya-nair": {
    id: "priya-nair",
    name: "Priya Nair",
    title: "Engineering Manager",
    email: "priya@longformer.dev",
    status: "offline",
  },
  me: {
    id: "me",
    name: "Paul Bloch",
    title: "Founder",
    email: "paul@longformer.dev",
    status: "online",
  },
};

export const slackChannelTopics: Record<string, string> = {
  "ch-events": "Company events, offsites, and team gatherings",
  "ch-general": "Company-wide announcements and water cooler chat",
  "ch-infra": "Platform reliability, deploys, and on-call",
  "ch-logistics": "Logistics core app team coordination",
};

export const slackChannelMessages: Record<string, SlackMessage[]> = {
  "ch-events": [
    {
      id: "e1",
      senderId: "jamie-steinberg",
      senderName: "Jamie Steinberg",
      content: "Heads up — we're locking the offsite agenda by Friday. Drop any last-minute session ideas in this thread.",
      timestamp: "Jun 23rd at 11:27 AM",
    },
    {
      id: "e2",
      senderId: "dana-cho",
      senderName: "Dana Cho",
      content: "Can we add a workshop on agent workspaces? @Priya Nair and I have a draft outline in Notion: https://notion.so/longformer/offsite-agenda",
      timestamp: "Jun 23rd at 11:31 AM",
    },
    {
      id: "e3",
      senderId: "marcus-webb",
      senderName: "Marcus Webb",
      content: "Love it. I'll bring printed mockups for the Groups workspace we're prototyping.",
      timestamp: "Jun 23rd at 11:34 AM",
    },
    {
      id: "e4",
      senderId: "me",
      senderName: "Paul Bloch",
      content: "Perfect — let's keep the Thursday afternoon block open for a live demo.",
      timestamp: "Jun 23rd at 11:38 AM",
    },
  ],
  "ch-general": [
    {
      id: "g1",
      senderId: "priya-nair",
      senderName: "Priya Nair",
      content: "Welcome to everyone who joined this week 👋 Introduce yourself in #random when you get a chance.",
      timestamp: "Jun 22nd at 9:02 AM",
    },
  ],
  "ch-infra": [
    {
      id: "i1",
      senderId: "dana-cho",
      senderName: "Dana Cho",
      content: "Deploy window for the UI kit demo is open until 4pm PT.",
      timestamp: "Jun 23rd at 8:15 AM",
    },
  ],
  "ch-daily-dogfood": [
    {
      id: "d1",
      senderId: "marcus-webb",
      senderName: "Marcus Webb",
      content: "Dogfooding the new workspace rail today — feedback welcome.",
      timestamp: "Jun 23rd at 10:00 AM",
    },
  ],
  "ch-dev-rel": [
    {
      id: "r1",
      senderId: "jamie-steinberg",
      senderName: "Jamie Steinberg",
      content: "Drafting release notes for the Longformer UI kit preview.",
      timestamp: "Jun 21st at 3:40 PM",
    },
  ],
  "ch-logistics": [
    {
      id: "l1",
      senderId: "priya-nair",
      senderName: "Priya Nair",
      content: "Sprint planning moved to tomorrow at 11am.",
      timestamp: "Jun 23rd at 9:55 AM",
    },
  ],
  "ch-product": [
    {
      id: "p1",
      senderId: "marcus-webb",
      senderName: "Marcus Webb",
      content: "Q3 roadmap review is scheduled for next Tuesday.",
      timestamp: "Jun 20th at 2:10 PM",
    },
  ],
  "ch-random": [
    {
      id: "x1",
      senderId: "dana-cho",
      senderName: "Dana Cho",
      content: "Anyone else excited for the offsite coffee tasting?",
      timestamp: "Jun 22nd at 4:22 PM",
    },
  ],
};

export const slackDirectMessageThreads: Record<string, SlackMessage[]> = {
  "dm-dana": [
    { id: "dm1", senderId: "dana-cho", senderName: "Dana Cho", content: "Can you review the workspace rail spacing?", timestamp: "10:02 AM" },
    { id: "dm2", senderId: "me", senderName: "Paul Bloch", content: "On it — looks great so far.", timestamp: "10:04 AM" },
  ],
  "dm-marcus": [
    { id: "dm3", senderId: "marcus-webb", senderName: "Marcus Webb", content: "Pushed updated mockups for the profile panel.", timestamp: "Yesterday" },
  ],
  "dm-priya": [
    { id: "dm4", senderId: "priya-nair", senderName: "Priya Nair", content: "Thanks for the quick turnaround on the demo data.", timestamp: "Yesterday" },
  ],
  "dm-design": [
    { id: "dm5", senderId: "marcus-webb", senderName: "Marcus Webb", content: "Updated tokens for the Groups workspace.", timestamp: "9:40 AM" },
    { id: "dm6", senderId: "dana-cho", senderName: "Dana Cho", content: "Ship it 🚀", timestamp: "9:42 AM" },
  ],
  "dm-jamie": [
    { id: "dm7", senderId: "jamie-steinberg", senderName: "Jamie Steinberg", content: "Can you confirm the offsite session title?", timestamp: "Jun 21st" },
  ],
  "dm-bot": [
    { id: "dm8", senderId: "dm-bot", senderName: "Longformer Bot", content: "Your deployment succeeded ✅", timestamp: "2d ago" },
  ],
};

export const slackSenderToMemberId: Record<string, string> = {
  "jamie-steinberg": "jamie-steinberg",
  "dana-cho": "dana-cho",
  "marcus-webb": "marcus-webb",
  "priya-nair": "priya-nair",
  me: "me",
};
