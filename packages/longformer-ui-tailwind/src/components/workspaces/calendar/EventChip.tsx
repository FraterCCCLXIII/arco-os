import { cx } from "../../../utils/cx";
import type { CalendarEvent } from "./types";
import styles from "./EventChip.tailwind";

export interface EventChipProps {
  event: CalendarEvent;
  onClick?: () => void;
}

export function EventChip({ event, onClick }: EventChipProps) {
  const tone = event.tone ?? "accent";
  return (
    <button
      type="button"
      className={styles.chip}
      onClick={(domEvent) => {
        domEvent.stopPropagation();
        onClick?.();
      }}
    >
      <span className={cx(styles.dot, styles[tone])} aria-hidden="true" />
      {event.startTime && <span className={styles.time}>{event.startTime}</span>}
      <span className={styles.title}>{event.title}</span>
    </button>
  );
}
