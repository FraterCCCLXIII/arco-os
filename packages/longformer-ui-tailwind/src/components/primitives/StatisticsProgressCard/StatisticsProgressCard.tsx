import { cx } from "../../../utils/cx";
import { Card } from "../Card";
import { DashboardCardHeader } from "../DashboardCardHeader";
import styles from "./StatisticsProgressCard.tailwind";

export interface StatisticsProgressRow {
  label: string;
  subLabel?: string;
  change?: string;
  value: string;
  progress: number;
}

export interface StatisticsProgressCardProps {
  title?: string;
  rows: StatisticsProgressRow[];
  menu?: boolean;
  className?: string;
}

/** Dual-row statistics card — progress bars with change badges and trailing values. */
export function StatisticsProgressCard({
  title = "Statistics",
  rows,
  menu = true,
  className,
}: StatisticsProgressCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <DashboardCardHeader title={title} menu={menu} />
      <div className={styles.rows}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <div className={styles.top}>
              <div>
                <div className={styles.label}>{row.label}</div>
                {row.subLabel && <div className={styles.subLabel}>{row.subLabel}</div>}
              </div>
              <div className={styles.right}>
                {row.change && <span className={styles.badge}>{row.change}</span>}
                <span className={styles.value}>{row.value}</span>
              </div>
            </div>
            <div className={styles.track}>
              <span className={styles.fill} style={{ width: `${Math.max(0, Math.min(100, row.progress))}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
