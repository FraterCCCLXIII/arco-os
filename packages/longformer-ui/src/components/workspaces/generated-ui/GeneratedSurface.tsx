import {
  TextBlock,
  CardGridBlock,
  CardCollectionBlock,
  MediaCardsBlock,
  ListingCardsBlock,
  StatCardsBlock,
  ActivityCardsBlock,
  MetricChartCardsBlock,
  SelectionTilesBlock,
  TimelineStepsBlock,
  RouteCardsBlock,
  ProfileGridCardsBlock,
  ProfileSummaryCardsBlock,
  FilterSectionsBlock,
  SessionCardsBlock,
  ScheduleSlotsBlock,
  InsightCardsBlock,
  TimezoneCardsBlock,
  MeetingCountdownCardsBlock,
  EventCardsBlock,
  DeviceCardsBlock,
  ExpenseCardsBlock,
  CourseCardsBlock,
  CryptoMarketCardsBlock,
  VpnConnectionCardsBlock,
  CalendarScheduleCardsBlock,
  BatteryStatusCardsBlock,
  MusicPlayerCardsBlock,
  VideoPlayerCardsBlock,
  NewsFeedCardsBlock,
  TaskChecklistCardsBlock,
  TranslationCardsBlock,
  ColorPaletteCardsBlock,
  AssetShowcaseCardsBlock,
  DesignCardsBlock,
  GlassWidgetsBlock,
  CreatorWidgetsBlock,
  FlowReportCardsBlock,
  SavedMoneyCardsBlock,
  FearGreedCardsBlock,
  TargetChartCardsBlock,
  QuizScoreCardsBlock,
  TimeSpentCardsBlock,
  WeeklyStreakCardsBlock,
  GlobalRankingCardsBlock,
  EnrollmentChartCardsBlock,
  ActiveProjectsCardsBlock,
  MiniStatChartCardsBlock,
  StatisticsProgressCardsBlock,
  SalesOverviewCardsBlock,
  WebinarCtaCardsBlock,
  ExpenseGaugeCardsBlock,
  EarningReportsCardsBlock,
  SpentThisMonthCardsBlock,
  SubscribersChartCardsBlock,
  PhoneHomeScreenBlock,
  FormBlock,
  CodeBlock,
  TerminalBlock,
} from "./blocks";
import type { GeneratedSurfaceSchema } from "./types";

export interface GeneratedSurfaceProps {
  schema: GeneratedSurfaceSchema;
}

/**
 * Renders a plain-data block schema into UI. This is the piece that makes
 * "generated in-line UI" possible: an agent only needs to produce
 * `GeneratedBlock[]` JSON and this component turns it into real, styled
 * Longformer UI — no bespoke components required per response.
 */
