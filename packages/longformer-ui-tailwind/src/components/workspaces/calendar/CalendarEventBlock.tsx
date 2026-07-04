import { cx } from "../../../utils/cx";
import { formatMinutesToLabel, getEventStartMinutes, type CalendarEvent } from "./types";
import styles from "./CalendarEventBlock.tailwind";

export interface CalendarEventBlockProps {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: () => void;
}

export function CalendarEventBlock({ event, compact = false, onClick }: CalendarEventBlockProps) {
  const tone = event.tone ?? "accent";
  const startMinutes = getEventStartMinutes(event);
  const timeLabel = startMinutes != null ? formatMinutesToLabel(startMinutes) : undefined;

  return (
    <button
      type="button"
      className={cx(styles.block, styles[tone], compact && styles.compact)}
      onClick={(domEvent) => {
        domEvent.stopPropagation();
        onClick?.();
      }}
    >
      {timeLabel && <div className={styles.time}>{timeLabel}</div>}
      <div className={styles.title}>{event.title}</div>
      {!compact && event.location && <div className={styles.location}>{event.location}</div>}
    </button>
  );
}
