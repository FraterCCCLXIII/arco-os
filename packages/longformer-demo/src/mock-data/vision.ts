import type {
  VisionContentRow,
  VisionFeaturedContent,
  VisionNowPlaying,
  VisionUser,
} from "longformer-ui";

export const visionUser: VisionUser = {
  name: "Alex Morgan",
};

export const visionFeatured: VisionFeaturedContent = {
  id: "dept-q",
  kind: "series",
  badge: "N SERIES",
  title: "Dept. Q",
  rankLabel: "#5 in TV Shows Today",
  description:
    "A brilliant but disgraced detective leads a misfit team in Edinburgh's new cold case unit, unraveling mysteries buried for decades.",
  imageTone: "indigo",
};

export const visionRows: VisionContentRow[] = [
  {
    id: "continue",
    title: "Continue Watching",
    variant: "continue",
    items: [
      {
        id: "cw-1",
        title: "Spider-Man: Into the Spider-Verse",
        episodeLabel: "1h 57m left",
        progress: 62,
        imageTone: "rose",
      },
      {
        id: "cw-2",
        title: "Kong: Skull Island",
        episodeLabel: "42m left",
        progress: 28,
        imageTone: "amber",
      },
      {
        id: "cw-3",
        title: "The Martian",
        episodeLabel: "S1 E4 · 18m left",
        progress: 74,
        imageTone: "orange",
      },
      {
        id: "cw-4",
        title: "Dark Matter",
        episodeLabel: "S2 E2 · 55m left",
        progress: 15,
        imageTone: "violet",
      },
      {
        id: "cw-5",
        title: "Syntax FM",
        episodeLabel: "Podcast · 22m left",
        progress: 48,
        imageTone: "teal",
      },
    ],
  },
  {
    id: "top10",
    title: "Top 10 in TV Shows Today",
    variant: "top10",
    items: [
      { id: "t1", rank: 1, title: "Dept. Q", imageTone: "indigo", badge: "Recently Added" },
      { id: "t2", rank: 2, title: "The Night Agent", imageTone: "blue", badge: "Recently Added" },
      { id: "t3", rank: 3, title: "Adolescence", imageTone: "green", badge: "Recently Added" },
      { id: "t4", rank: 4, title: "Zero Day", imageTone: "cyan", badge: "Recently Added" },
      { id: "t5", rank: 5, title: "Black Mirror", imageTone: "purple", badge: "Recently Added" },
      { id: "t6", rank: 6, title: "Severance", imageTone: "teal", badge: "Recently Added" },
    ],
  },
  {
    id: "k-dramas",
    title: "K-Dramas",
    exploreLabel: "Explore All",
    variant: "default",
    items: [
      { id: "kd-1", title: "Squid Game", duration: "Season 2", rating: "8.0", imageTone: "pink" },
      { id: "kd-2", title: "Moving", duration: "20 eps", rating: "8.4", imageTone: "blue" },
      { id: "kd-3", title: "Kingdom", duration: "12 eps", rating: "8.3", imageTone: "amber" },
      { id: "kd-4", title: "Vincenzo", duration: "16 eps", rating: "8.5", imageTone: "violet" },
      { id: "kd-5", title: "Extraordinary Attorney Woo", duration: "16 eps", rating: "8.7", imageTone: "lime" },
      { id: "kd-6", title: "Crash Landing on You", duration: "16 eps", rating: "8.7", imageTone: "rose" },
    ],
  },
  {
    id: "boredom-busters",
    title: "Boredom Busters",
    exploreLabel: "Explore All",
    variant: "default",
    items: [
      { id: "bb-1", title: "Dunkirk", duration: "1h 46m", rating: "7.8", imageTone: "cyan" },
      { id: "bb-2", title: "About Schmidt", duration: "2h 5m", rating: "7.1", imageTone: "orange" },
      { id: "bb-3", title: "The Grand Budapest Hotel", duration: "1h 39m", rating: "8.1", imageTone: "pink" },
      { id: "bb-4", title: "Knives Out", duration: "2h 10m", rating: "7.9", imageTone: "green" },
      { id: "bb-5", title: "Everything Everywhere", duration: "2h 19m", rating: "7.8", imageTone: "purple" },
      { id: "bb-6", title: "Palm Springs", duration: "1h 30m", rating: "7.4", imageTone: "teal" },
    ],
  },
  {
    id: "podcasts",
    title: "Trending Podcasts & Audio",
    exploreLabel: "Explore All",
    variant: "default",
    items: [
      { id: "p-1", title: "Hard Fork", duration: "45m", imageTone: "blue", kind: "podcast" },
      { id: "p-2", title: "Acquired", duration: "3h 12m", imageTone: "indigo", kind: "podcast" },
      { id: "p-3", title: "Syntax", duration: "58m", imageTone: "teal", kind: "podcast" },
      { id: "p-4", title: "Song Exploder", duration: "32m", imageTone: "rose", kind: "podcast" },
      { id: "p-5", title: "Radiolab", duration: "51m", imageTone: "amber", kind: "podcast" },
      { id: "p-6", title: "99% Invisible", duration: "38m", imageTone: "violet", kind: "podcast" },
    ],
  },
  {
    id: "chosen-family",
    title: "Chosen Family",
    exploreLabel: "Explore All",
    variant: "default",
    items: [
      { id: "cf-1", title: "Heartstopper", duration: "3 seasons", rating: "8.6", imageTone: "lime" },
      { id: "cf-2", title: "Schitt's Creek", duration: "6 seasons", rating: "8.5", imageTone: "amber" },
      { id: "cf-3", title: "Ted Lasso", duration: "3 seasons", rating: "8.8", imageTone: "green" },
      { id: "cf-4", title: "Parks and Recreation", duration: "7 seasons", rating: "8.6", imageTone: "cyan" },
      { id: "cf-5", title: "Brooklyn Nine-Nine", duration: "8 seasons", rating: "8.4", imageTone: "blue" },
      { id: "cf-6", title: "The Good Place", duration: "4 seasons", rating: "8.2", imageTone: "purple" },
    ],
  },
];

export const visionNowPlaying: VisionNowPlaying = {
  title: "Kong: Skull Island",
  subtitle: "Action · Adventure · 2017",
  kind: "movie",
  imageTone: "amber",
  progress: 34,
  elapsed: "0:42:18",
  duration: "1:58:00",
};
