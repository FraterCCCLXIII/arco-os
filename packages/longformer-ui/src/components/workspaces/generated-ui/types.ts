export interface GeneratedCard {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  icon?: import("../../../icons").IconName;
}

export interface GeneratedFormField {
  id: string;
  label: string;
  value: string;
}

export interface GeneratedMediaCard {
  id: string;
  title: string;
  description?: string;
  /** Gradient tone used since agent-generated schemas carry no real photo assets. */
  tone?: import("../../primitives/MediaCard").MediaCardTone;
  badges?: { icon?: import("../../../icons").IconName; label: string }[];
  actionLabel?: string;
}

export interface GeneratedListingCard {
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  price?: string;
  priceMeta?: string;
  actionLabel?: string;
  icon?: import("../../../icons").IconName;
  avatarName?: string;
  saved?: boolean;
}

export interface GeneratedStatCard {
  id: string;
  label: string;
  value: string;
  caption?: string;
  icon?: import("../../../icons").IconName;
  tone?: import("../../primitives/StatCard").StatCardTone;
  visualization?: import("../../primitives/StatCard").StatCardVisualization;
}

export interface GeneratedActivityCard {
  id: string;
  title: string;
  status: { label: string; tone: import("../../primitives/ActivityCard").ActivityStatusTone };
  category?: string;
  amount: string;
  time: string;
  icon?: import("../../../icons").IconName;
  avatarName?: string;
}

export interface GeneratedMetricChartCard {
  id: string;
  label?: string;
  value: string;
  change?: {
    amount: string;
    percent: string;
    caption?: string;
    direction?: "up" | "down";
  };
  chartValues?: number[];
  timeframes?: string[];
  activeTimeframe?: string;
}

export interface GeneratedSelectionTile {
  id: string;
  label: string;
  selected?: boolean;
  size?: import("../../primitives/SelectionTile").SelectionTileSize;
}

export interface GeneratedTimelineStep {
  id: string;
  label: string;
  completed?: boolean;
  showConnector?: boolean;
}

export interface GeneratedRouteCard {
  id: string;
  pickup: { label: string; address: string };
  dropoff: { label: string; address: string };
}

export interface GeneratedProfileSummaryCard {
  id: string;
  avatarName?: string;
  title: string;
  subtitle?: string;
  rating?: string;
  rows?: {
    icon?: import("../../../icons").IconName;
    title: string;
    subtitle?: string;
    trailing?: string;
    trailingMeta?: string;
  }[];
}

export interface GeneratedFilterSection {
  id: string;
  label: string;
  options: { id: string; label: string; selected?: boolean }[];
}

export interface GeneratedSessionCard {
  id: string;
  headline: string;
  avatarName: string;
  title: string;
  subtitle?: string;
  tags?: string[];
}

export interface GeneratedScheduleSlot {
  id: string;
  name: string;
  mode?: string;
  timeRange: string;
  tone?: import("../../primitives/ScheduleSlotCard").ScheduleSlotTone;
}

export interface GeneratedInsightCard {
  id: string;
  label?: string;
  title: string;
  description?: string;
}

export interface GeneratedTimezoneCard {
  id: string;
  rows: {
    city: string;
    time: string;
    period?: string;
    badge?: string;
    offset?: string;
  }[];
}

export interface GeneratedMeetingCountdownCard {
  id: string;
  memberNames?: string[];
  memberCount?: string;
  countdown: string;
  actionLabel?: string;
}

export interface GeneratedEventCard {
  id: string;
  label?: string;
  title: string;
  startTime: string;
  endTime: string;
  timeLeft?: { icon?: import("../../../icons").IconName; label: string };
}

export interface GeneratedDeviceCard {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  statusTone?: import("../../primitives/DeviceCard").DeviceCardTone;
  icon: import("../../../icons").IconName;
  iconTone?: import("../../primitives/DeviceCard").DeviceCardTone;
  progress?: number;
  progressSide?: "left" | "right";
}

export interface GeneratedExpenseCard {
  id: string;
  tone?: import("../../primitives/ExpenseCard").ExpenseCardTone;
  category: string;
  merchant: string;
  amount: string;
  avatarName?: string;
  icon?: import("../../../icons").IconName;
}

