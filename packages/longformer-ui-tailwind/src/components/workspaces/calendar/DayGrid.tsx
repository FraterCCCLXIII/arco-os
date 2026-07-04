import { useMemo, type CSSProperties } from "react";
import { CalendarEventBlock } from "./CalendarEventBlock";
import { EventChip } from "./EventChip";
import {
  formatDayTitle,
  formatMinutesToLabel,
  formatWeekdayLong,
  layoutTimedEvents,
  toISODate,
  type CalendarEvent,
} from "./types";
import styles from "./DayGrid.tailwind";

export interface DayGridProps {
  dateISO: string;
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  startHour?: number;
  endHour?: number;
}

function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function DayGrid({
  dateISO,
  events,
  onSelectEvent,
  startHour = 0,
  endHour = 24,
}: DayGridProps) {
  const todayISO = toISODate(new Date());
  const hourSpan = endHour - startHour;
  const startMinutes = startHour * 60;
  const totalMinutes = hourSpan * 60;
  const currentMinutes = minutesSinceMidnight(new Date());
  const isToday = dateISO === todayISO;

  const allDayEvents = useMemo(
    () => events.filter((event) => !event.startTime),
    [events],
  );

  const timedLayouts = useMemo(
    () => layoutTimedEvents(events.filter((event) => event.startTime)),
    [events],
  );

  const hours = useMemo(
    () => Array.from({ length: hourSpan }, (_, index) => startHour + index),
    [hourSpan, startHour],
  );

  const showNowLine =
    isToday && currentMinutes >= startMinutes && currentMinutes < startHour * 60 + totalMinutes;
  const nowTopPercent = ((currentMinutes - startMinutes) / totalMinutes) * 100;

  return (
    <div className={styles.grid}>
      <div className={styles.header}>
        <div className={styles.title}>{formatDayTitle(dateISO)}</div>
        <div className={styles.weekday}>{formatWeekdayLong(dateISO)}</div>
      </div>

      {allDayEvents.length > 0 && (
        <div className={styles.allDayRow}>
          <div className={styles.allDayLabel}>all-day</div>
          <div className={styles.allDayEvents}>
            {allDayEvents.map((event) => (
              <EventChip key={event.id} event={event} onClick={() => onSelectEvent?.(event)} />
            ))}
          </div>
        </div>
      )}

      <div
        className={styles.body}
        style={{ "--hour-span": hourSpan } as CSSProperties}
      >
        <div className={styles.timeColumn}>
          {hours.map((hour) => (
            <div key={hour} className={styles.timeLabel}>
              {formatMinutesToLabel(hour * 60)}
            </div>
          ))}
        </div>

        <div className={styles.dayColumn}>
          {hours.map((hour) => (
            <div key={hour} className={styles.hourCell} />
          ))}

          {timedLayouts.map(({ event, startMinutes: eventStart, endMinutes, column, columnCount }) => {
            const top = ((eventStart - startMinutes) / totalMinutes) * 100;
            const height = ((endMinutes - eventStart) / totalMinutes) * 100;
            const width = 100 / columnCount;
            const left = width * column;

            return (
              <div
                key={event.id}
                className={styles.itemSlot}
                style={{
                  top: `${top}%`,
                  height: `${Math.max(height, 8)}%`,
                  left: `calc(${left}% + 4px)`,
                  width: `calc(${width}% - 8px)`,
                }}
              >
                <CalendarEventBlock
                  event={event}
                  compact={height < 10}
                  onClick={() => onSelectEvent?.(event)}
                />
              </div>
            );
          })}

          {showNowLine && (
            <div className={styles.nowLine} style={{ top: `${nowTopPercent}%` }}>
              <span className={styles.nowBadge}>{formatMinutesToLabel(currentMinutes)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
