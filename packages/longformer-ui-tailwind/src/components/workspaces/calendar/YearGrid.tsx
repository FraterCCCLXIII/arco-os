import { useMemo } from "react";
import { cx } from "../../../utils/cx";
import { MONTH_LABELS, toISODate, type CalendarEvent } from "./types";
import styles from "./YearGrid.tailwind";

const MINI_WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export interface YearGridProps {
  year: number;
  events: CalendarEvent[];
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  onSelectMonth?: (month: number, year: number) => void;
}

interface DayCell {
  date: Date;
  iso: string;
  inMonth: boolean;
}

function buildMonthCells(month: number, year: number): DayCell[] {
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
}

export function YearGrid({
  year,
  events,
  selectedDate,
  onSelectDate,
  onSelectMonth,
}: YearGridProps) {
  const todayISO = toISODate(new Date());

  const highlightedDates = useMemo(
    () => new Set(events.map((event) => event.date)),
    [events],
  );

  return (
    <div className={styles.grid}>
      <div className={styles.months}>
        {MONTH_LABELS.map((monthLabel, monthIndex) => {
          const cells = buildMonthCells(monthIndex, year);

          return (
            <section key={monthLabel} className={styles.month}>
              <button
                type="button"
                className={cx("lf-focusable", styles.monthTitle)}
                onClick={() => onSelectMonth?.(monthIndex, year)}
              >
                {monthLabel}
              </button>
              <div className={styles.weekdayRow}>
                {MINI_WEEKDAY_LABELS.map((label, index) => (
                  <div key={`${label}-${index}`} className={styles.weekdayCell}>
                    {label}
                  </div>
                ))}
              </div>
              <div className={styles.days}>
                {cells.map(({ date, iso, inMonth }) => {
                  const isToday = iso === todayISO;
                  const isSelected = iso === selectedDate;

                  return (
                    <button
                      key={iso}
                      type="button"
                      className={cx(
                        "lf-focusable",
                        styles.day,
                        !inMonth && styles.dayOutside,
                        isToday && styles.dayToday,
                        isSelected && !isToday && styles.daySelected,
                        highlightedDates.has(iso) && styles.dayHasEvents,
                      )}
                      aria-current={isToday ? "date" : undefined}
                      aria-label={date.toDateString()}
                      onClick={() => onSelectDate?.(iso)}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
