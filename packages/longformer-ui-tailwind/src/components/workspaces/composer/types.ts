import type { IconName } from "../../../icons";

export type ComposerArtTone =
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

export type ComposerNavView = "home" | "explore" | "create" | "studio" | "library" | "notifications";

export type ComposerMode = "simple" | "advanced" | "sounds";

export type ComposerModelVersion = "v3.5" | "v4" | "v4.5";

export interface ComposerUser {
  name: string;
  handle: string;
  plan: string;
  upgradeLabel?: string;
}

export interface ComposerNavItem {
  id: ComposerNavView;
  label: string;
  icon: IconName;
  badge?: number;
}

export interface ComposerTrack {
  id: string;
  title: string;
  version: string;
  description: string;
  duration: string;
  durationSeconds: number;
  artTone: ComposerArtTone;
  liked?: boolean;
}

export interface ComposerNowPlaying {
  track: ComposerTrack;
  progress: number;
  elapsed: string;
  creator: string;
}

export interface ComposerWorkspaceData {
  productName: string;
  user: ComposerUser;
  navItems: ComposerNavItem[];
  tracks: ComposerTrack[];
  styleSuggestions: string[];
  defaultPrompt: string;
  nowPlaying: ComposerNowPlaying;
}
