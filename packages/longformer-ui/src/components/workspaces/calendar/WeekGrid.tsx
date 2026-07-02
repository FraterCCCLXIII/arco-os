import { useMemo, type CSSProperties } from "react";
import { cx } from "../../../utils/cx";
import { CalendarEventBlock } from "./CalendarEventBlock";
import { EventChip } from "./EventChip";
import {
  addDaysISO,
  formatMinutesToLabel,
  layoutTimedEvents,
  toISODate,
  WEEKDAY_LABELS,
  type CalendarEvent,
} from "./types";
import styles from "./WeekGrid.module.css";

export interface CalendarWeekGridProps {
  weekStartISO: string;
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  startHour?: number;
  endHour?: number;
}

function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function CalendarWeekGrid({
  weekStartISO,
  events,
  onSelectEvent,
  startHour = 0,
  endHour = 24,
}: CalendarWeekGridProps) {
  const todayISO = toISODate(new Date());
  const hourSpan = endHour - startHour;
  const startMinutes = startHour * 60;
  const totalMinutes = hourSpan * 60;
  const currentMinutes = minutesSinceMidnight(new Date());

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const iso = addDaysISO(weekStartISO, index);
      const dayNumber = Number(iso.split("-")[2]);
      return {
        iso,
        label: WEEKDAY_LABELS[index],
        dayNumber,
        isToday: iso === todayISO,
      };
    });
  }, [todayISO, weekStartISO]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const bucket = map.get(event.date);
      if (bucket) bucket.push(event);
      else map.set(event.date, [event]);
    }
    return map;
  }, [events]);

  const allDayByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const day of days) {
      const dayEvents = eventsByDate.get(day.iso) ?? [];
      const allDay = dayEvents.filter((event) => !event.startTime);
      if (allDay.length) map.set(day.iso, allDay);
    }
    return map;
  }, [days, eventsByDate]);

  const hasAllDay = allDayByDate.size > 0;

  const hours = useMemo(
    () => Array.from({ length: hourSpan }, (_, index) => startHour + index),
    [hourSpan, startHour],
  );

  const showNowLine =
    days.some((day) => day.isToday) &&
    currentMinutes >= startMinutes &&
    currentMinutes < startHour * 60 + totalMinutes;
  const nowTopPercent = ((currentMinutes - startMinutes) / totalMinutes) * 100;

  return (
    <div className={styles.grid}>
      <div className={styles.stickyHead}>
        <div className={styles.headerRow}>
          <div className={styles.timeGutter} aria-hidden="true" />
          {days.map((day) => (
            <div key={day.iso} className={cx(styles.dayHeader, day.isToday && styles.dayHeaderToday)}>
              <span className={styles.dayLabel}>{day.label}</span>
              <span className={styles.dayNumber}>{day.dayNumber}</span>
            </div>
          ))}
        </div>

        {hasAllDay && (
          <div className={styles.allDayRow}>
            <div className={styles.allDayLabel}>all-day</div>
            {days.map((day) => (
              <div key={day.iso} className={styles.allDayColumn}>
                {(allDayByDate.get(day.iso) ?? []).map((event) => (
                  <EventChip key={event.id} event={event} onClick={() => onSelectEvent?.(event)} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

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

        <div className={styles.dayColumns}>
          {days.map((day) => {
            const timedLayouts = layoutTimedEvents(
              (eventsByDate.get(day.iso) ?? []).filter((event) => event.startTime),
            );

            return (
              <div key={day.iso} className={styles.dayColumn}>
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
                        left: `calc(${left}% + 2px)`,
                        width: `calc(${width}% - 4px)`,
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