export function GeneratedSurface({ schema }: GeneratedSurfaceProps) {
  return (
    <div>
      {schema.blocks.map((block) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={block.id} block={block} />;
          case "cardGrid":
            return <CardGridBlock key={block.id} block={block} />;
          case "mediaCards":
            return <MediaCardsBlock key={block.id} block={block} />;
          case "listingCards":
            return <ListingCardsBlock key={block.id} block={block} />;
          case "statCards":
            return <StatCardsBlock key={block.id} block={block} />;
          case "activityCards":
            return <ActivityCardsBlock key={block.id} block={block} />;
          case "metricChartCards":
            return <MetricChartCardsBlock key={block.id} block={block} />;
          case "selectionTiles":
            return <SelectionTilesBlock key={block.id} block={block} />;
          case "timelineSteps":
            return <TimelineStepsBlock key={block.id} block={block} />;
          case "routeCards":
            return <RouteCardsBlock key={block.id} block={block} />;
          case "profileSummaryCards":
            return <ProfileSummaryCardsBlock key={block.id} block={block} />;
          case "profileGridCards":
            return <ProfileGridCardsBlock key={block.id} block={block} />;
          case "filterSections":
            return <FilterSectionsBlock key={block.id} block={block} />;
          case "sessionCards":
            return <SessionCardsBlock key={block.id} block={block} />;
          case "scheduleSlots":
            return <ScheduleSlotsBlock key={block.id} block={block} />;
          case "insightCards":
            return <InsightCardsBlock key={block.id} block={block} />;
          case "timezoneCards":
            return <TimezoneCardsBlock key={block.id} block={block} />;
          case "meetingCountdownCards":
            return <MeetingCountdownCardsBlock key={block.id} block={block} />;
          case "eventCards":
            return <EventCardsBlock key={block.id} block={block} />;
          case "deviceCards":
            return <DeviceCardsBlock key={block.id} block={block} />;
          case "expenseCards":
            return <ExpenseCardsBlock key={block.id} block={block} />;
          case "courseCards":
            return <CourseCardsBlock key={block.id} block={block} />;
          case "cryptoMarketCards":
            return <CryptoMarketCardsBlock key={block.id} block={block} />;
          case "vpnConnectionCards":
            return <VpnConnectionCardsBlock key={block.id} block={block} />;
          case "calendarScheduleCards":
            return <CalendarScheduleCardsBlock key={block.id} block={block} />;
          case "batteryStatusCards":
            return <BatteryStatusCardsBlock key={block.id} block={block} />;
          case "musicPlayerCards":
            return <MusicPlayerCardsBlock key={block.id} block={block} />;
          case "videoPlayerCards":
            return <VideoPlayerCardsBlock key={block.id} block={block} />;
          case "newsFeedCards":
            return <NewsFeedCardsBlock key={block.id} block={block} />;
          case "taskChecklistCards":
            return <TaskChecklistCardsBlock key={block.id} block={block} />;
          case "translationCards":
            return <TranslationCardsBlock key={block.id} block={block} />;
          case "colorPaletteCards":
            return <ColorPaletteCardsBlock key={block.id} block={block} />;
          case "assetShowcaseCards":
            return <AssetShowcaseCardsBlock key={block.id} block={block} />;
          case "designCards":
            return <DesignCardsBlock key={block.id} block={block} />;
          case "glassWidgets":
            return <GlassWidgetsBlock key={block.id} block={block} />;
          case "creatorWidgets":
            return <CreatorWidgetsBlock key={block.id} block={block} />;
          case "cardCollection":
            return <CardCollectionBlock key={block.id} block={block} />;
          case "flowReportCards":
            return <FlowReportCardsBlock key={block.id} block={block} />;
          case "savedMoneyCards":
            return <SavedMoneyCardsBlock key={block.id} block={block} />;
          case "fearGreedCards":
            return <FearGreedCardsBlock key={block.id} block={block} />;
          case "targetChartCards":
            return <TargetChartCardsBlock key={block.id} block={block} />;
          case "quizScoreCards":
            return <QuizScoreCardsBlock key={block.id} block={block} />;
          case "timeSpentCards":
            return <TimeSpentCardsBlock key={block.id} block={block} />;
          case "weeklyStreakCards":
            return <WeeklyStreakCardsBlock key={block.id} block={block} />;
          case "globalRankingCards":
            return <GlobalRankingCardsBlock key={block.id} block={block} />;
          case "enrollmentChartCards":
            return <EnrollmentChartCardsBlock key={block.id} block={block} />;
          case "activeProjectsCards":
            return <ActiveProjectsCardsBlock key={block.id} block={block} />;
          case "miniStatChartCards":
            return <MiniStatChartCardsBlock key={block.id} block={block} />;
          case "statisticsProgressCards":
            return <StatisticsProgressCardsBlock key={block.id} block={block} />;
          case "salesOverviewCards":
            return <SalesOverviewCardsBlock key={block.id} block={block} />;
          case "webinarCtaCards":
            return <WebinarCtaCardsBlock key={block.id} block={block} />;
          case "expenseGaugeCards":
            return <ExpenseGaugeCardsBlock key={block.id} block={block} />;
          case "earningReportsCards":
            return <EarningReportsCardsBlock key={block.id} block={block} />;
          case "subscribersChartCards":
            return <SubscribersChartCardsBlock key={block.id} block={block} />;
          case "spentThisMonthCards":
            return <SpentThisMonthCardsBlock key={block.id} block={block} />;
          case "phoneHomeScreen":
            return <PhoneHomeScreenBlock key={block.id} block={block} />;
          case "form":
            return <FormBlock key={block.id} block={block} />;
          case "code":
            return <CodeBlock key={block.id} block={block} />;
          case "terminal":
            return <TerminalBlock key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
