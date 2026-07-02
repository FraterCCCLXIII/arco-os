import { useMemo } from "react";
import { cx } from "../../../utils/cx";
import { EventChip } from "./EventChip";
import { WEEKDAY_LABELS, toISODate, type CalendarEvent } from "./types";
import styles from "./MonthGrid.module.css";

export interface MonthGridProps {
  /** 0-indexed, January = 0. */
  month: number;
  year: number;
  events: CalendarEvent[];
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
  maxEventsPerDay?: number;
}

interface DayCell {
  date: Date;
  iso: string;
  inMonth: boolean;
}

/** A dependency-free month grid: 7 weekday columns, dynamic row count for the given month. */
export function MonthGrid({
  month,
  year,
  events,
  selectedDate,
  onSelectDate,
  onSelectEvent,
  maxEventsPerDay = 3,
}: MonthGridProps) {
  const todayISO = toISODate(new Date());

  const cells = useMemo<DayCell[]>(() => {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    const result: DayCell[] = [];
    for (let i = 0; i < totalCells; i++) {
      const date = new Date(year, month, i - startOffset + 1);
      result.push({ date, iso: toISODate(date), inMonth: date.getMonth() === month });
    }
    return result;
  }, [month, year]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const bucket = map.get(event.date);
      if (bucket) bucket.push(event);
      else map.set(event.date, [event]);
    }
    return map;
  }, [events]);

  return (
    <div className={styles.grid}>
      <div className={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className={styles.weekdayCell}>
            {label}
          </div>
        ))}
      </div>
      <div className={styles.days}>
        {cells.map(({ date, iso, inMonth }) => {
          const dayEvents = eventsByDate.get(iso) ?? [];
          const visible = dayEvents.slice(0, maxEventsPerDay);
          const overflow = dayEvents.length - visible.length;
          const isToday = iso === todayISO;

          return (
            <div
              key={iso}
              className={cx(styles.day, !inMonth && styles.dayOutside, iso === selectedDate && styles.daySelected)}
              onClick={() => onSelectDate?.(iso)}
            >
              <button
                type="button"
                className={cx(styles.dayNumberButton, isToday && styles.dayNumberToday)}
                aria-label={date.toDateString()}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectDate?.(iso);
                }}
              >
                {date.getDate()}
              </button>
              <div className={styles.dayEvents}>
                {visible.map((event) => (
                  <EventChip
                    key={event.id}
                    event={event}
                    onClick={() => onSelectEvent?.(event)}
                  />
                ))}
                {overflow > 0 && <div className={styles.dayOverflow}>+{overflow} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
