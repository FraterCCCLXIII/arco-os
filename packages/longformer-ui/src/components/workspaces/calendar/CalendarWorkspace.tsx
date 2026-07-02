import { useMemo, type ReactNode } from "react";
import { Button } from "../../primitives/Button";
import { IconButton } from "../../primitives/IconButton";
import { ResizablePane } from "../../primitives/ResizablePane";
import { ScrollArea } from "../../primitives/ScrollArea";
import { Tabs } from "../../primitives/Tabs";
import { CalendarSidebar } from "./CalendarSidebar";
import { DayGrid } from "./DayGrid";
import { MonthGrid } from "./MonthGrid";
import { CalendarWeekGrid } from "./WeekGrid";
import { YearGrid } from "./YearGrid";
import {
  addDaysISO,
  formatDayTitle,
  getWeekStartSunday,
  MONTH_LABELS,
  parseISODate,
  toISODate,
  type CalendarEvent,
  type CalendarSource,
  type CalendarView,
} from "./types";
import styles from "./CalendarWorkspace.module.css";

export interface CalendarWorkspaceProps {
  /** 0-indexed, January = 0. */
  month: number;
  year: number;
  events: CalendarEvent[];
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  weekStartISO?: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  onPrevDay?: () => void;
  onNextDay?: () => void;
  onPrevYear?: () => void;
  onNextYear?: () => void;
  onToday?: () => void;
  onMonthChange?: (month: number, year: number) => void;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
  onNewEvent?: () => void;
  sources?: CalendarSource[];
  enabledSourceIds?: string[];
  onToggleSource?: (sourceId: string) => void;
  sidebarWidth?: number;
  defaultSidebarWidth?: number;
  onSidebarWidthChange?: (width: number) => void;
  actions?: ReactNode;
}

const VIEW_TABS = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

