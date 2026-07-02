import type { ActiveProjectsCardProps } from "../../primitives/ActiveProjectsCard";
import type { ActivityCardProps } from "../../primitives/ActivityCard";
import type { AssetShowcaseCardProps } from "../../primitives/AssetShowcaseCard";
import type { BatteryStatusCardProps } from "../../primitives/BatteryStatusCard";
import type { CalendarScheduleCardProps } from "../../primitives/CalendarScheduleCard";
import type { ColorPaletteCardProps } from "../../primitives/ColorPaletteCard";
import type { CryptoMarketCardProps } from "../../primitives/CryptoMarketCard";
import type { DesignCardProps } from "../../primitives/DesignCard";
import type { DeviceCardProps } from "../../primitives/DeviceCard";
import type { EarningReportsCardProps } from "../../primitives/EarningReportsCard";
import type { EnrollmentChartCardProps } from "../../primitives/EnrollmentChartCard";
import type { ExpenseGaugeCardProps } from "../../primitives/ExpenseGaugeCard";
import type { EventCardProps } from "../../primitives/EventCard";
import type { ExpenseCardProps } from "../../primitives/ExpenseCard";
import type { FearGreedCardProps } from "../../primitives/FearGreedCard";
import type { FlowReportCardProps } from "../../primitives/FlowReportCard";
import type { FitnessWidgetProps } from "../../primitives/FitnessWidget";
import type { BankingWidgetProps } from "../../primitives/BankingWidget";
import type { FinanceWidgetProps } from "../../primitives/FinanceWidget";
import type { CreatorWidgetProps } from "../../primitives/CreatorWidget";
import type { GlassWidgetProps } from "../../primitives/GlassWidget";
import type { GlobalRankingCardProps } from "../../primitives/GlobalRankingCard";
import type { InsightCardProps } from "../../primitives/InsightCard";
import type { ListingCardProps } from "../../primitives/ListingCard";
import type { MediaCardProps } from "../../primitives/MediaCard";
import type { MeetingCountdownCardProps } from "../../primitives/MeetingCountdownCard";
import type { MetricChartCardProps } from "../../primitives/MetricChartCard";
import type { MiniStatChartCardProps } from "../../primitives/MiniStatChartCard";
import type { ProfileGridCardProps } from "../../primitives/ProfileGridCard";
import type { MusicPlayerCardProps } from "../../primitives/MusicPlayerCard";
import type { NewsFeedCardProps } from "../../primitives/NewsFeedCard";
import type { QuizScoreCardProps } from "../../primitives/QuizScoreCard";
import type { RouteCardProps } from "../../primitives/RouteCard";
import type { SavedMoneyCardProps } from "../../primitives/SavedMoneyCard";
import type { SalesOverviewCardProps } from "../../primitives/SalesOverviewCard";
import type { StatCardProps } from "../../primitives/StatCard";
import type { StatisticsProgressCardProps } from "../../primitives/StatisticsProgressCard";
import type { SpentThisMonthCardProps } from "../../primitives/SpentThisMonthCard";
import type { SubscribersChartCardProps } from "../../primitives/SubscribersChartCard";
import type { TargetChartCardProps } from "../../primitives/TargetChartCard";
import type { TaskChecklistCardProps } from "../../primitives/TaskChecklistCard";
import type { TimeSpentCardProps } from "../../primitives/TimeSpentCard";
import type { TranslationCardProps } from "../../primitives/TranslationCard";
import type { WeeklyStreakCardProps } from "../../primitives/WeeklyStreakCard";
import type { VpnConnectionCardProps } from "../../primitives/VpnConnectionCard";
import type { WebinarCtaCardProps } from "../../primitives/WebinarCtaCard";
import type { IconName } from "../../../icons";

/** One self-contained UI component per widget tile — no block titles or groups. */
export type WidgetContent =
  | { type: "stat"; props: StatCardProps }
  | { type: "metricChart"; props: MetricChartCardProps }
  | { type: "activity"; props: ActivityCardProps }
  | { type: "activityFeed"; items: ActivityCardProps[] }
  | { type: "expense"; props: ExpenseCardProps }
  | { type: "device"; props: DeviceCardProps }
  | { type: "insight"; props: InsightCardProps }
  | { type: "event"; props: EventCardProps }
  | { type: "media"; props: MediaCardProps }
  | { type: "listing"; props: ListingCardProps }
  | { type: "meetingCountdown"; props: MeetingCountdownCardProps }
  | { type: "route"; props: RouteCardProps }
  | { type: "kpi"; icon?: IconName; label: string; value: string; meta?: string }
  | {
      type: "stockList";
      items: { name: string; value: string; change: string; direction: "up" | "down"; avatarName?: string }[];
    }
  | { type: "menuList"; items: { icon: IconName; label: string }[] }
  | { type: "cta"; icon: IconName; title: string; description: string; buttonLabel: string }
  | { type: "cryptoMarket"; props: CryptoMarketCardProps }
  | { type: "vpnConnection"; props: VpnConnectionCardProps }
  | { type: "calendarSchedule"; props: CalendarScheduleCardProps }
  | { type: "batteryStatus"; props: BatteryStatusCardProps }
  | { type: "musicPlayer"; props: MusicPlayerCardProps }
  | { type: "newsFeed"; props: NewsFeedCardProps }
  | { type: "taskChecklist"; props: TaskChecklistCardProps }
  | { type: "translation"; props: TranslationCardProps }
  | { type: "colorPalette"; props: ColorPaletteCardProps }
  | { type: "assetShowcase"; props: AssetShowcaseCardProps }
  | { type: "designCard"; props: DesignCardProps }
  | { type: "glassWidget"; props: GlassWidgetProps }
  | { type: "fitnessWidget"; props: FitnessWidgetProps }
  | { type: "financeWidget"; props: FinanceWidgetProps }
  | { type: "bankingWidget"; props: BankingWidgetProps }
  | { type: "creatorWidget"; props: CreatorWidgetProps }
  | { type: "flowReport"; props: FlowReportCardProps }
  | { type: "savedMoney"; props: SavedMoneyCardProps }
  | { type: "fearGreed"; props: FearGreedCardProps }
  | { type: "targetChart"; props: TargetChartCardProps }
  | { type: "quizScore"; props: QuizScoreCardProps }
  | { type: "timeSpent"; props: TimeSpentCardProps }
  | { type: "weeklyStreak"; props: WeeklyStreakCardProps }
  | { type: "globalRanking"; props: GlobalRankingCardProps }
  | { type: "enrollmentChart"; props: EnrollmentChartCardProps }
  | { type: "activeProjects"; props: ActiveProjectsCardProps }
  | { type: "miniStatChart"; props: MiniStatChartCardProps }
  | { type: "statisticsProgress"; props: StatisticsProgressCardProps }
  | { type: "salesOverview"; props: SalesOverviewCardProps }
  | { type: "webinarCta"; props: WebinarCtaCardProps }
  | { type: "expenseGauge"; props: ExpenseGaugeCardProps }
  | { type: "earningReports"; props: EarningReportsCardProps }
  | { type: "subscribersChart"; props: SubscribersChartCardProps }
  | { type: "spentThisMonth"; props: SpentThisMonthCardProps }
  | { type: "profileGrid"; props: ProfileGridCardProps };

export interface WidgetTile {
  id: string;
  colSpan?: number;
  rowSpan?: number;
  content: WidgetContent;
}
