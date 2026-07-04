import { useMemo } from "react";
import { cx } from "../../../utils/cx";
import { ScheduleTaskCard } from "./ScheduleTaskCard";
import {
  addDaysISO,
  formatMinutesToLabel,
  type ScheduleItem,
} from "./types";
import { toISODate } from "../calendar/types";
import styles from "./WeekGrid.tailwind";

export interface WeekGridProps {
  weekStartISO: string;
  items: ScheduleItem[];
  /** First hour shown on the axis (24h). */
  startHour?: number;
  /** Last hour shown on the axis (24h, exclusive). */
  endHour?: number;
  /** Show Mon–Sat instead of Mon–Sun. */
  workWeek?: boolean;
  currentMinutes?: number;
  onSelectItem?: (item: ScheduleItem) => void;
}

const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function WeekGrid({
  weekStartISO,
  items,
  startHour = 6,
  endHour = 18,
  workWeek = true,
  currentMinutes = minutesSinceMidnight(new Date()),
  onSelectItem,
}: WeekGridProps) {
  const todayISO = toISODate(new Date());
  const dayCount = workWeek ? 6 : 7;
  const hourSpan = endHour - startHour;
  const startMinutes = startHour * 60;
  const totalMinutes = hourSpan * 60;

  const days = useMemo(() => {
    return Array.from({ length: dayCount }, (_, index) => {
      const iso = addDaysISO(weekStartISO, index);
      const dayNumber = Number(iso.split("-")[2]);
      return {
        iso,
        label: WEEKDAY_SHORT[index],
        dayNumber,
        isToday: iso === todayISO,
      };
    });
  }, [dayCount, todayISO, weekStartISO]);

  const itemsByDate = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>();
    for (const item of items) {
      if (item.startMinutes == null) continue;
      const bucket = map.get(item.date);
      if (bucket) bucket.push(item);
      else map.set(item.date, [item]);
    }
    for (const bucket of map.values()) {
      bucket.sort((a, b) => (a.startMinutes ?? 0) - (b.startMinutes ?? 0));
    }
    return map;
  }, [items]);

  const hours = useMemo(() => {
    return Array.from({ length: hourSpan }, (_, index) => startHour + index);
  }, [hourSpan, startHour]);

  const showNowLine =
    days.some((day) => day.isToday) &&
    currentMinutes >= startMinutes &&
    currentMinutes < startHour * 60 + totalMinutes;

  const nowTopPercent = ((currentMinutes - startMinutes) / totalMinutes) * 100;

  return (
    <div className={styles.grid}>
      <div className={styles.headerRow}>
        <div className={styles.timeGutter} aria-hidden="true" />
        {days.map((day) => (
          <div key={day.iso} className={cx(styles.dayHeader, day.isToday && styles.dayHeaderToday)}>
            <span className={styles.dayLabel}>{day.label}</span>
            <span className={styles.dayNumber}>{day.dayNumber}</span>
          </div>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.timeColumn}>
          {hours.map((hour) => (
            <div key={hour} className={styles.timeLabel}>
              {formatMinutesToLabel(hour * 60).replace(":00", "")}
            </div>
          ))}
        </div>

        <div className={styles.dayColumns}>
          {days.map((day) => (
            <div key={day.iso} className={styles.dayColumn}>
              {hours.map((hour) => (
                <div key={hour} className={styles.hourCell} />
              ))}
              {(itemsByDate.get(day.iso) ?? []).map((item) => {
                const top = ((item.startMinutes! - startMinutes) / totalMinutes) * 100;
                const height =
                  item.endMinutes != null
                    ? ((item.endMinutes - item.startMinutes!) / totalMinutes) * 100
                    : (60 / totalMinutes) * 100;
                return (
                  <div
                    key={item.id}
                    className={styles.itemSlot}
                    style={{ top: `${top}%`, height: `${Math.max(height, 6)}%` }}
                  >
                    <ScheduleTaskCard item={item} compact={height < 8} onClick={() => onSelectItem?.(item)} />
                  </div>
                );
              })}
            </div>
          ))}

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
