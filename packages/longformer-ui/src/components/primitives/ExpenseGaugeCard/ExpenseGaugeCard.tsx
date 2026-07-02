import { cx } from "../../../utils/cx";
import { Card } from "../Card";
import styles from "./ExpenseGaugeCard.module.css";

export interface ExpenseGaugeCardProps {
  value: string;
  label?: string;
  percent: number;
  caption?: string;
  className?: string;
}

/** Semi-circular gauge card — headline amount with orange donut progress. */
export function ExpenseGaugeCard({
  value,
  label = "Expenses",
  percent,
  caption = "78% of budget used this month",
  className,
}: ExpenseGaugeCardProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = 54;
  const circumference = Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.head}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
      <div className={styles.gaugeWrap}>
        <svg className={styles.gauge} viewBox="0 0 140 80" aria-hidden="true">
          <path className={styles.track} d="M 13 70 A 54 54 0 0 1 127 70" fill="none" />
          <path
            className={styles.fill}
            d="M 13 70 A 54 54 0 0 1 127 70"
            fill="none"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className={styles.percent}>{clamped}%</div>
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </Card>
  );
}