export interface GeneratedCourseCard {
  id: string;
  variant?: import("../../primitives/CourseCard").CourseCardVariant;
  title: string;
  subtitle?: string;
  instructor?: string;
  progress?: string;
  actionLabel?: string;
  tone?: "accent" | "neutral" | "warning";
}

export interface GeneratedCryptoMarketRow {
  symbol: string;
  name: string;
  price: string;
  changePercent: string;
  direction?: "up" | "down";
  chartValues?: number[];
  tone?: import("../../primitives/CryptoMarketCard").CryptoMarketTone;
}

export interface GeneratedCryptoMarketCard {
  id: string;
  rows: GeneratedCryptoMarketRow[];
}

export interface GeneratedVpnConnectionCard {
  id: string;
  active?: boolean;
  statusLabel?: string;
  location?: string;
  ipAddress?: string;
  timeConnected?: string;
  download?: { label: string; value: string; chartValues?: number[] };
  upload?: { label: string; value: string; chartValues?: number[] };
}

export interface GeneratedCalendarDay {
  value: string | number;
  muted?: boolean;
  selected?: boolean;
}

export interface GeneratedCalendarScheduleEvent {
  title: string;
  timeRange: string;
  tone?: "accent" | "success" | "warning" | "neutral";
}

export interface GeneratedCalendarScheduleCard {
  id: string;
  monthLabel: string;
  weekdays?: string[];
  days: GeneratedCalendarDay[];
  events?: GeneratedCalendarScheduleEvent[];
}

export interface GeneratedBatteryStatusCard {
  id: string;
  percent: string;
  powerMode?: string;
  timeRemaining?: string;
  tone?: "success" | "accent" | "warning";
}

export interface GeneratedMusicPlayerCard {
  id: string;
  title: string;
  artist?: string;
  sourceLabel?: string;
  imageTone?: "accent" | "neutral" | "warning";
  progress?: number;
  elapsed?: string;
  duration?: string;
  playing?: boolean;
}

export interface GeneratedNewsFeedCard {
  id: string;
  source?: string;
  headline: string;
  excerpt?: string;
  imageTone?: "accent" | "neutral" | "warning";
  stats?: { icon?: import("../../../icons").IconName; label: string }[];
}

export interface GeneratedTaskChecklistItem {
  label: string;
  completed?: boolean;
}

export interface GeneratedTaskChecklistCard {
  id: string;
  tabs?: { id: string; label: string }[];
  activeTab?: string;
  title: string;
  items: GeneratedTaskChecklistItem[];
  progress?: number;
  progressLabel?: string;
  memberNames?: string[];
  actionLabel?: string;
}

export interface GeneratedTranslationPanel {
  language: string;
  flag?: string;
  text: string;
}

export interface GeneratedTranslationCard {
  id: string;
  panels: [GeneratedTranslationPanel, GeneratedTranslationPanel];
}

export interface GeneratedColorSwatch {
  color: string;
  label?: string;
}

export interface GeneratedColorPaletteCard {
  id: string;
  swatches: GeneratedColorSwatch[];
}

export interface GeneratedAssetShowcaseCard {
  id: string;
  title: string;
  description?: string;
  imageTone?: "accent" | "success" | "warning";
  stats?: { icon?: import("../../../icons").IconName; label: string }[];
  creatorName?: string;
  creatorMeta?: string;
  actionLabel?: string;
}

export interface GeneratedFlowReportCard {
  id: string;
  title?: string;
  icon?: import("../../../icons").IconName;
  sources: import("../../primitives/FlowReportCard").FlowReportNode[];
  targets: import("../../primitives/FlowReportCard").FlowReportNode[];
  links?: import("../../primitives/FlowReportCard").FlowReportLink[];
  externalLink?: boolean;
}

export interface GeneratedSavedMoneyCard {
  id: string;
  title?: string;
  subtitle?: string;
  icon?: import("../../../icons").IconName;
  chartValues: number[];
  labels?: string[];
  timeframes?: string[];
  activeTimeframe?: string;
  yMax?: number;
  externalLink?: boolean;
}

