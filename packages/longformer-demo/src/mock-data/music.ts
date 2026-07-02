import type {
  MusicFeaturedCard,
  MusicLibraryItem,
  MusicMixCard,
  MusicNowPlaying,
  MusicQuickAccess,
  MusicUser,
} from "longformer-ui";

export const musicUser: MusicUser = {
  name: "Alex Morgan",
};

export const musicLibraryItems: MusicLibraryItem[] = [
  {
    id: "liked-songs",
    title: "Liked Songs",
    subtitle: "Playlist · 963 songs",
    kind: "playlist",
    imageTone: "purple",
  },
  {
    id: "your-episodes",
    title: "Your Episodes",
    subtitle: "Playlist · Saved & downloaded",
    kind: "playlist",
    imageTone: "green",
  },
  {
    id: "fire-for-you",
    title: "Fire For You Mixtape",
    subtitle: "Playlist · Alex Morgan",
    kind: "playlist",
    imageTone: "orange",
  },
  {
    id: "heat-death",
    title: "Heat Death by Music Mix",
    subtitle: "Playlist · Alex Morgan",
    kind: "playlist",
    imageTone: "rose",
  },
  {
    id: "midnight-generation",
    title: "Midnight Generation",
    subtitle: "Artist",
    kind: "artist",
    imageTone: "violet",
  },
  {
    id: "monkey-majik",
    title: "Monkey Majik",
    subtitle: "Artist",
    kind: "artist",
    imageTone: "teal",
  },
  {
    id: "daily-mix-1",
    title: "Daily Mix 1",
    subtitle: "Playlist · Alex Morgan",
    kind: "playlist",
    imageTone: "blue",
  },
  {
    id: "daily-mix-2",
    title: "Daily Mix 2",
    subtitle: "Playlist · Alex Morgan",
    kind: "playlist",
    imageTone: "pink",
  },
  {
    id: "daily-mix-3",
    title: "Daily Mix 3",
    subtitle: "Playlist · Alex Morgan",
    kind: "playlist",
    imageTone: "lime",
  },
  {
    id: "daily-mix-4",
    title: "Daily Mix 4",
    subtitle: "Playlist · Alex Morgan",
    kind: "playlist",
    imageTone: "cyan",
  },
  {
    id: "design-system-pod",
    title: "Design Systems Daily",
    subtitle: "Podcast · Longformer",
    kind: "podcast",
    imageTone: "indigo",
  },
  {
    id: "album-eastside",
    title: "Eastside",
    subtitle: "Album · benny blanco",
    kind: "album",
    imageTone: "amber",
  },
];

export const musicQuickAccess: MusicQuickAccess[] = [
  { id: "qa-see-you", title: "See You Again", imageTone: "blue" },
  { id: "qa-jazz", title: "Jazz Classics", imageTone: "amber" },
  { id: "qa-liked", title: "Liked Songs", imageTone: "purple" },
  { id: "qa-daily-6", title: "Daily Mix 6", imageTone: "pink" },
];

export const musicFeatured: MusicFeaturedCard = {
  id: "featured-seasonal",
  sectionTitle: "Seasonal vibes",
  label: "Sponsored recommendation",
  title: "In The Moment",
  description: "EP + JONES — warm grooves and late-night vocals for the end of summer.",
  imageTone: "orange",
};

export const musicMixes: MusicMixCard[] = [
  {
    id: "mix-01",
    number: "01",
    title: "Indie & Alt",
    artists: ["Arctic Monkeys", "The Strokes", "Phoenix"],
    imageTone: "violet",
  },
  {
    id: "mix-02",
    number: "02",
    title: "Electronic Focus",
    artists: ["M83", "Tycho", "Bonobo"],
    imageTone: "cyan",
  },
  {
    id: "mix-03",
    number: "03",
    title: "Pop Hits",
    artists: ["Halsey", "Khalid", "benny blanco"],
    imageTone: "pink",
  },
  {
    id: "mix-04",
    number: "04",
    title: "Late Night Jazz",
    artists: ["Chet Baker", "Bill Evans", "Miles Davis"],
    imageTone: "amber",
  },
];

export const musicNowPlaying: MusicNowPlaying = {
  track: {
    id: "track-eastside",
    title: "Eastside (with Halsey & Khalid)",
    artists: "benny blanco, Halsey, Khalid",
    albumArtTone: "amber",
    duration: "2:50",
    hasVideo: true,
  },
  queueTitle: "See You Again (feat. Charlie Puth)",
  progress: 87,
  elapsed: "2:29",
  relatedVideos: [
    {
      id: "rel-1",
      title: "Eastside",
      artists: "benny blanco, Halsey, Khalid",
      imageTone: "amber",
    },
    {
      id: "rel-2",
      title: "Without Me",
      artists: "Halsey",
      imageTone: "rose",
    },
    {
      id: "rel-3",
      title: "Young Dumb & Broke",
      artists: "Khalid",
      imageTone: "teal",
    },
  ],
};
