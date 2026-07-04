/**
 * Block registry — the one table every generated-UI concern reads from.
 *
 * The renderer looks up components here, the validator looks up schemas, the
 * design-system catalog looks up families, and the agent prompt quotes the
 * descriptions. `satisfies` on the map makes the registry total: adding a
 * type to the `GeneratedBlock` union without registering it is a compile
 * error, as is registering a type the union doesn't know.
 */
import type { GeneratedBlock } from "../types";
import {
  ActiveProjectsCardsBlock,
  ActivityCardsBlock,
  AssetShowcaseCardsBlock,
  BatteryStatusCardsBlock,
  CalendarScheduleCardsBlock,
  CardCollectionBlock,
  CardGridBlock,
  CodeBlock,
  ColorPaletteCardsBlock,
  CourseCardsBlock,
  CreatorWidgetsBlock,
  CryptoMarketCardsBlock,
  DesignCardsBlock,
  DeviceCardsBlock,
  EarningReportsCardsBlock,
  EnrollmentChartCardsBlock,
  EventCardsBlock,
  ExpenseCardsBlock,
  ExpenseGaugeCardsBlock,
  FearGreedCardsBlock,
  FilterSectionsBlock,
  FlowReportCardsBlock,
  FormBlock,
  GlassWidgetsBlock,
  GlobalRankingCardsBlock,
  InsightCardsBlock,
  ListingCardsBlock,
  MediaCardsBlock,
  MeetingCountdownCardsBlock,
  MetricChartCardsBlock,
  MiniStatChartCardsBlock,
  MusicPlayerCardsBlock,
  NewsFeedCardsBlock,
  PhoneHomeScreenBlock,
  ProfileGridCardsBlock,
  ProfileSummaryCardsBlock,
  QuizScoreCardsBlock,
  RouteCardsBlock,
  SalesOverviewCardsBlock,
  SavedMoneyCardsBlock,
  ScheduleSlotsBlock,
  SelectionTilesBlock,
  SessionCardsBlock,
  SpentThisMonthCardsBlock,
  StatCardsBlock,
  StatisticsProgressCardsBlock,
  SubscribersChartCardsBlock,
  TargetChartCardsBlock,
  TaskChecklistCardsBlock,
  TerminalBlock,
  TextBlock,
  TimeSpentCardsBlock,
  TimelineStepsBlock,
  TimezoneCardsBlock,
  TranslationCardsBlock,
  VideoPlayerCardsBlock,
  VpnConnectionCardsBlock,
  WebinarCtaCardsBlock,
  WeeklyStreakCardsBlock,
} from "../blocks";
import { defineBlock, looseBlockSchema, type BlockDefinition } from "./defineBlock";
import {
  cardGridBlockSchema,
  codeBlockSchema,
  eventCardsBlockSchema,
  formBlockSchema,
  insightCardsBlockSchema,
  listingCardsBlockSchema,
  mediaCardsBlockSchema,
  scheduleSlotsBlockSchema,
  selectionTilesBlockSchema,
  statCardsBlockSchema,
  taskChecklistCardsBlockSchema,
  terminalBlockSchema,
  textBlockSchema,
  timelineStepsBlockSchema,
} from "./schemas";

// ---------------------------------------------------------------------------
// The registry table
//
// Strict entries validate the full payload (pilot set); loose entries only
// check the `{ id, type }` envelope and migrate to strict schemas over time.
// ---------------------------------------------------------------------------

