import { useMemo } from "react";
import { cx } from "../../../utils/cx";
import { IconButton } from "../../primitives/IconButton";
import { MONTH_LABELS, toISODate } from "./types";
import styles from "./MiniCalendar.module.css";

const MINI_WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export interface MiniCalendarProps {
  /** 0-indexed, January = 0. */
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday?: () => void;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  /** ISO dates (e.g. "2026-07-14") that should render a small marker dot, such as task due dates. */
  highlightedDates?: string[];
  className?: string;
}

interface DayCell {
  date: Date;
  iso: string;
  inMonth: boolean;
}

/** A compact, dependency-free month calendar for sidebars — navigation + date selection, no event list. */
export function MiniCalendar({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  onToday,
  selectedDate,
  onSelectDate,
  highlightedDates,
  className,
}: MiniCalendarProps) {
  const todayISO = toISODate(new Date());

  const highlighted = useMemo(() => new Set(highlightedDates ?? []), [highlightedDates]);

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

  return (
    <div className={cx(styles.calendar, className)}>
      <div className={styles.header}>
        <button type="button" className={cx("lf-focusable", styles.titleButton)} onClick={onToday} disabled={!onToday}>
          {MONTH_LABELS[month]} {year}
        </button>
        <div className={styles.nav}>
          <IconButton icon="chevron-left" label="Previous month" size="sm" iconSize={14} onClick={onPrevMonth} />
          <IconButton icon="chevron-right" label="Next month" size="sm" iconSize={14} onClick={onNextMonth} />
        </div>
      </div>
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
              )}
              aria-current={isToday ? "date" : undefined}
              aria-pressed={isSelected}
              aria-label={date.toDateString()}
              onClick={() => onSelectDate?.(iso)}
            >
              <span className={styles.dayNumber}>{date.getDate()}</span>
              {highlighted.has(iso) && <span className={styles.dot} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
