import { useMemo } from "react";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { MiniCalendar } from "./MiniCalendar";
import type { CalendarEventTone, CalendarSource } from "./types";
import styles from "./CalendarSidebar.module.css";

export interface CalendarSidebarProps {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday?: () => void;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  highlightedDates?: string[];
  sources: CalendarSource[];
  enabledSourceIds: string[];
  onToggleSource: (sourceId: string) => void;
  className?: string;
}

const TONE_CLASS: Record<CalendarEventTone, string> = {
  accent: styles.toneAccent,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  neutral: styles.toneNeutral,
};

/** Left rail for the calendar workspace — mini month picker plus grouped source toggles. */
export function CalendarSidebar({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  onToday,
  selectedDate,
  onSelectDate,
  highlightedDates,
  sources,
  enabledSourceIds,
  onToggleSource,
  className,
}: CalendarSidebarProps) {
  const enabled = useMemo(() => new Set(enabledSourceIds), [enabledSourceIds]);

  const groupedSources = useMemo(() => {
    const groups = new Map<string, CalendarSource[]>();
    for (const source of sources) {
      const bucket = groups.get(source.group);
      if (bucket) bucket.push(source);
      else groups.set(source.group, [source]);
    }
    return Array.from(groups.entries()).map(([group, items]) => ({ group, items }));
  }, [sources]);

  return (
    <div className={cx(styles.sidebar, className)}>
      <MiniCalendar
        className={styles.miniCalendar}
        month={month}
        year={year}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onToday={onToday}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        highlightedDates={highlightedDates}
      />
      <div className={styles.sources} role="group" aria-label="Calendars">
        {groupedSources.map(({ group, items }) => (
          <div key={group} className={styles.sourceGroup}>
            <div className={styles.groupHeader}>{group}</div>
            {items.map((source) => {
              const checked = enabled.has(source.id);
              const tone = source.tone ?? "accent";

              return (
                <label
                  key={source.id}
                  className={cx(
                    styles.sourceRow,
                    checked && styles.sourceRowChecked,
                    TONE_CLASS[tone],
                  )}
                >
                  <input
                    type="checkbox"
                    className={cx("lf-focusable", styles.sourceInput)}
                    checked={checked}
                    onChange={() => onToggleSource(source.id)}
                  />
                  <span className={styles.sourceBox} aria-hidden="true">
                    {checked && <Icon name="check" size={11} strokeWidth={2.5} />}
                  </span>
                  <span className={styles.sourceLabel}>{source.name}</span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
