import type {
  SocialBirthdayNotice,
  SocialContactOnline,
  SocialNavItem,
  SocialNetworkItem,
  SocialNewsItem,
  SocialPost,
  SocialShortcut,
  SocialStory,
  SocialSuggestion,
  SocialTrend,
} from "longformer-ui";

export const socialNetworks: SocialNetworkItem[] = [
  { id: "twitter", label: "X (Twitter)", initials: "X", accent: "#000000" },
  { id: "facebook", label: "Facebook", initials: "f", accent: "#1877F2" },
];

export const twitterNavItems: SocialNavItem[] = [
  { id: "home", label: "Home", icon: "home", active: true },
  { id: "explore", label: "Explore", icon: "search" },
  { id: "notifications", label: "Notifications", icon: "bell", badgeCount: 1 },
  { id: "messages", label: "Messages", icon: "mail" },
  { id: "bookmarks", label: "Bookmarks", icon: "bookmark" },
  { id: "profile", label: "Profile", icon: "contact" },
];

export const facebookShortcuts: SocialShortcut[] = [
  { id: "sc-me", label: "Alex Morgan", avatarName: "Alex Morgan" },
  { id: "sc-ai", label: "Meta AI", avatarName: "Meta AI", avatarColor: "#1877F2" },
  { id: "sc-friends", label: "Friends", avatarName: "Friends", avatarColor: "#1877F2" },
  { id: "sc-memories", label: "Memories", avatarName: "Memories", avatarColor: "#f97316" },
  { id: "sc-saved", label: "Saved", avatarName: "Saved", avatarColor: "#8b5cf6" },
  { id: "sc-groups", label: "OpenClaw Community", avatarName: "OpenClaw", avatarColor: "#22c55e" },
  { id: "sc-japan", label: "Moving to Japan", avatarName: "Japan", avatarColor: "#ef4444" },
];

export const facebookStories: SocialStory[] = [
  { id: "story-create", authorName: "Create story", isCreate: true },
  { id: "story-riley", authorName: "Riley Chen" },
  { id: "story-jordan", authorName: "Jordan Hayes" },
  { id: "story-sam", authorName: "Sam Patel" },
  { id: "story-casey", authorName: "Casey Walsh" },
  { id: "story-design", authorName: "Product Team" },
];

export const socialPosts: SocialPost[] = [
  {
    id: "post-1",
    authorId: "casey-walsh",
    authorName: "Casey Walsh",
    authorHandle: "@caseywalsh",
    verified: true,
    timestamp: "16h",
    content:
      "Re-read an old essay on community gardens this morning. Still one of the best reminders that small shared projects compound over time.",
    mediaType: "video",
    mediaLabel: "Essay · Community gardens",
    mediaTone: "accent",
    stats: { replies: 42, reposts: 318, likes: 2400, views: 89000 },
  },
  {
    id: "post-2",
    authorId: "harbor-analytics",
    authorName: "Harbor Analytics",
    authorHandle: "@harboranalytics",
    timestamp: "7h",
    content:
      "June volunteer sign-ups are live — shift coverage, RSVP trends, and supply needs in one dashboard. Link in thread.",
    mediaType: "image",
    mediaLabel: "Harbor Analytics · June Dashboard",
    mediaTone: "warning",
    visibility: "public",
    stats: { replies: 18, reposts: 64, likes: 412, views: 12400 },
  },
  {
    id: "post-3",
    authorId: "riley-chen",
    authorName: "Riley Chen",
    authorHandle: "@rileychen",
    verified: true,
    timestamp: "2h",
    content:
      "Printed the picnic posters today — same layout template, two totally different neighborhood events. Reuse wins again.",
    stats: { replies: 9, reposts: 27, likes: 186, views: 5200 },
  },
  {
    id: "post-4",
    authorId: "jordan-hayes",
    authorName: "Jordan Hayes",
    authorHandle: "@jordanhayes",
    timestamp: "45m",
    content:
      "Hot take: the best social UIs are just good information architecture with a feed column and widgets that respect your attention.",
    stats: { replies: 31, reposts: 88, likes: 640, views: 9800 },
  },
];

export const socialTrends: SocialTrend[] = [
  { id: "trend-1", category: "Trending in United States", topic: "Summer Picnics", postCount: "12.4K posts" },
  { id: "trend-2", category: "Community · Trending", topic: "Volunteer Week", postCount: "8,291 posts" },
  { id: "trend-3", category: "Trending", topic: "Neighborhood Forums", postCount: "4,102 posts" },
  { id: "trend-4", category: "Music · Trending", topic: "New Album Friday", postCount: "22.1K posts" },
];

export const socialNews: SocialNewsItem[] = [
  {
    id: "news-1",
    headline: "Developers rethink social feeds with component-driven layouts",
    timeAgo: "3h ago",
    category: "Technology",
    postCount: "1,842 posts",
    imageTone: "accent",
  },
  {
    id: "news-2",
    headline: "Design tokens help teams ship consistent dark mode across apps",
    timeAgo: "5h ago",
    category: "Design",
    postCount: "976 posts",
    imageTone: "neutral",
  },
  {
    id: "news-3",
    headline: "Remote teams share how async standups actually work",
    timeAgo: "8h ago",
    category: "Business",
    postCount: "2,410 posts",
    imageTone: "warning",
  },
];

export const socialSuggestions: SocialSuggestion[] = [
  { id: "sug-1", name: "Sam Patel", handle: "@sampatel", bio: "Events · Meridian Labs" },
  { id: "sug-2", name: "Product Team", handle: "@meridiandesign", bio: "Systems & craft" },
  { id: "sug-3", name: "Meridian Bot", handle: "@meridianbot", bio: "Release notes & tips" },
];

export const socialBirthdays: SocialBirthdayNotice = {
  names: "Chris Dalton",
  count: 5,
};

export const socialContactsOnline: SocialContactOnline[] = [
  { id: "online-riley", name: "Riley Chen", status: "online" },
  { id: "online-jordan", name: "Jordan Hayes", status: "online" },
  { id: "online-casey", name: "Casey Walsh", status: "away" },
  { id: "online-sam", name: "Sam Patel", status: "online" },
];