export interface GeneratedFearGreedCard {
  id: string;
  title?: string;
  icon?: import("../../../icons").IconName;
  score: number;
  label: string;
  caption?: string;
  leftPercent: number;
  rightPercent: number;
  actionLabel?: string;
}

export interface GeneratedTargetChartCard {
  id: string;
  title?: string;
  icon?: import("../../../icons").IconName;
  months?: string[];
  yLabels?: string[];
  actualValues?: number[];
  targetEnd?: number;
  externalLink?: boolean;
}

export type GeneratedQuizScoreCard = { id: string } & Omit<
  import("../../primitives/QuizScoreCard").QuizScoreCardProps,
  "className"
>;

export type GeneratedTimeSpentCard = { id: string } & Omit<
  import("../../primitives/TimeSpentCard").TimeSpentCardProps,
  "className"
>;

export type GeneratedWeeklyStreakCard = { id: string } & Omit<
  import("../../primitives/WeeklyStreakCard").WeeklyStreakCardProps,
  "className"
>;

export type GeneratedGlobalRankingCard = { id: string } & Omit<
  import("../../primitives/GlobalRankingCard").GlobalRankingCardProps,
  "className"
>;

export type GeneratedEnrollmentChartCard = { id: string } & Omit<
  import("../../primitives/EnrollmentChartCard").EnrollmentChartCardProps,
  "className"
>;

export type GeneratedActiveProjectsCard = { id: string } & Omit<
  import("../../primitives/ActiveProjectsCard").ActiveProjectsCardProps,
  "className"
>;

export type GeneratedMiniStatChartCard = { id: string } & Omit<
  import("../../primitives/MiniStatChartCard").MiniStatChartCardProps,
  "className"
>;

export type GeneratedStatisticsProgressCard = { id: string } & Omit<
  import("../../primitives/StatisticsProgressCard").StatisticsProgressCardProps,
  "className"
>;

export type GeneratedSalesOverviewCard = { id: string } & Omit<
  import("../../primitives/SalesOverviewCard").SalesOverviewCardProps,
  "className"
>;

export type GeneratedWebinarCtaCard = { id: string } & Omit<
  import("../../primitives/WebinarCtaCard").WebinarCtaCardProps,
  "className"
>;

export type GeneratedExpenseGaugeCard = { id: string } & Omit<
  import("../../primitives/ExpenseGaugeCard").ExpenseGaugeCardProps,
  "className"
>;

export type GeneratedEarningReportsCard = { id: string } & Omit<
  import("../../primitives/EarningReportsCard").EarningReportsCardProps,
  "className"
>;

export type GeneratedSubscribersChartCard = { id: string } & Omit<
  import("../../primitives/SubscribersChartCard").SubscribersChartCardProps,
  "className"
>;

export type GeneratedSpentThisMonthCard = { id: string } & Omit<
  import("../../primitives/SpentThisMonthCard").SpentThisMonthCardProps,
  "className"
>;

export type GeneratedProfileGridCard = { id: string } & Omit<
  import("../../primitives/ProfileGridCard").ProfileGridCardProps,
  "className"
>;

export type GeneratedDesignCard =
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardFlight)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardOrder)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardGlucose)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardDelivery)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardEspresso)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardIss)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardWorkout)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardRace)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardTransit)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardHeartRate)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardSleep)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardSubwayNav)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardWishlist)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardWeeklyRings)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardPodcast)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardWeather)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardNetwork)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardSportsScore)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardBilling)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardActivityGoals)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardAirpods)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardLaundry)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardStockQuote)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardStockActivity)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardAmazonBuy)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardAmazonActions)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardPriceAlert)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardStatusSpendings)
  | ({ id: string } & import("../../primitives/DesignCard").DesignCardStatusCrypto);

type GeneratedGlassWidgetShared = {
  id: string;
  size?: "sm" | "md" | "lg";
  theme?: import("../../primitives/GlassWidget").GlassWidgetTheme;
};

export type GeneratedGlassWidget =
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetWifi)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetHabits)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetGateInfo)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetAudioRecording)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetAnalogClock)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetCameraRecording)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetTimezone)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetRideShare)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetCharging)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetFlightArrival)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetNavigation)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetEnergyUsage)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetMusic)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetScooterRide)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetActivityOverview)
  | (GeneratedGlassWidgetShared & import("../../primitives/GlassWidget").GlassWidgetActivityCalendar);

