export type VisionNavSection = "home" | "tv" | "movies" | "podcasts" | "my-list";

export type VisionMediaKind = "movie" | "series" | "podcast" | "music-video";

export type VisionImageTone =
  | "rose"
  | "orange"
  | "amber"
  | "lime"
  | "green"
  | "teal"
  | "cyan"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "pink";

export interface VisionUser {
  name: string;
  avatarSrc?: string;
}

export interface VisionFeaturedContent {
  id: string;
  kind: VisionMediaKind;
  badge?: string;
  title: string;
  description: string;
  rankLabel?: string;
  imageTone: VisionImageTone;
}

export interface VisionMediaItem {
  id: string;
  title: string;
  imageTone: VisionImageTone;
  kind?: VisionMediaKind;
  duration?: string;
  rating?: string;
  badge?: string;
}

export interface VisionContinueItem {
  id: string;
  title: string;
  episodeLabel?: string;
  progress: number;
  imageTone: VisionImageTone;
}

export interface VisionTop10Item extends VisionMediaItem {
  rank: number;
}

export interface VisionContentRow {
  id: string;
  title: string;
  exploreLabel?: string;
  variant: "default" | "top10" | "continue";
  items: VisionMediaItem[] | VisionContinueItem[] | VisionTop10Item[];
}

export interface VisionNowPlaying {
  title: string;
  subtitle: string;
  kind: VisionMediaKind;
  imageTone: VisionImageTone;
  progress: number;
  elapsed: string;
  duration: string;
}
