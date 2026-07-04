import type { ReactNode } from "react";
import { Icon } from "../../../icons";
import { Button } from "../../primitives/Button";
import { Chip } from "../../primitives/Chip";
import { IconButton } from "../../primitives/IconButton";
import { Tabs } from "../../primitives/Tabs";
import { MONTH_LABELS } from "../calendar/types";
import { MonthGrid } from "../calendar/MonthGrid";
import { TasksWorkspace } from "../tasks/TasksWorkspace";
import { KanbanBoard } from "./KanbanBoard";
import { TaskDetailPanel } from "./TaskDetailPanel";
import { WeekGrid } from "./WeekGrid";
import {
  filterScheduleItems,
  scheduleItemToCalendarEvent,
  scheduleItemToTaskItem,
  type ScheduleItem,
  type ScheduleProject,
  type ScheduleStatusFilter,
  type ScheduleView,
} from "./types";
import styles from "./ScheduleWorkspace.tailwind";

export interface ScheduleWorkspaceProps {
  weekStartISO: string;
  month: number;
  year: number;
  items: ScheduleItem[];
  projects?: ScheduleProject[];
  view: ScheduleView;
  onViewChange: (view: ScheduleView) => void;
  statusFilter: ScheduleStatusFilter;
  onStatusFilterChange: (filter: ScheduleStatusFilter) => void;
  selectedProjectId?: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  selectedItem?: ScheduleItem | null;
  onSelectItem?: (item: ScheduleItem | null) => void;
  onToggleComplete?: (id: string) => void;
  onConfirmAttending?: (id: string) => void;
  onDeclineAttending?: (id: string) => void;
  onNewProject?: () => void;
  unreadUpdates?: number;
  actions?: ReactNode;
}

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "backlog", label: "Backlog" },
  { id: "active", label: "Active" },
  { id: "closed", label: "Closed" },
];

const VIEW_TABS = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "list", label: "List" },
  { id: "board", label: "Board" },
];

export function ScheduleWorkspace({
  weekStartISO,
  month,
  year,
  items,
  projects = [],
  view,
  onViewChange,
  statusFilter,
  onStatusFilterChange,
  selectedProjectId,
  onPrevWeek,
  onNextWeek,
  onPrevMonth,
  onNextMonth,
  onToday,
  selectedDate,
  onSelectDate,
  selectedItem = null,
  onSelectItem,
  onToggleComplete,
  onConfirmAttending,
  onDeclineAttending,
  onNewProject,
  unreadUpdates = 0,
  actions,
}: ScheduleWorkspaceProps) {
  const filteredItems = filterScheduleItems(items, statusFilter, selectedProjectId);
  const calendarEvents = filteredItems.map(scheduleItemToCalendarEvent);
  const listTasks = filteredItems.map(scheduleItemToTaskItem);

  return (
    <div className={styles.workspace}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrow}>Schedule</div>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{MONTH_LABELS[month]} {year}</h1>
              <div className={styles.nav}>
                {view === "week" ? (
                  <>
                    <IconButton icon="chevron-left" label="Previous week" size="sm" onClick={onPrevWeek} />
                    <IconButton icon="chevron-right" label="Next week" size="sm" onClick={onNextWeek} />
                  </>
                ) : (
                  <>
                    <IconButton icon="chevron-left" label="Previous month" size="sm" onClick={onPrevMonth} />
                    <IconButton icon="chevron-right" label="Next month" size="sm" onClick={onNextMonth} />
                  </>
                )}
              </div>
              <Button variant="secondary" size="sm" onClick={onToday}>
                Today
              </Button>
            </div>
          </div>
          <div className={styles.headerActions}>
            {actions}
            <Button variant="secondary" size="sm">
              Updates
              {unreadUpdates > 0 && <span className={styles.updatesDot} aria-label={`${unreadUpdates} updates`} />}
            </Button>
            {onNewProject && (
              <Button variant="primary" size="sm" onClick={onNewProject}>
                <Icon name="plus" size={14} />
                New project
              </Button>
            )}
          </div>
        </header>

        <div className={styles.toolbar}>
          <Tabs
            items={STATUS_TABS}
            value={statusFilter}
            onChange={(id) => onStatusFilterChange(id as ScheduleStatusFilter)}
            variant="underline"
            aria-label="Status filter"
          />
          <div className={styles.toolbarRight}>
            <Chip icon="plus">Filter</Chip>
            <Tabs
              items={VIEW_TABS}
              value={view}
              onChange={(id) => onViewChange(id as ScheduleView)}
              variant="pill"
              aria-label="Schedule view"
            />
          </div>
        </div>

        <div className={styles.content}>
          {view === "week" && (
            <WeekGrid
              weekStartISO={weekStartISO}
              items={filteredItems}
              onSelectItem={(item) => onSelectItem?.(item)}
            />
          )}
          {view === "month" && (
            <MonthGrid
              month={month}
              year={year}
              events={calendarEvents}
              selectedDate={selectedDate}
              onSelectDate={onSelectDate}
              onSelectEvent={(event) => {
                const item = filteredItems.find((candidate) => candidate.id === event.id);
                if (item) onSelectItem?.(item);
              }}
            />
          )}
          {view === "list" && (
            <TasksWorkspace
              title="Scheduled tasks"
              tasks={listTasks}
              onToggleComplete={(id) => onToggleComplete?.(id)}
            />
          )}
          {view === "board" && (
            <KanbanBoard items={filteredItems} projects={projects} onSelectItem={(item) => onSelectItem?.(item)} />
          )}
        </div>
      </div>

      <TaskDetailPanel
        item={selectedItem}
        open={Boolean(selectedItem)}
        onClose={() => onSelectItem?.(null)}
        onConfirmAttending={onConfirmAttending}
        onDeclineAttending={onDeclineAttending}
      />
    </div>
  );
}