type GeneratedCreatorWidgetShared = {
  id: string;
  background?: import("../../primitives/CreatorWidget").CreatorWidgetBackground;
};

export type GeneratedCreatorWidget =
  | (GeneratedCreatorWidgetShared & import("../../primitives/CreatorWidget").CreatorWidgetConsultantProfile)
  | (GeneratedCreatorWidgetShared & import("../../primitives/CreatorWidget").CreatorWidgetQuoteArticle)
  | (GeneratedCreatorWidgetShared & import("../../primitives/CreatorWidget").CreatorWidgetStreamEpisode)
  | (GeneratedCreatorWidgetShared & import("../../primitives/CreatorWidget").CreatorWidgetVideoCourse)
  | (GeneratedCreatorWidgetShared & import("../../primitives/CreatorWidget").CreatorWidgetLiveCourse)
  | (GeneratedCreatorWidgetShared & import("../../primitives/CreatorWidget").CreatorWidgetAudioPlayer)
  | (GeneratedCreatorWidgetShared & import("../../primitives/CreatorWidget").CreatorWidgetWorkshopEvent)
  | (GeneratedCreatorWidgetShared & import("../../primitives/CreatorWidget").CreatorWidgetMasterclass)
  | (GeneratedCreatorWidgetShared & import("../../primitives/CreatorWidget").CreatorWidgetNewsletterSignup)
  | (GeneratedCreatorWidgetShared & import("../../primitives/CreatorWidget").CreatorWidgetCoachingSlot);

