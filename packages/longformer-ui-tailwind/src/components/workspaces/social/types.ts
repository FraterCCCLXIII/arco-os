import type { IconName } from "../../../icons";

export type SocialNetworkId = "twitter" | "facebook";

export interface SocialNetworkItem {
  id: SocialNetworkId;
  label: string;
  initials: string;
  accent?: string;
}

export interface SocialNavItem {
  id: string;
  label: string;
  icon: IconName;
  badgeCount?: number;
  active?: boolean;
}

export interface SocialShortcut {
  id: string;
  label: string;
  avatarName?: string;
  avatarSrc?: string;
  avatarColor?: string;
}

export interface SocialStory {
  id: string;
  authorName: string;
  avatarSrc?: string;
  isCreate?: boolean;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatarSrc?: string;
  verified?: boolean;
  timestamp: string;
  content: string;
  mediaType?: "image" | "video";
  mediaLabel?: string;
  mediaTone?: "accent" | "neutral" | "warning";
  visibility?: "public" | "friends";
  stats: {
    replies: number;
    reposts: number;
    likes: number;
    views?: number;
  };
}

export interface SocialTrend {
  id: string;
  category: string;
  topic: string;
  postCount?: string;
}

export interface SocialNewsItem {
  id: string;
  headline: string;
  timeAgo: string;
  category: string;
  postCount: string;
  imageTone?: "accent" | "neutral" | "warning";
}

export interface SocialSuggestion {
  id: string;
  name: string;
  handle: string;
  avatarSrc?: string;
  bio?: string;
}

export interface SocialBirthdayNotice {
  names: string;
  count: number;
}

export interface SocialContactOnline {
  id: string;
  name: string;
  avatarSrc?: string;
  status?: "online" | "away" | "offline";
}
