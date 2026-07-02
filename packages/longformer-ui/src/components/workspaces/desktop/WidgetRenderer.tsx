import { ActiveProjectsCard } from "../../primitives/ActiveProjectsCard";
import { ActivityCard } from "../../primitives/ActivityCard";
import { AssetShowcaseCard } from "../../primitives/AssetShowcaseCard";
import { Avatar } from "../../primitives/Avatar";
import { BatteryStatusCard } from "../../primitives/BatteryStatusCard";
import { CalendarScheduleCard } from "../../primitives/CalendarScheduleCard";
import { ColorPaletteCard } from "../../primitives/ColorPaletteCard";
import { CryptoMarketCard } from "../../primitives/CryptoMarketCard";
import { DesignCard } from "../../primitives/DesignCard";
import { DeviceCard } from "../../primitives/DeviceCard";
import { EarningReportsCard } from "../../primitives/EarningReportsCard";
import { EnrollmentChartCard } from "../../primitives/EnrollmentChartCard";
import { ExpenseGaugeCard } from "../../primitives/ExpenseGaugeCard";
import { EventCard } from "../../primitives/EventCard";
import { ExpenseCard } from "../../primitives/ExpenseCard";
import { FearGreedCard } from "../../primitives/FearGreedCard";
import { FlowReportCard } from "../../primitives/FlowReportCard";
import { GlassWidget } from "../../primitives/GlassWidget";
import { FitnessWidget } from "../../primitives/FitnessWidget";
import { FinanceWidget } from "../../primitives/FinanceWidget";
import { BankingWidget } from "../../primitives/BankingWidget";
import { CreatorWidget } from "../../primitives/CreatorWidget";
import { GlobalRankingCard } from "../../primitives/GlobalRankingCard";
import { InsightCard } from "../../primitives/InsightCard";
import { ListingCard } from "../../primitives/ListingCard";
import { MediaCard } from "../../primitives/MediaCard";
import { MeetingCountdownCard } from "../../primitives/MeetingCountdownCard";
import { MetricChartCard } from "../../primitives/MetricChartCard";
import { MiniStatChartCard } from "../../primitives/MiniStatChartCard";
import { MusicPlayerCard } from "../../primitives/MusicPlayerCard";
import { NewsFeedCard } from "../../primitives/NewsFeedCard";
import { ProfileGridCard } from "../../primitives/ProfileGridCard";
import { QuizScoreCard } from "../../primitives/QuizScoreCard";
import { RouteCard } from "../../primitives/RouteCard";
import { SavedMoneyCard } from "../../primitives/SavedMoneyCard";
import { SalesOverviewCard } from "../../primitives/SalesOverviewCard";
import { SpentThisMonthCard } from "../../primitives/SpentThisMonthCard";
import { StatCard } from "../../primitives/StatCard";
import { StatisticsProgressCard } from "../../primitives/StatisticsProgressCard";
import { SubscribersChartCard } from "../../primitives/SubscribersChartCard";
import { TargetChartCard } from "../../primitives/TargetChartCard";
import { TaskChecklistCard } from "../../primitives/TaskChecklistCard";
import { TimeSpentCard } from "../../primitives/TimeSpentCard";
import { TranslationCard } from "../../primitives/TranslationCard";
import { WeeklyStreakCard } from "../../primitives/WeeklyStreakCard";
import { VpnConnectionCard } from "../../primitives/VpnConnectionCard";
import { WebinarCtaCard } from "../../primitives/WebinarCtaCard";
import { Icon } from "../../../icons";
import type { WidgetContent } from "./widget-types";
import styles from "./WidgetRenderer.module.css";