export type GeneratedBlock =
  | { id: string; type: "text"; text: string; tone?: "default" | "muted" | "heading" }
  | { id: string; type: "cardGrid"; title?: string; cards: GeneratedCard[] }
  | { id: string; type: "mediaCards"; title?: string; cards: GeneratedMediaCard[] }
  | { id: string; type: "listingCards"; title?: string; cards: GeneratedListingCard[] }
  | { id: string; type: "statCards"; title?: string; cards: GeneratedStatCard[] }
  | { id: string; type: "activityCards"; title?: string; cards: GeneratedActivityCard[] }
  | { id: string; type: "metricChartCards"; title?: string; cards: GeneratedMetricChartCard[] }
  | { id: string; type: "selectionTiles"; title?: string; tiles: GeneratedSelectionTile[] }
  | { id: string; type: "timelineSteps"; title?: string; steps: GeneratedTimelineStep[] }
  | { id: string; type: "routeCards"; title?: string; cards: GeneratedRouteCard[] }
  | { id: string; type: "profileSummaryCards"; title?: string; cards: GeneratedProfileSummaryCard[] }
  | { id: string; type: "filterSections"; title?: string; sections: GeneratedFilterSection[] }
  | { id: string; type: "sessionCards"; title?: string; cards: GeneratedSessionCard[] }
  | { id: string; type: "scheduleSlots"; title?: string; slots: GeneratedScheduleSlot[] }
  | { id: string; type: "insightCards"; title?: string; cards: GeneratedInsightCard[] }
  | { id: string; type: "timezoneCards"; title?: string; cards: GeneratedTimezoneCard[] }
  | { id: string; type: "meetingCountdownCards"; title?: string; cards: GeneratedMeetingCountdownCard[] }
  | { id: string; type: "eventCards"; title?: string; cards: GeneratedEventCard[] }
  | { id: string; type: "deviceCards"; title?: string; cards: GeneratedDeviceCard[] }
  | { id: string; type: "expenseCards"; title?: string; cards: GeneratedExpenseCard[] }
  | { id: string; type: "courseCards"; title?: string; cards: GeneratedCourseCard[] }
  | { id: string; type: "cryptoMarketCards"; title?: string; cards: GeneratedCryptoMarketCard[] }
  | { id: string; type: "vpnConnectionCards"; title?: string; cards: GeneratedVpnConnectionCard[] }
  | { id: string; type: "calendarScheduleCards"; title?: string; cards: GeneratedCalendarScheduleCard[] }
  | { id: string; type: "batteryStatusCards"; title?: string; cards: GeneratedBatteryStatusCard[] }
  | { id: string; type: "musicPlayerCards"; title?: string; cards: GeneratedMusicPlayerCard[] }
  | { id: string; type: "newsFeedCards"; title?: string; cards: GeneratedNewsFeedCard[] }
  | { id: string; type: "taskChecklistCards"; title?: string; cards: GeneratedTaskChecklistCard[] }
  | { id: string; type: "translationCards"; title?: string; cards: GeneratedTranslationCard[] }
  | { id: string; type: "colorPaletteCards"; title?: string; cards: GeneratedColorPaletteCard[] }
  | { id: string; type: "assetShowcaseCards"; title?: string; cards: GeneratedAssetShowcaseCard[] }
  | { id: string; type: "designCards"; title?: string; cards: GeneratedDesignCard[] }
  | { id: string; type: "glassWidgets"; title?: string; widgets: GeneratedGlassWidget[] }
  | { id: string; type: "creatorWidgets"; title?: string; widgets: GeneratedCreatorWidget[] }
  | {
      id: string;
      type: "cardCollection";
      title?: string;
      subtitle?: string;
      layout: import("../../primitives/CardCollection").CardCollectionLayout;
      itemHeight?: number;
      items: import("../../primitives/CardCollection").CardCollectionItem[];
    }
  | { id: string; type: "flowReportCards"; title?: string; cards: GeneratedFlowReportCard[] }
  | { id: string; type: "savedMoneyCards"; title?: string; cards: GeneratedSavedMoneyCard[] }
  | { id: string; type: "fearGreedCards"; title?: string; cards: GeneratedFearGreedCard[] }
  | { id: string; type: "targetChartCards"; title?: string; cards: GeneratedTargetChartCard[] }
  | { id: string; type: "quizScoreCards"; title?: string; cards: GeneratedQuizScoreCard[] }
  | { id: string; type: "timeSpentCards"; title?: string; cards: GeneratedTimeSpentCard[] }
  | { id: string; type: "weeklyStreakCards"; title?: string; cards: GeneratedWeeklyStreakCard[] }
  | { id: string; type: "globalRankingCards"; title?: string; cards: GeneratedGlobalRankingCard[] }
  | { id: string; type: "enrollmentChartCards"; title?: string; cards: GeneratedEnrollmentChartCard[] }
  | { id: string; type: "activeProjectsCards"; title?: string; cards: GeneratedActiveProjectsCard[] }
  | { id: string; type: "miniStatChartCards"; title?: string; cards: GeneratedMiniStatChartCard[] }
  | { id: string; type: "statisticsProgressCards"; title?: string; cards: GeneratedStatisticsProgressCard[] }
  | { id: string; type: "salesOverviewCards"; title?: string; cards: GeneratedSalesOverviewCard[] }
  | { id: string; type: "webinarCtaCards"; title?: string; cards: GeneratedWebinarCtaCard[] }
  | { id: string; type: "expenseGaugeCards"; title?: string; cards: GeneratedExpenseGaugeCard[] }
  | { id: string; type: "earningReportsCards"; title?: string; cards: GeneratedEarningReportsCard[] }
  | { id: string; type: "subscribersChartCards"; title?: string; cards: GeneratedSubscribersChartCard[] }
  | { id: string; type: "spentThisMonthCards"; title?: string; cards: GeneratedSpentThisMonthCard[] }
  | { id: string; type: "profileGridCards"; title?: string; cards: GeneratedProfileGridCard[] }
  | { id: string; type: "phoneHomeScreen"; title?: string; pageCount?: number; carrier?: string; wallpaperUrl?: string }
  | { id: string; type: "form"; title?: string; fields: GeneratedFormField[] }
  | { id: string; type: "code"; language?: string; code: string }
  | { id: string; type: "terminal"; lines: string[] };

/**
 * The shape an agent (OpenHands-style) would stream down to render
 * arbitrary UI inline — this is intentionally plain data (no functions),
 * so it can come straight off a JSON wire payload.
 */
export interface GeneratedSurfaceSchema {
  id: string;
  blocks: GeneratedBlock[];
}
