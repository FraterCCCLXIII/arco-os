import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Card } from "../Card";
import styles from "./SpentThisMonthCard.tailwind";

export interface SpentThisMonthBar {
  label: string;
  value: number;
}

export interface SpentThisMonthCardProps {
  amount: string;
  label?: string;
  change?: string;
  changeDirection?: "up" | "down";
  bars?: SpentThisMonthBar[];
  className?: string;
}

const DEFAULT_BARS: SpentThisMonthBar[] = [
  { label: "5", value: 15 },
  { label: "10", value: 45 },
  { label: "15", value: 55 },
  { label: "20", value: 20 },
  { label: "25", value: 10 },
  { label: "31", value: 30 },
];

/** Monthly spending summary — headline amount, trend badge, and striped vertical bar chart. */
export function SpentThisMonthCard({
  amount,
  label = "Spent this Month",
  change = "5.8%",
  changeDirection = "up",
  bars = DEFAULT_BARS,
  className,
}: SpentThisMonthCardProps) {
  const max = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.header}>
        <div className={styles.headline}>
          <span className={styles.amount}>{amount}</span>
          <span className={styles.label}>{label}</span>
        </div>
        {change && (
          <div className={cx(styles.trend, changeDirection === "down" && styles.trendDown)}>
            <span className={styles.trendIcon} aria-hidden="true">
              <Icon name={changeDirection === "down" ? "chevron-down" : "arrow-up-right"} size={12} />
            </span>
            <span className={styles.trendValue}>{change}</span>
          </div>
        )}
      </div>

      <div className={styles.chart} aria-hidden="true">
        {bars.map((bar) => (
          <div key={bar.label} className={styles.barCol}>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ height: `${Math.max(8, (bar.value / max) * 100)}%` }}>
                <span className={styles.barCap} />
              </div>
            </div>
            <span className={styles.barLabel}>{bar.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
