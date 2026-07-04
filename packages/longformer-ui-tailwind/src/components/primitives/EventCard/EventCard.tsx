import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { IconButton } from "../IconButton";
import styles from "./EventCard.tailwind";

export interface EventCardProps {
  label?: ReactNode;
  title: ReactNode;
  startTime: ReactNode;
  endTime: ReactNode;
  timeLeft?: { icon?: IconName; label: ReactNode };
  className?: string;
}

/** A calendar event tile with stacked times and a time-left pill. */
export function EventCard({ label = "Today", title, startTime, endTime, timeLeft, className }: EventCardProps) {
  return (
    <div className={cx(styles.card, className)}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <IconButton icon="more-vertical" label="Event options" variant="ghost" size="sm" />
      </div>

      <div className={styles.title}>{title}</div>

      <div className={styles.times}>
        <div className={styles.timeBlock}>
          <span className={styles.time}>{startTime}</span>
        </div>
        <div className={styles.timeBlock}>
          <span className={styles.time}>{endTime}</span>
        </div>
      </div>

      {timeLeft && (
        <div className={styles.timeLeft}>
          {timeLeft.icon && <Icon name={timeLeft.icon} size={12} />}
          {timeLeft.label}
        </div>
      )}
    </div>
  );
}