/** Calendar workspace with day, week, month, and year views plus optional sidebar filters. */
export function CalendarWorkspace({
  month,
  year,
  events,
  view = "month",
  onViewChange,
  weekStartISO,
  onPrevMonth,
  onNextMonth,
  onPrevWeek,
  onNextWeek,
  onPrevDay,
  onNextDay,
  onPrevYear,
  onNextYear,
  onToday,
  onMonthChange,
  selectedDate,
  onSelectDate,
  onSelectEvent,
  onNewEvent,
  sources,
  enabledSourceIds,
  onToggleSource,
  sidebarWidth,
  defaultSidebarWidth = 248,
  onSidebarWidthChange,
  actions,
}: CalendarWorkspaceProps) {
  const todayISO = toISODate(new Date());
  const focusDateISO = selectedDate ?? todayISO;

  const enabledSources = useMemo(
    () => new Set(enabledSourceIds ?? sources?.map((source) => source.id) ?? []),
    [enabledSourceIds, sources],
  );

  const visibleEvents = useMemo(() => {
    if (!sources?.length) return events;
    return events.filter((event) => !event.sourceId || enabledSources.has(event.sourceId));
  }, [events, enabledSources, sources]);

  const highlightedDates = useMemo(
    () => Array.from(new Set(visibleEvents.map((event) => event.date))),
    [visibleEvents],
  );

  const resolvedWeekStartISO = useMemo(() => {
    if (weekStartISO) return weekStartISO;
    return toISODate(getWeekStartSunday(parseISODate(focusDateISO)));
  }, [focusDateISO, weekStartISO]);

  const dayEvents = useMemo(
    () => visibleEvents.filter((event) => event.date === focusDateISO),
    [focusDateISO, visibleEvents],
  );

  const weekEvents = useMemo(() => {
    const weekEndISO = addDaysISO(resolvedWeekStartISO, 6);
    return visibleEvents.filter((event) => event.date >= resolvedWeekStartISO && event.date <= weekEndISO);
  }, [resolvedWeekStartISO, visibleEvents]);

  const handleSelectDate = (iso: string) => {
    const [yearPart, monthPart] = iso.split("-").map(Number);
    const targetMonth = monthPart - 1;
    if (targetMonth !== month || yearPart !== year) {
      onMonthChange?.(targetMonth, yearPart);
    }
    onSelectDate?.(iso);
  };

  const handleYearSelectDate = (iso: string) => {
    handleSelectDate(iso);
    onViewChange?.("day");
  };

  const handleYearSelectMonth = (targetMonth: number, targetYear: number) => {
    onMonthChange?.(targetMonth, targetYear);
    onViewChange?.("month");
  };

  const showSidebar = Boolean(sources?.length && onToggleSource);

  const headerTitle = (() => {
    switch (view) {
      case "day":
        return formatDayTitle(focusDateISO);
      case "week": {
        const weekDate = parseISODate(resolvedWeekStartISO);
        return `${MONTH_LABELS[weekDate.getMonth()]} ${weekDate.getFullYear()}`;
      }
      case "year":
        return String(year);
      case "month":
      default:
        return `${MONTH_LABELS[month]} ${year}`;
    }
  })();

  return (
    <div className={styles.workspace}>
      {showSidebar && (
        <ResizablePane
          width={sidebarWidth}
          defaultWidth={defaultSidebarWidth}
          onWidthChange={onSidebarWidthChange}
          minWidth={200}
          maxWidth={320}
          handleSide="right"
          className={styles.sidebarResizable}
          paneClassName={styles.sidebarPane}
          handleLabel="Resize calendar sidebar"
        >
          <ScrollArea className={styles.sidebarScroll}>
            <CalendarSidebar
              month={month}
              year={year}
              onPrevMonth={onPrevMonth}
              onNextMonth={onNextMonth}
              onToday={onToday}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              highlightedDates={highlightedDates}
              sources={sources!}
              enabledSourceIds={Array.from(enabledSources)}
              onToggleSource={onToggleSource!}
            />
          </ScrollArea>
        </ResizablePane>
      )}
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.title}>{headerTitle}</div>
              <div className={styles.nav}>
                {view === "day" && onPrevDay && onNextDay ? (
                  <>
                    <IconButton icon="chevron-left" label="Previous day" size="sm" onClick={onPrevDay} />
                    <IconButton icon="chevron-right" label="Next day" size="sm" onClick={onNextDay} />
                  </>
                ) : view === "week" && onPrevWeek && onNextWeek ? (
                  <>
                    <IconButton icon="chevron-left" label="Previous week" size="sm" onClick={onPrevWeek} />
                    <IconButton icon="chevron-right" label="Next week" size="sm" onClick={onNextWeek} />
                  </>
                ) : view === "year" && onPrevYear && onNextYear ? (
                  <>
                    <IconButton icon="chevron-left" label="Previous year" size="sm" onClick={onPrevYear} />
                    <IconButton icon="chevron-right" label="Next year" size="sm" onClick={onNextYear} />
                  </>
                ) : (
                  <>
                    <IconButton icon="chevron-left" label="Previous month" size="sm" onClick={onPrevMonth} />
                    <IconButton icon="chevron-right" label="Next month" size="sm" onClick={onNextMonth} />
                  </>
                )}
              </div>
              {onToday && (
                <Button variant="secondary" size="sm" onClick={onToday}>
                  Today
                </Button>
              )}
            </div>
            {onViewChange && (
              <div className={styles.headerCenter}>
                <Tabs
                  items={VIEW_TABS}
                  value={view}
                  onChange={(id) => onViewChange(id as CalendarView)}
                  variant="pill"
                  aria-label="Calendar view"
                />
              </div>
            )}
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
            {view === "day" && (
              <DayGrid dateISO={focusDateISO} events={dayEvents} onSelectEvent={onSelectEvent} />
            )}
            {view === "week" && (
              <CalendarWeekGrid
                weekStartISO={resolvedWeekStartISO}
                events={weekEvents}
                onSelectEvent={onSelectEvent}
              />
            )}
            {view === "month" && (
              <MonthGrid
                month={month}
                year={year}
                events={visibleEvents}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                onSelectEvent={onSelectEvent}
              />
            )}
            {view === "year" && (
              <YearGrid
                year={year}
                events={visibleEvents}
                selectedDate={selectedDate}
                onSelectDate={handleYearSelectDate}
                onSelectMonth={handleYearSelectMonth}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
