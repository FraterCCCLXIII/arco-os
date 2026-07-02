import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Card } from "../Card";
import styles from "./CalendarScheduleCard.module.css";

export interface CalendarDay {
  /** Day-of-month number or label shown in the cell. */
  value: ReactNode;
  muted?: boolean;
  selected?: boolean;
}

export interface CalendarScheduleEvent {
  title: ReactNode;
  timeRange: ReactNode;
  tone?: "accent" | "success" | "warning" | "neutral";
}

export interface CalendarScheduleCardProps {
  monthLabel: ReactNode;
  weekdays?: ReactNode[];
  days: CalendarDay[];
  events?: CalendarScheduleEvent[];
  className?: string;
}

/** Mini calendar with weekday header, selectable day grid, and stacked event list. */
export function CalendarScheduleCard({
  monthLabel,
  weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  days,
  events,
  className,
}: CalendarScheduleCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.month}>{monthLabel}</div>
      <div className={styles.weekdays}>
        {weekdays.map((day, index) => (
          <span key={index} className={styles.weekday}>
            {day}
          </span>
        ))}
      </div>
      <div className={styles.dayGrid}>
        {days.map((day, index) => (
          <span
            key={index}
            className={cx(
              styles.day,
              day.muted && styles.dayMuted,
              day.selected && styles.daySelected,
            )}
          >
            {day.value}
          </span>
        ))}
      </div>
      {events && events.length > 0 && (
        <div className={styles.events}>
          {events.map((event, index) => (
            <div key={index} className={cx(styles.event, event.tone && styles[`event-${event.tone}`])}>
              <div className={styles.eventTitle}>{event.title}</div>
              <div className={styles.eventTime}>{event.timeRange}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
