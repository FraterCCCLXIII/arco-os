import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Card } from "../Card";
import { DashboardCardHeader } from "../DashboardCardHeader";
import styles from "./EarningReportsCard.tailwind";

export interface EarningStatRow {
  label: string;
  amount: string;
  change?: string;
  changeDirection?: "up" | "down";
  icon?: IconName;
}

export interface EarningReportsCardProps {
  title?: string;
  subtitle?: string;
  stats: EarningStatRow[];
  chartValues?: number[];
  chartLabels?: string[];
  activeIndex?: number;
  menu?: boolean;
  className?: string;
}

/** Weekly earnings card — stat rows plus bar chart with highlighted peak day. */
export function EarningReportsCard({
  title = "Earning Reports",
  subtitle = "Weekly overview",
  stats,
  chartValues = [38, 52, 44, 58, 72, 48, 40],
  chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  activeIndex = 4,
  menu = true,
  className,
}: EarningReportsCardProps) {
  const max = Math.max(...chartValues, 1);

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <DashboardCardHeader title={title} subtitle={subtitle} menu={menu} />
      <div className={styles.stats}>
        {stats.map((row) => (
          <div key={row.label} className={styles.statRow}>
            <span className={styles.statIcon}>
              <Icon name={row.icon ?? "dollar-sign"} size={14} />
            </span>
            <div className={styles.statMeta}>
              <div className={styles.statLabel}>{row.label}</div>
              <div className={styles.statAmount}>{row.amount}</div>
            </div>
            {row.change && (
              <span
                className={cx(
                  styles.statChange,
                  row.changeDirection === "down" ? styles.statChangeDown : styles.statChangeUp,
                )}
              >
                {row.change}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.chart}>
        {chartValues.map((value, index) => (
          <div key={chartLabels[index] ?? index} className={styles.barCol}>
            <div
              className={cx(styles.bar, index === activeIndex && styles.barActive)}
              style={{ height: `${Math.max(16, (value / max) * 100)}%` }}
            />
            <span className={styles.barLabel}>{chartLabels[index]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
