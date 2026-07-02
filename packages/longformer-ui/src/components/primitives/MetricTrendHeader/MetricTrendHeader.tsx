import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./MetricTrendHeader.module.css";

export interface MetricTrendHeaderProps {
  title: ReactNode;
  value: ReactNode;
  change?: ReactNode;
  changeDirection?: "up" | "down";
  className?: string;
}

/** LMS summary card header — label, headline metric, and optional trend pill. */
export function MetricTrendHeader({ title, value, change, changeDirection = "down", className }: MetricTrendHeaderProps) {
  return (
    <div className={cx(styles.header, className)}>
      <div className={styles.title}>{title}</div>
      <div className={styles.row}>
        <span className={styles.value}>{value}</span>
        {change && (
          <span className={cx(styles.change, changeDirection === "up" ? styles.changeUp : styles.changeDown)}>{change}</span>
        )}
      </div>
    </div>
  );
}
