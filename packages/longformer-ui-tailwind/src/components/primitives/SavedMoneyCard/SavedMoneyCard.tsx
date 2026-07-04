import { cx } from "../../../utils/cx";
import { AnalyticsCardHeader } from "../AnalyticsCardHeader";
import { Card } from "../Card";
import { Chip } from "../Chip";
import styles from "./SavedMoneyCard.tailwind";
import type { IconName } from "../../../icons";

export interface SavedMoneyCardProps {
  title?: string;
  subtitle?: string;
  icon?: IconName;
  chartValues: number[];
  labels?: string[];
  timeframes?: string[];
  activeTimeframe?: string;
  yMax?: number;
  externalLink?: boolean;
  className?: string;
}

/** Savings trend card — segmented timeframe control and a soft line chart. */
export function SavedMoneyCard({
  title = "Saved Money",
  subtitle = "Monitor how your money is being utilized.",
  icon = "hash",
  chartValues,
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  timeframes = ["Week", "Month", "Year"],
  activeTimeframe = "Week",
  yMax = 300,
  externalLink = true,
  className,
}: SavedMoneyCardProps) {
  const width = 280;
  const height = 120;
  const points = chartValues.map((value, index) => {
    const x = (index / Math.max(chartValues.length - 1, 1)) * width;
    const y = height - (value / yMax) * (height - 16) - 8;
    return { x, y, value };
  });
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <AnalyticsCardHeader title={title} subtitle={subtitle} icon={icon} externalLink={externalLink} />
      <div className={styles.timeframes}>
        {timeframes.map((frame) => (
          <Chip key={frame} active={frame === activeTimeframe}>
            {frame}
          </Chip>
        ))}
      </div>
      <div className={styles.chartWrap}>
        <div className={styles.yAxis}>
          {[yMax, Math.round(yMax * 0.66), Math.round(yMax * 0.33), 0].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Savings trend">
          {[0.33, 0.66, 1].map((ratio) => (
            <line
              key={ratio}
              x1={0}
              x2={width}
              y1={height - ratio * (height - 16) - 8}
              y2={height - ratio * (height - 16) - 8}
              className={styles.gridLine}
            />
          ))}
          <polyline className={styles.trendLine} points={polyline} fill="none" />
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r="6" className={styles.dataPoint} />
          ))}
        </svg>
      </div>
      <div className={styles.xAxis}>
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </Card>
  );
}
