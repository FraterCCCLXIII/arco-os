import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./ScheduleSlotCard.tailwind";

export type ScheduleSlotTone = "success" | "warning" | "accent";

export interface ScheduleSlotCardProps {
  name: ReactNode;
  mode?: ReactNode;
  timeRange: ReactNode;
  tone?: ScheduleSlotTone;
  className?: string;
}

/** A compact session slot with a colored accent rail — used in day schedules. */
export function ScheduleSlotCard({ name, mode, timeRange, tone = "accent", className }: ScheduleSlotCardProps) {
  return (
    <div className={cx(styles.slot, className)}>
      <span className={cx(styles.accent, styles[tone])} aria-hidden="true" />
      <div className={styles.body}>
        <div className={styles.name}>{name}</div>
        {mode && <div className={styles.mode}>{mode}</div>}
        <div className={styles.time}>{timeRange}</div>
      </div>
    </div>
  );
}
