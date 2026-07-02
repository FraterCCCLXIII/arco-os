import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Card } from "../Card";
import styles from "./SalesOverviewCard.module.css";

export interface SalesOverviewSide {
  label: string;
  value: string;
  count: string;
  icon?: IconName;
}

export interface SalesOverviewCardProps {
  title?: string;
  total: string;
  change?: string;
  left: SalesOverviewSide;
  right: SalesOverviewSide;
  leftRatio?: number;
  className?: string;
}

/** Split comparison card — two KPI columns and a dual-tone ratio bar. */
export function SalesOverviewCard({
  title = "Sales Overview",
  total,
  change,
  left,
  right,
  leftRatio = 62,
  className,
}: SalesOverviewCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.head}>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.totalRow}>
            <span className={styles.total}>{total}</span>
            {change && <span className={styles.change}>{change}</span>}
          </div>
        </div>
      </div>
      <div className={styles.split}>
        <div className={styles.side}>
          <span className={styles.sideIcon}>
            <Icon name={left.icon ?? "hash"} size={16} />
          </span>
          <div className={styles.sideValue}>{left.value}</div>
          <div className={styles.sideLabel}>{left.label}</div>
          <div className={styles.sideCount}>{left.count}</div>
        </div>
        <div className={styles.divider} aria-hidden="true" />
        <div className={styles.side}>
          <span className={styles.sideIcon}>
            <Icon name={right.icon ?? "users"} size={16} />
          </span>
          <div className={styles.sideValue}>{right.value}</div>
          <div className={styles.sideLabel}>{right.label}</div>
          <div className={styles.sideCount}>{right.count}</div>
        </div>
      </div>
      <div className={styles.ratioBar}>
        <span className={styles.ratioLeft} style={{ width: `${leftRatio}%` }} />
        <span className={styles.ratioRight} style={{ width: `${100 - leftRatio}%` }} />
      </div>
    </Card>
  );
}
