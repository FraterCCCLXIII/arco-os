export type MusicLibraryFilter = "playlists" | "artists" | "albums" | "podcasts";

export type MusicContentFilter = "all" | "music" | "podcasts" | "audiobooks";

export type MusicImageTone =
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

export interface MusicLibraryItem {
  id: string;
  title: string;
  subtitle: string;
  kind: "playlist" | "artist" | "album" | "podcast";
  imageTone: MusicImageTone;
}

export interface MusicQuickAccess {
  id: string;
  title: string;
  imageTone: MusicImageTone;
}

export interface MusicFeaturedCard {
  id: string;
  sectionTitle: string;
  title: string;
  description: string;
  label: string;
  imageTone: MusicImageTone;
}

export interface MusicMixCard {
  id: string;
  number: string;
  title: string;
  artists: string[];
  imageTone: MusicImageTone;
}

export interface MusicTrack {
  id: string;
  title: string;
  artists: string;
  albumArtTone: MusicImageTone;
  duration: string;
  hasVideo?: boolean;
}

export interface MusicRelatedVideo {
  id: string;
  title: string;
  artists: string;
  imageTone: MusicImageTone;
}

export interface MusicNowPlaying {
  track: MusicTrack;
  queueTitle?: string;
  progress: number;
  elapsed: string;
  relatedVideos: MusicRelatedVideo[];
}

export interface MusicUser {
  name: string;
  avatarSrc?: string;
}
