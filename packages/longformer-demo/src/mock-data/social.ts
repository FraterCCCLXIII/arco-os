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
  { id: "sc-me", label: "Paul Bloch", avatarName: "Paul Bloch" },
  { id: "sc-ai", label: "Meta AI", avatarName: "Meta AI", avatarColor: "#1877F2" },
  { id: "sc-friends", label: "Friends", avatarName: "Friends", avatarColor: "#1877F2" },
  { id: "sc-memories", label: "Memories", avatarName: "Memories", avatarColor: "#f97316" },
  { id: "sc-saved", label: "Saved", avatarName: "Saved", avatarColor: "#8b5cf6" },
  { id: "sc-groups", label: "OpenClaw Community", avatarName: "OpenClaw", avatarColor: "#22c55e" },
  { id: "sc-japan", label: "Moving to Japan", avatarName: "Japan", avatarColor: "#ef4444" },
];

export const facebookStories: SocialStory[] = [
  { id: "story-create", authorName: "Create story", isCreate: true },
  { id: "story-dana", authorName: "Dana Cho" },
  { id: "story-marcus", authorName: "Marcus Webb" },
  { id: "story-priya", authorName: "Priya Nair" },
  { id: "story-jamie", authorName: "Jamie Steinberg" },
  { id: "story-design", authorName: "Design Team" },
];

export const socialPosts: SocialPost[] = [
  {
    id: "post-1",
    authorId: "jamie-steinberg",
    authorName: "Jamie Steinberg",
    authorHandle: "@jamiesteinberg",
    verified: true,
    timestamp: "16h",
    content:
      "Stanford's CS229 lecture on transformers is still one of the best intros to attention. Worth revisiting if you're building anything with LLMs.",
    mediaType: "video",
    mediaLabel: "CS229 · Machine Learning · Stanford",
    mediaTone: "accent",
    stats: { replies: 42, reposts: 318, likes: 2400, views: 89000 },
  },
  {
    id: "post-2",
    authorId: "integral-global",
    authorName: "Integral Global",
    authorHandle: "@integralglobal",
    timestamp: "7h",
    content:
      "An Integral View of Tibetan Buddhism — a concise map of practice traditions, philosophy, and lineage. Now available in print and digital.",
    mediaType: "image",
    mediaLabel: "An Integral View of Tibetan Buddhism",
    mediaTone: "warning",
    visibility: "public",
    stats: { replies: 18, reposts: 64, likes: 412, views: 12400 },
  },
  {
    id: "post-3",
    authorId: "dana-cho",
    authorName: "Dana Cho",
    authorHandle: "@danachodesign",
    verified: true,
    timestamp: "2h",
    content:
      "Shipped a new composer pattern in Longformer today — same primitives, two totally different social layouts. Reuse wins again.",
    stats: { replies: 9, reposts: 27, likes: 186, views: 5200 },
  },
  {
    id: "post-4",
    authorId: "marcus-webb",
    authorName: "Marcus Webb",
    authorHandle: "@marcuswebb",
    timestamp: "45m",
    content:
      "Hot take: the best social UIs are just good information architecture with a feed column and widgets that respect your attention.",
    stats: { replies: 31, reposts: 88, likes: 640, views: 9800 },
  },
];

export const socialTrends: SocialTrend[] = [
  { id: "trend-1", category: "Trending in United States", topic: "Longformer UI", postCount: "12.4K posts" },
  { id: "trend-2", category: "Technology · Trending", topic: "Design Systems", postCount: "8,291 posts" },
  { id: "trend-3", category: "Trending", topic: "OpenClaw", postCount: "4,102 posts" },
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
  { id: "sug-1", name: "Priya Nair", handle: "@priyanair", bio: "Infra · Longformer" },
  { id: "sug-2", name: "Design Team", handle: "@longformerdesign", bio: "Systems & craft" },
  { id: "sug-3", name: "Longformer Bot", handle: "@longformerbot", bio: "Release notes & tips" },
];

export const socialBirthdays: SocialBirthdayNotice = {
  names: "Michael Madden",
  count: 5,
};

export const socialContactsOnline: SocialContactOnline[] = [
  { id: "online-dana", name: "Dana Cho", status: "online" },
  { id: "online-marcus", name: "Marcus Webb", status: "online" },
  { id: "online-jamie", name: "Jamie Steinberg", status: "away" },
  { id: "online-priya", name: "Priya Nair", status: "online" },
];
