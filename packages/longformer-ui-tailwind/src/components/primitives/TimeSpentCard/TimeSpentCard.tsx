import { cx } from "../../../utils/cx";
import { Card } from "../Card";
import { MetricTrendHeader } from "../MetricTrendHeader";
import styles from "./TimeSpentCard.tailwind";

export interface TimeSpentCardProps {
  title?: string;
  value: string;
  change?: string;
  changeDirection?: "up" | "down";
  subLabel?: string;
  subValue?: string;
  chartValues?: number[];
  activeIndex?: number;
  className?: string;
}

/** Study time summary — sub-metric and a mini striped bar chart with one active day. */
export function TimeSpentCard({
  title = "Total Time Spent",
  value,
  change,
  changeDirection = "down",
  subLabel = "This Week",
  subValue,
  chartValues = [40, 55, 48, 62, 70, 58, 45],
  activeIndex = 4,
  className,
}: TimeSpentCardProps) {
  const max = Math.max(...chartValues, 1);

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <MetricTrendHeader title={title} value={value} change={change} changeDirection={changeDirection} />
      {subValue && (
        <div className={styles.subMetric}>
          {subLabel} <strong>{subValue}</strong>
        </div>
      )}
      <div className={styles.bars}>
        {chartValues.map((v, index) => (
          <span
            key={index}
            className={cx(styles.bar, index === activeIndex ? styles.barActive : styles.barMuted)}
            style={{ height: `${Math.max(18, (v / max) * 100)}%` }}
          />
        ))}
      </div>
    </Card>
  );
}
