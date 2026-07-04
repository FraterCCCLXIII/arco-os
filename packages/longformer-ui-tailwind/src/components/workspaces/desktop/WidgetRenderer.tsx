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
import styles from "./WidgetRenderer.tailwind";

/** Renders a single widget component — matches generated UI blocks, not stripped embeds. */
export function WidgetRenderer({ content }: { content: WidgetContent }) {
  switch (content.type) {
    case "stat":
      return <StatCard {...content.props} className={styles.fill} />;
    case "metricChart":
      return <MetricChartCard {...content.props} className={styles.fill} />;
    case "activity":
      return <ActivityCard {...content.props} className={styles.fill} />;
    case "activityFeed":
      return (
        <div className={styles.activityFeed}>
          {content.items.map((item, index) => (
            <ActivityCard key={index} {...item} />
          ))}
        </div>
      );
    case "expense":
      return <ExpenseCard {...content.props} className={styles.fill} />;
    case "device":
      return <DeviceCard {...content.props} className={styles.fill} />;
    case "insight":
      return <InsightCard {...content.props} label={undefined} className={styles.fill} />;
    case "event":
      return <EventCard {...content.props} className={styles.fill} />;
    case "media":
      return <MediaCard {...content.props} className={styles.fill} />;
    case "listing":
      return <ListingCard {...content.props} className={styles.fill} />;
    case "meetingCountdown":
      return <MeetingCountdownCard {...content.props} className={styles.fill} />;
    case "route":
      return <RouteCard {...content.props} className={styles.fill} />;
    case "kpi":
      return (
        <div className={styles.plainSurface}>
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
        </div>
      );
    case "stockList":
      return (
        <div className={styles.plainSurface}>
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
        </div>
      );
    case "menuList":
      return (
        <div className={styles.plainSurface}>
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
        </div>
      );
    case "cta":
      return (
        <div className={styles.plainSurface}>
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
        </div>
      );
    case "cryptoMarket":
      return <CryptoMarketCard {...content.props} className={styles.fill} />;
    case "vpnConnection":
      return <VpnConnectionCard {...content.props} className={styles.fill} />;
    case "calendarSchedule":
      return <CalendarScheduleCard {...content.props} className={styles.fill} />;
    case "batteryStatus":
      return <BatteryStatusCard {...content.props} className={styles.fill} />;
    case "musicPlayer":
      return <MusicPlayerCard {...content.props} className={styles.fill} />;
    case "newsFeed":
      return <NewsFeedCard {...content.props} className={styles.fill} />;
    case "taskChecklist":
      return <TaskChecklistCard {...content.props} className={styles.fill} />;
    case "translation":
      return <TranslationCard {...content.props} className={styles.fill} />;
    case "colorPalette":
      return <ColorPaletteCard {...content.props} className={styles.fill} />;
    case "assetShowcase":
      return <AssetShowcaseCard {...content.props} className={styles.fill} />;
    case "designCard":
      return <DesignCard {...content.props} className={styles.designCardEmbed} />;
    case "glassWidget":
      return <GlassWidget {...content.props} className={styles.fill} />;
    case "fitnessWidget":
      return <FitnessWidget {...content.props} bleed={false} className={styles.fill} />;
    case "financeWidget":
      return <FinanceWidget {...content.props} bleed={false} className={styles.fill} />;
    case "bankingWidget":
      return <BankingWidget {...content.props} bleed={false} className={styles.fill} />;
    case "creatorWidget":
      return <CreatorWidget {...content.props} className={styles.fill} />;
    case "flowReport":
      return <FlowReportCard {...content.props} className={styles.fill} />;
    case "savedMoney":
      return <SavedMoneyCard {...content.props} className={styles.fill} />;
    case "fearGreed":
      return <FearGreedCard {...content.props} className={styles.fill} />;
    case "targetChart":
      return <TargetChartCard {...content.props} className={styles.fill} />;
    case "quizScore":
      return <QuizScoreCard {...content.props} className={styles.fill} />;
    case "timeSpent":
      return <TimeSpentCard {...content.props} className={styles.fill} />;
    case "weeklyStreak":
      return <WeeklyStreakCard {...content.props} className={styles.fill} />;
    case "globalRanking":
      return <GlobalRankingCard {...content.props} className={styles.fill} />;
    case "enrollmentChart":
      return <EnrollmentChartCard {...content.props} className={styles.fill} />;
    case "activeProjects":
      return <ActiveProjectsCard {...content.props} className={styles.fill} />;
    case "miniStatChart":
      return <MiniStatChartCard {...content.props} className={styles.fill} />;
    case "statisticsProgress":
      return <StatisticsProgressCard {...content.props} className={styles.fill} />;
    case "salesOverview":
      return <SalesOverviewCard {...content.props} className={styles.fill} />;
    case "webinarCta":
      return <WebinarCtaCard {...content.props} className={styles.fill} />;
    case "expenseGauge":
      return <ExpenseGaugeCard {...content.props} className={styles.fill} />;
    case "earningReports":
      return <EarningReportsCard {...content.props} className={styles.fill} />;
    case "subscribersChart":
      return <SubscribersChartCard {...content.props} className={styles.fill} />;
    case "spentThisMonth":
      return <SpentThisMonthCard {...content.props} className={styles.fill} />;
    case "profileGrid":
      return <ProfileGridCard {...content.props} className={styles.fill} />;
    default:
      return null;
  }
}
