import type { ReactNode } from "react";
import { Button } from "../../primitives/Button";
import { IconButton } from "../../primitives/IconButton";
import { MonthGrid } from "./MonthGrid";
import { MONTH_LABELS, type CalendarEvent } from "./types";
import styles from "./CalendarWorkspace.module.css";

export interface CalendarWorkspaceProps {
  /** 0-indexed, January = 0. */
  month: number;
  year: number;
  events: CalendarEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday?: () => void;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
  onNewEvent?: () => void;
  actions?: ReactNode;
}

/** A month-grid calendar workspace — the Google Calendar / Notion Calendar pattern. */
export function CalendarWorkspace({
  month,
  year,
  events,
  onPrevMonth,
  onNextMonth,
  onToday,
  selectedDate,
  onSelectDate,
  onSelectEvent,
  onNewEvent,
  actions,
}: CalendarWorkspaceProps) {
  return (
    <div className={styles.workspace}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.title}>
              {MONTH_LABELS[month]} {year}
            </div>
            <div className={styles.nav}>
              <IconButton icon="chevron-left" label="Previous month" size="sm" onClick={onPrevMonth} />
              <IconButton icon="chevron-right" label="Next month" size="sm" onClick={onNextMonth} />
            </div>
            {onToday && (
              <Button variant="secondary" size="sm" onClick={onToday}>
                Today
              </Button>
            )}
          </div>
          <div className={styles.headerActions}>
            {actions}
            {onNewEvent && (
              <Button variant="primary" size="sm" onClick={onNewEvent}>
                New event
              </Button>
            )}
          </div>
        </div>
        <div className={styles.grid}>
          <MonthGrid
            month={month}
            year={year}
            events={events}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            onSelectEvent={onSelectEvent}
          />
        </div>
      </div>
    </div>
  );
}
