import { cx } from "../../../utils/cx";
import { AnalyticsCardHeader } from "../AnalyticsCardHeader";
import { Card } from "../Card";
import styles from "./TargetChartCard.tailwind";
import type { IconName } from "../../../icons";

export interface TargetChartCardProps {
  title?: string;
  icon?: IconName;
  months?: string[];
  yLabels?: string[];
  /** Normalized 0–100 values for the actual pace line. */
  actualValues?: number[];
  /** Normalized 0–100 value where the target line ends on the right. */
  targetEnd?: number;
  externalLink?: boolean;
  className?: string;
}

/** Target pace card — actual progress line, dashed goal trajectory, and shaded gap. */
export function TargetChartCard({
  title = "Target",
  icon = "hash",
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  yLabels = ["5:00", "10:00", "15:00", "/km"],
  actualValues = [82, 82, 82, 82, 82, 82],
  targetEnd = 18,
  externalLink = true,
  className,
}: TargetChartCardProps) {
  const width = 280;
  const height = 140;
  const chartTop = 12;
  const chartBottom = height - 24;
  const chartHeight = chartBottom - chartTop;

  const toY = (value: number) => chartBottom - (value / 100) * chartHeight;
  const actualPoints = actualValues.map((value, index) => {
    const x = (index / Math.max(actualValues.length - 1, 1)) * width;
    return `${x},${toY(value)}`;
  });
  const targetLine = `0,${toY(actualValues[0] ?? 82)} ${width},${toY(targetEnd)}`;
  const areaPoints = `0,${toY(actualValues[0] ?? 82)} ${width},${toY(targetEnd)} ${width},${chartBottom} 0,${chartBottom}`;

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <AnalyticsCardHeader title={title} icon={icon} externalLink={externalLink} />
      <div className={styles.chartWrap}>
        <div className={styles.yAxis}>
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Target chart">
          <polygon className={styles.area} points={areaPoints} />
          <polyline className={styles.targetLine} points={targetLine} fill="none" />
          <polyline className={styles.actualLine} points={actualPoints.join(" ")} fill="none" />
          <circle
            cx={width}
            cy={toY(actualValues[actualValues.length - 1] ?? 82)}
            r="5"
            className={styles.endPoint}
          />
        </svg>
      </div>
      <div className={styles.xAxis}>
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </Card>
  );
}
