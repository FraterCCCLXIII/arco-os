export type CreatorWidgetBackground =
  | "magenta"
  | "sky"
  | "studio"
  | "lavender"
  | "teal"
  | "frost"
  | "sunset"
  | "emerald"
  | "coral";

export type CreatorWidgetVariant =
  | "consultantProfile"
  | "quoteArticle"
  | "streamEpisode"
  | "videoCourse"
  | "liveCourse"
  | "audioPlayer"
  | "workshopEvent"
  | "masterclass"
  | "newsletterSignup"
  | "coachingSlot";

export interface CreatorWidgetConsultantProfile {
  variant: "consultantProfile";
  name: string;
  verified?: boolean;
  available?: boolean;
  priceTier?: string;
  durationValue: string;
  durationLabel: string;
  followerCount?: string;
  rating?: string;
  bio?: string;
  memberNames?: string[];
  primaryAction?: string;
  secondaryAction?: string;
}

export interface CreatorWidgetQuoteArticle {
  variant: "quoteArticle";
  showName: string;
  verified?: boolean;
  subtitle?: string;
  dateValue: string;
  dateLabel: string;
  quote: string;
  downloadLabel?: string;
  readAction?: string;
}

export interface CreatorWidgetStreamEpisode {
  variant: "streamEpisode";
  hostName: string;
  verified?: boolean;
  donateLabel?: string;
  durationValue: string;
  durationLabel: string;
  rating?: string;
  title: string;
  memberNames?: string;
  extraMembers?: string;
  actionLabel?: string;
}

export interface CreatorWidgetVideoCourse {
  variant: "videoCourse";
  showName: string;
  verified?: boolean;
  available?: boolean;
  priceTier?: string;
  episodeCount?: string;
  durationValue: string;
  durationLabel: string;
  adFree?: boolean;
  viewCount?: string;
  rating?: string;
  memberNames?: string[];
  phoneAction?: boolean;
  actionLabel?: string;
}

export interface CreatorWidgetLiveCourse {
  variant: "liveCourse";
  hostName: string;
  verified?: boolean;
  donateLabel?: string;
  sessionCount?: string;
  viewerCount?: string;
  live?: boolean;
  title: string;
  memberNames?: string[];
  primaryAction?: string;
  secondaryAction?: string;
}

export interface CreatorWidgetAudioPlayer {
  variant: "audioPlayer";
  title: string;
  subtitle?: string;
  timeValue: string;
  timeLabel?: string;
  chapterCount?: string;
  description?: string;
  waveform?: number[];
}

export interface CreatorWidgetWorkshopEvent {
  variant: "workshopEvent";
  hostName: string;
  verified?: boolean;
  eventTitle: string;
  countdownValue: string;
  countdownLabel: string;
  spotsLeft?: string;
  memberNames?: string[];
  actionLabel?: string;
}

export interface CreatorWidgetMasterclass {
  variant: "masterclass";
  instructorName: string;
  verified?: boolean;
  courseTitle: string;
  lessonCount?: string;
  price?: string;
  rating?: string;
  durationValue: string;
  durationLabel: string;
  actionLabel?: string;
}

export interface CreatorWidgetNewsletterSignup {
  variant: "newsletterSignup";
  publisherName: string;
  verified?: boolean;
  headline: string;
  subscriberCount?: string;
  issueValue: string;
  issueLabel: string;
  actionLabel?: string;
}

export interface CreatorWidgetCoachingSlot {
  variant: "coachingSlot";
  coachName: string;
  verified?: boolean;
  specialty?: string;
  slotTime: string;
  slotDate: string;
  timezone?: string;
  rating?: string;
  price?: string;
  actionLabel?: string;
}

export type CreatorWidgetProps = (
  | CreatorWidgetConsultantProfile
  | CreatorWidgetQuoteArticle
  | CreatorWidgetStreamEpisode
  | CreatorWidgetVideoCourse
  | CreatorWidgetLiveCourse
  | CreatorWidgetAudioPlayer
  | CreatorWidgetWorkshopEvent
  | CreatorWidgetMasterclass
  | CreatorWidgetNewsletterSignup
  | CreatorWidgetCoachingSlot
) & {
  className?: string;
  background?: CreatorWidgetBackground;
};
