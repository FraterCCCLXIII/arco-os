import { cx } from "../../../utils/cx";
import { Card } from "../Card";
import styles from "./MiniStatChartCard.module.css";

export interface MiniStatChartCardProps {
  title: string;
  subtitle?: string;
  value: string;
  change?: string;
  changeDirection?: "up" | "down";
  chartType?: "bar" | "line";
  chartValues?: number[];
  className?: string;
}

/** Compact KPI tile — mini chart, headline value, and trend badge. */
export function MiniStatChartCard({
  title,
  subtitle,
  value,
  change,
  changeDirection = "up",
  chartType = "bar",
  chartValues = [24, 32, 28, 40, 36, 48, 44],
  className,
}: MiniStatChartCardProps) {
  const max = Math.max(...chartValues, 1);
  const width = 120;
  const height = 48;
  const points = chartValues
    .map((v, i) => {
      const x = (i / Math.max(chartValues.length - 1, 1)) * width;
      const y = height - (v / max) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
  const area = `${points} ${width},${height} 0,${height}`;

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.head}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      <div className={styles.chartWrap}>
        {chartType === "bar" ? (
          <div className={styles.bars}>
            {chartValues.map((v, i) => (
              <span key={i} className={styles.bar} style={{ height: `${Math.max(12, (v / max) * 100)}%` }} />
            ))}
          </div>
        ) : (
          <svg className={styles.lineChart} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
            <polygon className={styles.area} points={area} />
            <polyline className={styles.line} points={points} fill="none" />
          </svg>
        )}
      </div>
      <div className={styles.footer}>
        <span className={styles.value}>{value}</span>
        {change && (
          <span className={cx(styles.change, changeDirection === "down" ? styles.changeDown : styles.changeUp)}>
            {change}
          </span>
        )}
      </div>
    </Card>
  );
}
