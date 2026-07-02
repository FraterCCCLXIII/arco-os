import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Badge } from "../Badge";
import { Card } from "../Card";
import { Divider } from "../Divider";
import styles from "./TimezoneCard.module.css";

export interface TimezoneRow {
  city: ReactNode;
  time: ReactNode;
  period?: ReactNode;
  badge?: ReactNode;
  offset?: ReactNode;
}

export interface TimezoneCardProps {
  rows: TimezoneRow[];
  className?: string;
}

/** A stacked timezone list with large clock readouts and offset badges. */
export function TimezoneCard({ rows, className }: TimezoneCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.header}>
        <Icon name="calendar" size={14} />
        <span>Timezones</span>
      </div>
      <Divider className={styles.divider} />
      {rows.map((row, index) => (
        <div key={index}>
          <div className={styles.row}>
            <div className={styles.cityRow}>
              <span className={styles.city}>{row.city}</span>
              {row.badge && <Badge tone="neutral">{row.badge}</Badge>}
            </div>
            <div className={styles.timeRow}>
              <span className={styles.time}>{row.time}</span>
              {row.period && <span className={styles.period}>{row.period}</span>}
              {row.offset && <Badge tone="neutral">{row.offset}</Badge>}
            </div>
          </div>
          {index < rows.length - 1 && <Divider className={styles.divider} />}
        </div>
      ))}
    </Card>
  );
}