export const BLOCK_REGISTRY = {
  // --- Utility (text, forms, developer output) ---
  text: defineBlock({
    type: "text",
    description: "A paragraph or heading of plain text.",
    family: "utility",
    schema: textBlockSchema,
    strict: true,
    Component: TextBlock,
  }),
  form: defineBlock({
    type: "form",
    description: "A read-only summary of labeled form fields and their values.",
    family: "utility",
    schema: formBlockSchema,
    strict: true,
    Component: FormBlock,
  }),
  code: defineBlock({
    type: "code",
    description: "A syntax-styled code snippet with optional language label.",
    family: "utility",
    schema: codeBlockSchema,
    strict: true,
    Component: CodeBlock,
  }),
  terminal: defineBlock({
    type: "terminal",
    description: "Monospaced terminal output, one string per line.",
    family: "utility",
    schema: terminalBlockSchema,
    strict: true,
    Component: TerminalBlock,
  }),
  phoneHomeScreen: defineBlock({
    type: "phoneHomeScreen",
    description: "A phone home-screen mockup with app grid and wallpaper.",
    family: "utility",
    schema: looseBlockSchema("phoneHomeScreen"),
    strict: false,
    Component: PhoneHomeScreenBlock,
  }),

  // --- Metrics & charts ---
  statCards: defineBlock({
    type: "statCards",
    description: "Compact KPI tiles: label, headline value, optional ring/bars/dots visualization.",
    family: "metrics",
    schema: statCardsBlockSchema,
    strict: true,
    Component: StatCardsBlock,
  }),
  metricChartCards: defineBlock({
    type: "metricChartCards",
    description: "A metric with change indicator and an area sparkline over selectable timeframes.",
    family: "metrics",
    schema: looseBlockSchema("metricChartCards"),
    strict: false,
    Component: MetricChartCardsBlock,
  }),
  miniStatChartCards: defineBlock({
    type: "miniStatChartCards",
    description: "Small stat tiles with an inline mini bar/line chart.",
    family: "metrics",
    schema: looseBlockSchema("miniStatChartCards"),
    strict: false,
    Component: MiniStatChartCardsBlock,
  }),
  statisticsProgressCards: defineBlock({
    type: "statisticsProgressCards",
    description: "A statistics summary with segmented progress bars per category.",
    family: "metrics",
    schema: looseBlockSchema("statisticsProgressCards"),
    strict: false,
    Component: StatisticsProgressCardsBlock,
  }),
  targetChartCards: defineBlock({
    type: "targetChartCards",
    description: "An actual-versus-target line chart across months.",
    family: "metrics",
    schema: looseBlockSchema("targetChartCards"),
    strict: false,
    Component: TargetChartCardsBlock,
  }),
  quizScoreCards: defineBlock({
    type: "quizScoreCards",
    description: "A quiz or assessment score with a ring gauge.",
    family: "metrics",
    schema: looseBlockSchema("quizScoreCards"),
    strict: false,
    Component: QuizScoreCardsBlock,
  }),
  timeSpentCards: defineBlock({
    type: "timeSpentCards",
    description: "Time-spent totals with a weekly bar breakdown.",
    family: "metrics",
    schema: looseBlockSchema("timeSpentCards"),
    strict: false,
    Component: TimeSpentCardsBlock,
  }),
  weeklyStreakCards: defineBlock({
    type: "weeklyStreakCards",
    description: "A weekly streak tracker with per-day completion dots.",
    family: "metrics",
    schema: looseBlockSchema("weeklyStreakCards"),
    strict: false,
    Component: WeeklyStreakCardsBlock,
  }),
  globalRankingCards: defineBlock({
    type: "globalRankingCards",
    description: "A leaderboard-style global ranking readout.",
    family: "metrics",
    schema: looseBlockSchema("globalRankingCards"),
    strict: false,
    Component: GlobalRankingCardsBlock,
  }),
  enrollmentChartCards: defineBlock({
    type: "enrollmentChartCards",
    description: "Enrollment or signup trends as a bar chart with summary stats.",
    family: "metrics",
    schema: looseBlockSchema("enrollmentChartCards"),
    strict: false,
    Component: EnrollmentChartCardsBlock,
  }),

  // --- Commerce & listings ---
  cardGrid: defineBlock({
    type: "cardGrid",
    description: "A responsive grid of simple title/description cards with optional badge and icon.",
    family: "commerce",
    schema: cardGridBlockSchema,
    strict: true,
    Component: CardGridBlock,
  }),
  mediaCards: defineBlock({
    type: "mediaCards",
    description: "Media/product cards with a gradient hero, badges, and an action button.",
    family: "commerce",
    schema: mediaCardsBlockSchema,
    strict: true,
    Component: MediaCardsBlock,
  }),
  listingCards: defineBlock({
    type: "listingCards",
    description: "Marketplace listing rows: title, tags, price, and a save/action affordance.",
    family: "commerce",
    schema: listingCardsBlockSchema,
    strict: true,
    Component: ListingCardsBlock,
  }),
  assetShowcaseCards: defineBlock({
    type: "assetShowcaseCards",
    description: "A featured asset showcase with creator attribution and stats.",
    family: "commerce",
    schema: looseBlockSchema("assetShowcaseCards"),
    strict: false,
    Component: AssetShowcaseCardsBlock,
  }),

  // --- Finance & markets ---
  expenseCards: defineBlock({
    type: "expenseCards",
    description: "Individual expense rows with category, merchant, and amount.",
    family: "finance",
    schema: looseBlockSchema("expenseCards"),
    strict: false,
    Component: ExpenseCardsBlock,
  }),
  cryptoMarketCards: defineBlock({
    type: "cryptoMarketCards",
    description: "A crypto market table: symbol, price, percent change, sparkline.",
    family: "finance",
    schema: looseBlockSchema("cryptoMarketCards"),
    strict: false,
    Component: CryptoMarketCardsBlock,
  }),
  flowReportCards: defineBlock({
    type: "flowReportCards",
    description: "A money-flow Sankey report from sources to targets.",
    family: "finance",
    schema: looseBlockSchema("flowReportCards"),
    strict: false,
    Component: FlowReportCardsBlock,
  }),
  savedMoneyCards: defineBlock({
    type: "savedMoneyCards",
    description: "A savings trend area chart with timeframe tabs.",
    family: "finance",
    schema: looseBlockSchema("savedMoneyCards"),
    strict: false,
    Component: SavedMoneyCardsBlock,
  }),
  fearGreedCards: defineBlock({
    type: "fearGreedCards",
    description: "A fear/greed sentiment gauge with score and label.",
    family: "finance",
    schema: looseBlockSchema("fearGreedCards"),
    strict: false,
    Component: FearGreedCardsBlock,
  }),
  expenseGaugeCards: defineBlock({
    type: "expenseGaugeCards",
    description: "A semicircle gauge of spending against a budget.",
    family: "finance",
    schema: looseBlockSchema("expenseGaugeCards"),
    strict: false,
    Component: ExpenseGaugeCardsBlock,
  }),
  earningReportsCards: defineBlock({
    type: "earningReportsCards",
    description: "An earnings report summary with weekly bars and deltas.",
    family: "finance",
    schema: looseBlockSchema("earningReportsCards"),
    strict: false,
    Component: EarningReportsCardsBlock,
  }),
  salesOverviewCards: defineBlock({
    type: "salesOverviewCards",
    description: "A sales overview with headline totals and category split.",
    family: "finance",
    schema: looseBlockSchema("salesOverviewCards"),
    strict: false,
    Component: SalesOverviewCardsBlock,
  }),
  spentThisMonthCards: defineBlock({
    type: "spentThisMonthCards",
    description: "Month-to-date spend with a daily bar breakdown.",
    family: "finance",
    schema: looseBlockSchema("spentThisMonthCards"),
    strict: false,
    Component: SpentThisMonthCardsBlock,
  }),

  // --- Productivity ---
  taskChecklistCards: defineBlock({
    type: "taskChecklistCards",
    description: "A task checklist with completion states, progress bar, and members.",
    family: "productivity",
    schema: taskChecklistCardsBlockSchema,
    strict: true,
    Component: TaskChecklistCardsBlock,
  }),
  calendarScheduleCards: defineBlock({
    type: "calendarScheduleCards",
    description: "A month calendar with a list of upcoming events.",
    family: "productivity",
    schema: looseBlockSchema("calendarScheduleCards"),
    strict: false,
    Component: CalendarScheduleCardsBlock,
  }),
  eventCards: defineBlock({
    type: "eventCards",
    description: "Event tiles with title, start/end time, and time-remaining hint.",
    family: "productivity",
    schema: eventCardsBlockSchema,
    strict: true,
    Component: EventCardsBlock,
  }),
  scheduleSlots: defineBlock({
    type: "scheduleSlots",
    description: "Bookable schedule slots with name, mode, and time range.",
    family: "productivity",
    schema: scheduleSlotsBlockSchema,
    strict: true,
    Component: ScheduleSlotsBlock,
  }),
  routeCards: defineBlock({
    type: "routeCards",
    description: "A pickup-to-dropoff route summary card.",
    family: "productivity",
    schema: looseBlockSchema("routeCards"),
    strict: false,
    Component: RouteCardsBlock,
  }),
  meetingCountdownCards: defineBlock({
    type: "meetingCountdownCards",
    description: "A meeting countdown with member avatars and a join action.",
    family: "productivity",
    schema: looseBlockSchema("meetingCountdownCards"),
    strict: false,
    Component: MeetingCountdownCardsBlock,
  }),
  timelineSteps: defineBlock({
    type: "timelineSteps",
    description: "A vertical step timeline with completed/pending states.",
    family: "productivity",
    schema: timelineStepsBlockSchema,
    strict: true,
    Component: TimelineStepsBlock,
  }),
  selectionTiles: defineBlock({
    type: "selectionTiles",
    description: "Tappable selection tiles (chips) in mixed sizes.",
    family: "productivity",
    schema: selectionTilesBlockSchema,
    strict: true,
    Component: SelectionTilesBlock,
  }),

  // --- Social & content ---
  sessionCards: defineBlock({
    type: "sessionCards",
    description: "A session/booking card with host avatar, headline, and tags.",
    family: "social",
    schema: looseBlockSchema("sessionCards"),
    strict: false,
    Component: SessionCardsBlock,
  }),
  profileSummaryCards: defineBlock({
    type: "profileSummaryCards",
    description: "A person summary: avatar, rating, and detail rows.",
    family: "social",
    schema: looseBlockSchema("profileSummaryCards"),
    strict: false,
    Component: ProfileSummaryCardsBlock,
  }),
  profileGridCards: defineBlock({
    type: "profileGridCards",
    description: "A grid of member/profile tiles.",
    family: "social",
    schema: looseBlockSchema("profileGridCards"),
    strict: false,
    Component: ProfileGridCardsBlock,
  }),
  newsFeedCards: defineBlock({
    type: "newsFeedCards",
    description: "News feed entries with source, headline, excerpt, and stats.",
    family: "social",
    schema: looseBlockSchema("newsFeedCards"),
    strict: false,
    Component: NewsFeedCardsBlock,
  }),
  musicPlayerCards: defineBlock({
    type: "musicPlayerCards",
    description: "A now-playing music card with progress and transport controls.",
    family: "social",
    schema: looseBlockSchema("musicPlayerCards"),
    strict: false,
    Component: MusicPlayerCardsBlock,
  }),
  videoPlayerCards: defineBlock({
    type: "videoPlayerCards",
    description: "A video player card with scrubber and watch-again state.",
    family: "social",
    schema: looseBlockSchema("videoPlayerCards"),
    strict: false,
    Component: VideoPlayerCardsBlock,
  }),
  translationCards: defineBlock({
    type: "translationCards",
    description: "A two-panel translation card, source and target language.",
    family: "social",
    schema: looseBlockSchema("translationCards"),
    strict: false,
    Component: TranslationCardsBlock,
  }),
  insightCards: defineBlock({
    type: "insightCards",
    description: "Short labeled insight callouts with title and description.",
    family: "social",
    schema: insightCardsBlockSchema,
    strict: true,
    Component: InsightCardsBlock,
  }),
  courseCards: defineBlock({
    type: "courseCards",
    description: "Course tiles with instructor, progress, and enroll action.",
    family: "social",
    schema: looseBlockSchema("courseCards"),
    strict: false,
    Component: CourseCardsBlock,
  }),

  // --- Device & system ---
  deviceCards: defineBlock({
    type: "deviceCards",
    description: "Smart-device status tiles with icon, state, and progress.",
    family: "device",
    schema: looseBlockSchema("deviceCards"),
    strict: false,
    Component: DeviceCardsBlock,
  }),
  batteryStatusCards: defineBlock({
    type: "batteryStatusCards",
    description: "A battery level card with power mode and time remaining.",
    family: "device",
    schema: looseBlockSchema("batteryStatusCards"),
    strict: false,
    Component: BatteryStatusCardsBlock,
  }),
  vpnConnectionCards: defineBlock({
    type: "vpnConnectionCards",
    description: "A VPN connection status card with throughput sparklines.",
    family: "device",
    schema: looseBlockSchema("vpnConnectionCards"),
    strict: false,
    Component: VpnConnectionCardsBlock,
  }),
  timezoneCards: defineBlock({
    type: "timezoneCards",
    description: "World-clock rows showing cities, times, and offsets.",
    family: "device",
    schema: looseBlockSchema("timezoneCards"),
    strict: false,
    Component: TimezoneCardsBlock,
  }),
  activityCards: defineBlock({
    type: "activityCards",
    description: "Transaction/activity rows with status badge, amount, and time.",
    family: "device",
    schema: looseBlockSchema("activityCards"),
    strict: false,
    Component: ActivityCardsBlock,
  }),

  // --- Dashboard analytics ---
  activeProjectsCards: defineBlock({
    type: "activeProjectsCards",
    description: "An active-projects dashboard card with per-project progress.",
    family: "dashboard",
    schema: looseBlockSchema("activeProjectsCards"),
    strict: false,
    Component: ActiveProjectsCardsBlock,
  }),
  subscribersChartCards: defineBlock({
    type: "subscribersChartCards",
    description: "Subscriber growth as a bar chart with a headline delta.",
    family: "dashboard",
    schema: looseBlockSchema("subscribersChartCards"),
    strict: false,
    Component: SubscribersChartCardsBlock,
  }),
  webinarCtaCards: defineBlock({
    type: "webinarCtaCards",
    description: "A webinar/event call-to-action card with date and join button.",
    family: "dashboard",
    schema: looseBlockSchema("webinarCtaCards"),
    strict: false,
    Component: WebinarCtaCardsBlock,
  }),
  filterSections: defineBlock({
    type: "filterSections",
    description: "Grouped filter options with multi-select chips.",
    family: "dashboard",
    schema: looseBlockSchema("filterSections"),
    strict: false,
    Component: FilterSectionsBlock,
  }),

  // --- Design & media ---
  colorPaletteCards: defineBlock({
    type: "colorPaletteCards",
    description: "A color palette strip of labeled swatches.",
    family: "design-media",
    schema: looseBlockSchema("colorPaletteCards"),
    strict: false,
    Component: ColorPaletteCardsBlock,
  }),
  designCards: defineBlock({
    type: "designCards",
    description: "Rich showcase cards (flight, order, weather, workout…) in many variants.",
    family: "design-media",
    schema: looseBlockSchema("designCards"),
    strict: false,
    Component: DesignCardsBlock,
  }),

  // --- Collections & widget tiers ---
  cardCollection: defineBlock({
    type: "cardCollection",
    description: "A responsive grid/carousel of mixed widget tiles.",
    family: "collections",
    schema: looseBlockSchema("cardCollection"),
    strict: false,
    Component: CardCollectionBlock,
  }),
  glassWidgets: defineBlock({
    type: "glassWidgets",
    description: "Frosted phone-style ambient widgets (clock, wifi, habits…).",
    family: "glass-widgets",
    schema: looseBlockSchema("glassWidgets"),
    strict: false,
    Component: GlassWidgetsBlock,
  }),
  creatorWidgets: defineBlock({
    type: "creatorWidgets",
    description: "Creator-economy widgets: courses, streams, newsletters, coaching.",
    family: "creator-widgets",
    schema: looseBlockSchema("creatorWidgets"),
    strict: false,
    Component: CreatorWidgetsBlock,
  }),
} satisfies { [T in GeneratedBlock["type"]]: BlockDefinition<T> };

export type BlockRegistry = typeof BLOCK_REGISTRY;

/** All registered block types, in registry declaration order. */
export const BLOCK_TYPES = Object.keys(BLOCK_REGISTRY) as GeneratedBlock["type"][];

/**
 * Look up a definition by wire type. Returns undefined for unknown strings so
 * callers validating untrusted agent JSON can report rather than crash.
 */
export function blockDefinition(type: string): BlockDefinition | undefined {
  return (BLOCK_REGISTRY as Record<string, BlockDefinition>)[type];
}

/** Block types that belong to an ontology family — drives catalog grouping. */
export function blockTypesForFamily(family: BlockDefinition["family"]): GeneratedBlock["type"][] {
  return BLOCK_TYPES.filter((type) => BLOCK_REGISTRY[type].family === family);
}

/**
 * Render the registry as prompt text: one line per block type with its
 * description, so an agent knows the full vocabulary it may emit.
 */
export function describeBlockCatalog(): string {
  return BLOCK_TYPES.map((type) => `- ${type}: ${BLOCK_REGISTRY[type].description}`).join("\n");
}
