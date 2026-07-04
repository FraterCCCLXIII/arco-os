/**
 * Planner state — calendar navigation and the schedule (timeline) workspace.
 * Calendar and schedule share the week cursor: switching the calendar to
 * week view re-anchors `weekStartISO`, and the schedule's prev/next-week
 * controls move the same value.
 */
import { useCallback, useMemo, useState } from "react";
import {
  addDaysISO,
  getWeekStartSunday,
  parseISODate,
  toISODate,
  type CalendarView,
  type ScheduleItem,
  type ScheduleStatusFilter,
  type ScheduleView,
} from "longformer-ui";
import { calendarEvents, calendarSources } from "../mock-data/calendar";
import { scheduleItems, scheduleProjects, weekStartISO as initialWeekStartISO } from "../mock-data/schedule";

export function usePlannerState() {
  // "Today" is frozen at mount so month math stays stable across renders.
  const today = useMemo(() => new Date(), []);

  // --- Calendar ------------------------------------------------------
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [enabledCalendarSourceIds, setEnabledCalendarSourceIds] = useState(() =>
    calendarSources.map((source) => source.id),
  );
  const [weekStartISO, setWeekStartISO] = useState(initialWeekStartISO);

  const handlePrevMonth = useCallback(() => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((year) => year - 1);
    } else {
      setCalendarMonth((month) => month - 1);
    }
  }, [calendarMonth]);

  const handleNextMonth = useCallback(() => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((year) => year + 1);
    } else {
      setCalendarMonth((month) => month + 1);
    }
  }, [calendarMonth]);

  // Day stepping keeps the visible month in sync with the new selection.
  const handlePrevDay = useCallback(() => {
    const focus = selectedDate ?? toISODate(today);
    const next = addDaysISO(focus, -1);
    setSelectedDate(next);
    const date = parseISODate(next);
    setCalendarMonth(date.getMonth());
    setCalendarYear(date.getFullYear());
  }, [selectedDate, today]);

  const handleNextDay = useCallback(() => {
    const focus = selectedDate ?? toISODate(today);
    const next = addDaysISO(focus, 1);
    setSelectedDate(next);
    const date = parseISODate(next);
    setCalendarMonth(date.getMonth());
    setCalendarYear(date.getFullYear());
  }, [selectedDate, today]);

  const handlePrevYear = useCallback(() => {
    setCalendarYear((year) => year - 1);
  }, []);

  const handleNextYear = useCallback(() => {
    setCalendarYear((year) => year + 1);
  }, []);

  /** Switching into week view anchors the week to the focused date. */
  const handleCalendarViewChange = useCallback(
    (view: CalendarView) => {
      setCalendarView(view);
      if (view === "week") {
        const focus = selectedDate ?? toISODate(today);
        setWeekStartISO(toISODate(getWeekStartSunday(parseISODate(focus))));
      }
    },
    [selectedDate, today],
  );

  const handleToday = useCallback(() => {
    setCalendarMonth(today.getMonth());
    setCalendarYear(today.getFullYear());
    setSelectedDate(undefined);
    setWeekStartISO(toISODate(getWeekStartSunday(today)));
  }, [today]);

  const handleCalendarMonthChange = useCallback((month: number, year: number) => {
    setCalendarMonth(month);
    setCalendarYear(year);
  }, []);

  const handleToggleCalendarSource = useCallback((sourceId: string) => {
    setEnabledCalendarSourceIds((prev) =>
      prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId],
    );
  }, []);

  const handlePrevWeek = useCallback(() => {
    setWeekStartISO((iso) => addDaysISO(iso, -7));
  }, []);

  const handleNextWeek = useCallback(() => {
    setWeekStartISO((iso) => addDaysISO(iso, 7));
  }, []);

  // --- Schedule -----------------------------------------------------
  const [scheduleView, setScheduleView] = useState<ScheduleView>("week");
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState<ScheduleStatusFilter>("all");
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<ScheduleItem | null>(null);
  const [selectedScheduleProjectId, setSelectedScheduleProjectId] = useState<string | undefined>(undefined);
  const [scheduleItemsState, setScheduleItemsState] = useState(scheduleItems);

  return useMemo(
    () => ({
      calendarMonth,
      calendarYear,
      calendarView,
      setCalendarView: handleCalendarViewChange,
      handlePrevMonth,
      handleNextMonth,
      handlePrevDay,
      handleNextDay,
      handlePrevYear,
      handleNextYear,
      handleToday,
      handleCalendarMonthChange,
      selectedDate,
      setSelectedDate,
      calendarEvents,
      calendarSources,
      enabledCalendarSourceIds,
      handleToggleCalendarSource,
      weekStartISO,
      handlePrevWeek,
      handleNextWeek,
      scheduleItems: scheduleItemsState,
      setScheduleItems: setScheduleItemsState,
      scheduleProjects,
      scheduleView,
      setScheduleView,
      scheduleStatusFilter,
      setScheduleStatusFilter,
      selectedScheduleItem,
      setSelectedScheduleItem,
      selectedScheduleProjectId,
      setSelectedScheduleProjectId,
    }),
    [
      calendarMonth,
      calendarYear,
      calendarView,
      handleCalendarViewChange,
      handlePrevMonth,
      handleNextMonth,
      handlePrevDay,
      handleNextDay,
      handlePrevYear,
      handleNextYear,
      handleToday,
      handleCalendarMonthChange,
      selectedDate,
      enabledCalendarSourceIds,
      handleToggleCalendarSource,
      weekStartISO,
      handlePrevWeek,
      handleNextWeek,
      scheduleItemsState,
      scheduleView,
      scheduleStatusFilter,
      selectedScheduleItem,
      selectedScheduleProjectId,
    ],
  );
}

export type PlannerSlice = ReturnType<typeof usePlannerState>;
