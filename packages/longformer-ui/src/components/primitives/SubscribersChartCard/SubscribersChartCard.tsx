import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Card } from "../Card";
import styles from "./SubscribersChartCard.module.css";

export interface SubscribersChartCardProps {
  label?: string;
  value: string;
  subtitle?: string;
  icon?: IconName;
  chartValues?: number[];
  className?: string;
}

/** Subscriber growth card — icon tile, headline stat, and full-width wavy line chart. */
export function SubscribersChartCard({
  label = "Subscribers Gained",
  value,
  subtitle = "This month",
  icon = "users",
  chartValues = [18, 24, 22, 30, 28, 36, 34, 42, 38, 46],
  className,
}: SubscribersChartCardProps) {
  const max = Math.max(...chartValues, 1);
  const width = 240;
  const height = 56;
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
        <span className={styles.iconWrap}>
          <Icon name={icon} size={16} />
        </span>
        <div>
          <div className={styles.label}>{label}</div>
          <div className={styles.value}>{value}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>
      <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <polygon className={styles.area} points={area} />
        <polyline className={styles.line} points={points} fill="none" />
      </svg>
    </Card>
  );
}