/** Renders a single widget component — no section titles or scrollable groups. */
export function WidgetRenderer({ content }: { content: WidgetContent }) {
  switch (content.type) {
    case "stat":
      return <StatCard {...content.props} className={styles.embeddedStat} />;
    case "metricChart":
      return <MetricChartCard {...content.props} className={styles.embeddedMetric} />;
    case "activity":
      return <ActivityCard {...content.props} className={styles.embeddedCard} />;
    case "activityFeed":
      return (
        <div className={styles.activityFeed}>
          {content.items.map((item, index) => (
            <ActivityCard key={index} {...item} className={styles.embeddedCard} />
          ))}
        </div>
      );
    case "expense":
      return <ExpenseCard {...content.props} className={styles.embeddedStat} />;
    case "device":
      return <DeviceCard {...content.props} className={styles.fill} />;
    case "insight":
      return <InsightCard {...content.props} label={undefined} className={styles.embeddedStat} />;
    case "event":
      return <EventCard {...content.props} className={styles.fill} />;
    case "media":
      return <MediaCard {...content.props} className={styles.fill} />;
    case "listing":
      return <ListingCard {...content.props} className={styles.embeddedCard} />;
    case "meetingCountdown":
      return <MeetingCountdownCard {...content.props} className={styles.fill} />;
    case "route":
      return <RouteCard {...content.props} className={styles.fill} />;
    case "kpi":
      return (
        <div className={styles.kpi}>
          <div className={styles.kpiHead}>
            {content.icon && (
              <span className={styles.kpiIcon}>
                <Icon name={content.icon} size={14} />
              </span>
            )}
            <span>{content.label}</span>
          </div>
          <div className={styles.kpiValue}>{content.value}</div>
          {content.meta && <div className={styles.kpiMeta}>{content.meta}</div>}
        </div>
      );
    case "stockList":
      return (
        <div className={styles.stockList}>
          {content.items.map((item) => (
            <div key={item.name} className={styles.stockRow}>
              <Avatar name={item.avatarName ?? item.name} size="sm" />
              <span className={styles.stockName}>{item.name}</span>
              <span className={styles.stockValue}>{item.value}</span>
              <span className={item.direction === "up" ? styles.stockChangeUp : styles.stockChangeDown}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      );
    case "menuList":
      return (
        <div className={styles.menuList}>
          {content.items.map((item) => (
            <button key={item.label} type="button" className={styles.menuRow}>
              <span className={styles.menuRowIcon}>
                <Icon name={item.icon} size={14} />
              </span>
              {item.label}
              <Icon name="chevron-right" size={14} className={styles.menuChevron} />
            </button>
          ))}
        </div>
      );
    case "cta":
      return (
        <div className={styles.cta}>
          <span className={styles.ctaIcon}>
            <Icon name={content.icon} size={22} />
          </span>
          <div className={styles.ctaTitle}>{content.title}</div>
          <div className={styles.ctaDescription}>{content.description}</div>
          <button type="button" className={styles.ctaButton}>
            {content.buttonLabel}
          </button>
        </div>
      );
    case "cryptoMarket":
      return <CryptoMarketCard {...content.props} className={styles.embeddedDashboard} />;
    case "vpnConnection":
      return <VpnConnectionCard {...content.props} className={styles.embeddedDashboard} />;
    case "calendarSchedule":
      return <CalendarScheduleCard {...content.props} className={styles.embeddedDashboard} />;
    case "batteryStatus":
      return <BatteryStatusCard {...content.props} className={styles.embeddedDashboard} />;
    case "musicPlayer":
      return <MusicPlayerCard {...content.props} className={styles.embeddedDashboard} />;
    case "newsFeed":
      return <NewsFeedCard {...content.props} className={styles.embeddedDashboard} />;
    case "taskChecklist":
      return <TaskChecklistCard {...content.props} className={styles.embeddedDashboard} />;
    case "translation":
      return <TranslationCard {...content.props} className={styles.embeddedDashboard} />;
    case "colorPalette":
      return <ColorPaletteCard {...content.props} className={styles.embeddedDashboard} />;
    case "assetShowcase":
      return <AssetShowcaseCard {...content.props} className={styles.embeddedDashboard} />;
    case "designCard":
      return <DesignCard {...content.props} className={styles.designCardEmbed} />;
    case "glassWidget":
      return <GlassWidget {...content.props} className={styles.glassWidgetEmbed} />;
    case "fitnessWidget":
      return <FitnessWidget {...content.props} className={styles.fitnessWidgetEmbed} />;
    case "financeWidget":
      return <FinanceWidget {...content.props} className={styles.financeWidgetEmbed} />;
    case "bankingWidget":
      return <BankingWidget {...content.props} className={styles.bankingWidgetEmbed} />;
    case "creatorWidget":
      return <CreatorWidget {...content.props} className={styles.creatorWidgetEmbed} />;
    case "flowReport":
      return <FlowReportCard {...content.props} className={styles.embeddedDashboard} />;
    case "savedMoney":
      return <SavedMoneyCard {...content.props} className={styles.embeddedDashboard} />;
    case "fearGreed":
      return <FearGreedCard {...content.props} className={styles.embeddedDashboard} />;
    case "targetChart":
      return <TargetChartCard {...content.props} className={styles.embeddedDashboard} />;
    case "quizScore":
      return <QuizScoreCard {...content.props} className={styles.embeddedDashboard} />;
    case "timeSpent":
      return <TimeSpentCard {...content.props} className={styles.embeddedDashboard} />;
    case "weeklyStreak":
      return <WeeklyStreakCard {...content.props} className={styles.embeddedDashboard} />;
    case "globalRanking":
      return <GlobalRankingCard {...content.props} className={styles.embeddedDashboard} />;
    case "enrollmentChart":
      return <EnrollmentChartCard {...content.props} className={styles.embeddedDashboard} />;
    case "activeProjects":
      return <ActiveProjectsCard {...content.props} className={styles.embeddedDashboard} />;
    case "miniStatChart":
      return <MiniStatChartCard {...content.props} className={styles.embeddedDashboard} />;
    case "statisticsProgress":
      return <StatisticsProgressCard {...content.props} className={styles.embeddedDashboard} />;
    case "salesOverview":
      return <SalesOverviewCard {...content.props} className={styles.embeddedDashboard} />;
    case "webinarCta":
      return <WebinarCtaCard {...content.props} className={styles.embeddedDashboard} />;
    case "expenseGauge":
      return <ExpenseGaugeCard {...content.props} className={styles.embeddedDashboard} />;
    case "earningReports":
      return <EarningReportsCard {...content.props} className={styles.embeddedDashboard} />;
    case "subscribersChart":
      return <SubscribersChartCard {...content.props} className={styles.embeddedDashboard} />;
    case "spentThisMonth":
      return <SpentThisMonthCard {...content.props} className={styles.embeddedDashboard} />;
    case "profileGrid":
      return <ProfileGridCard {...content.props} className={styles.embeddedDashboard} />;
    default:
      return null;
  }
}
