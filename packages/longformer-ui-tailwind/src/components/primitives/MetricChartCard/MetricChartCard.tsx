import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Card } from "../Card";
import { Chip } from "../Chip";
import styles from "./MetricChartCard.tailwind";

export interface MetricChartCardProps {
  label?: ReactNode;
  value: ReactNode;
  change?: {
    amount: ReactNode;
    percent: ReactNode;
    caption?: ReactNode;
    direction?: "up" | "down";
  };
  /** Normalized sparkline values rendered as a simple area chart. */
  chartValues?: number[];
  timeframes?: string[];
  activeTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
  className?: string;
}

/**
 * A portfolio-style metric card — headline balance, optional delta, an inline
 * sparkline, and a row of timeframe pills.
 */
export function MetricChartCard({
  label,
  value,
  change,
  chartValues,
  timeframes,
  activeTimeframe,
  onTimeframeChange,
  className,
}: MetricChartCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.value}>{value}</div>

      {change && (
        <div className={cx(styles.change, change.direction === "down" && styles.changeDown)}>
          {change.direction !== "down" && <Icon name="arrow-up-right" size={12} />}
          {change.direction === "down" && <Icon name="chevron-down" size={12} />}
          <span>
            {change.amount} ({change.percent})
          </span>
          {change.caption && <span className={styles.changeCaption}>{change.caption}</span>}
        </div>
      )}

      {chartValues && chartValues.length > 0 && <Sparkline values={chartValues} positive={change?.direction !== "down"} />}

      {timeframes && timeframes.length > 0 && (
        <div className={styles.timeframes}>
          {timeframes.map((frame) => (
            <Chip
              key={frame}
              active={frame === activeTimeframe}
              onClick={onTimeframeChange ? () => onTimeframeChange(frame) : undefined}
            >
              {frame}
            </Chip>
          ))}
        </div>
      )}
    </Card>
  );
}

function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const width = 100;
  const height = 48;
  const points = values.map((raw, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width;
    const y = height - ((raw - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });
  const area = `${points.join(" ")} ${width},${height} 0,${height}`;

  return (
    <svg
      className={cx(styles.sparkline, positive ? styles.sparklineUp : styles.sparklineDown)}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Trend chart"
    >
      <polygon className={styles.sparklineArea} points={area} />
      <polyline className={styles.sparklineLine} points={points.join(" ")} fill="none" />
    </svg>
  );
}
