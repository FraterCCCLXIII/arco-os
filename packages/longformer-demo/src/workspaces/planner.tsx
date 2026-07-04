/**
 * Planner workspace layouts — calendar, schedule (timeline), tasks, and
 * notifications. Calendar and tasks share the MiniCalendar sidebar pattern;
 * both funnel date picks through `selectCalendarDate` so selecting a day in
 * another month also flips the visible month.
 */
import {
  CalendarSidebar,
  CalendarWorkspace,
  Icon,
  MiniCalendar,
  NavSidebar,
  NotificationsWorkspace,
  ScheduleWorkspace,
  ScrollArea,
  SidebarUserFooter,
  TasksWorkspace,
} from "longformer-ui";
import { primaryUser } from "../demo-personas";
import type { WorkspaceLayoutBuilder } from "./types";

function selectCalendarDate(
  iso: string,
  month: number,
  year: number,
  onMonthChange: (month: number, year: number) => void,
  onSelectDate: (date: string) => void,
) {
  const [yearPart, monthPart] = iso.split("-").map(Number);
  const targetMonth = monthPart - 1;
  if (targetMonth !== month || yearPart !== year) {
    onMonthChange(targetMonth, yearPart);
  }
  onSelectDate(iso);
}

export const buildCalendarLayout: WorkspaceLayoutBuilder = (vm, { includeSidebar }) => {
  const calendarHighlightedDates = Array.from(
    new Set(
      vm.calendarEvents
        .filter((event) => !event.sourceId || vm.enabledCalendarSourceIds.includes(event.sourceId))
        .map((event) => event.date),
    ),
  );

  return {
    sidebar: includeSidebar ? (
      <ScrollArea style={{ height: "100%", padding: "var(--lf-space-4) var(--lf-space-3)" }}>
        <CalendarSidebar
          month={vm.calendarMonth}
          year={vm.calendarYear}
          onPrevMonth={vm.handlePrevMonth}
          onNextMonth={vm.handleNextMonth}
          onToday={vm.handleToday}
          selectedDate={vm.selectedDate}
          onSelectDate={(iso) =>
            selectCalendarDate(
              iso,
              vm.calendarMonth,
              vm.calendarYear,
              vm.handleCalendarMonthChange,
              vm.setSelectedDate,
            )
          }
          highlightedDates={calendarHighlightedDates}
          sources={vm.calendarSources}
          enabledSourceIds={vm.enabledCalendarSourceIds}
          onToggleSource={vm.handleToggleCalendarSource}
        />
      </ScrollArea>
    ) : undefined,
    main: (
      <CalendarWorkspace
        month={vm.calendarMonth}
        year={vm.calendarYear}
        view={vm.calendarView}
        onViewChange={vm.setCalendarView}
        weekStartISO={vm.weekStartISO}
        events={vm.calendarEvents}
        onPrevMonth={vm.handlePrevMonth}
        onNextMonth={vm.handleNextMonth}
        onPrevWeek={vm.handlePrevWeek}
        onNextWeek={vm.handleNextWeek}
        onPrevDay={vm.handlePrevDay}
        onNextDay={vm.handleNextDay}
        onPrevYear={vm.handlePrevYear}
        onNextYear={vm.handleNextYear}
        onToday={vm.handleToday}
        onMonthChange={vm.handleCalendarMonthChange}
        selectedDate={vm.selectedDate}
        onSelectDate={vm.setSelectedDate}
        sources={vm.calendarSources}
        enabledSourceIds={vm.enabledCalendarSourceIds}
        onNewEvent={() => undefined}
      />
    ),
  };
};

export const buildScheduleLayout: WorkspaceLayoutBuilder = (vm, { includeSidebar }) => ({
  sidebar: includeSidebar ? (
    <NavSidebar
      quickLinks={[
        {
          id: "inbox",
          label: "Inbox",
          icon: "inbox",
          onClick: () => vm.setWorkspaceId("notifications"),
        },
        {
          id: "calendar",
          label: "Calendar",
          icon: "calendar",
          active: true,
        },
      ]}
      sections={[
        {
          id: "channels",
          title: "My channels",
          items: [
            { id: "dashboard", label: "Dashboard", leading: <Icon name="grid" size={14} /> },
            {
              id: "tasks",
              label: "Tasks",
              leading: <Icon name="check" size={14} />,
              onClick: () => vm.setWorkspaceId("tasks"),
            },
            {
              id: "messages",
              label: "Messages",
              leading: <Icon name="chat" size={14} />,
              onClick: () => vm.setWorkspaceId("messages"),
            },
            {
              id: "groups",
              label: "Groups",
              leading: <Icon name="hash" size={14} />,
              onClick: () => vm.setWorkspaceId("slack"),
            },
            {
              id: "notifications",
              label: "Notifications",
              leading: <Icon name="bell" size={14} />,
              onClick: () => vm.setWorkspaceId("notifications"),
            },
            {
              id: "settings",
              label: "Settings",
              leading: <Icon name="settings" size={14} />,
              onClick: () => vm.setWorkspaceId("settings"),
            },
          ],
        },
        {
          id: "favourites",
          title: "Favourites",
          items: vm.scheduleProjects.map((project) => ({
            id: project.id,
            label: project.name,
            leading: (
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: project.color,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
            ),
            active: vm.selectedScheduleProjectId === project.id,
            onClick: () =>
              vm.setSelectedScheduleProjectId(
                vm.selectedScheduleProjectId === project.id ? undefined : project.id,
              ),
          })),
        },
      ]}
      footer={<SidebarUserFooter name={primaryUser.name} meta="Visual Designer · Longformer" />}
    />
  ) : undefined,
  main: (
    <ScheduleWorkspace
      weekStartISO={vm.weekStartISO}
      month={vm.calendarMonth}
      year={vm.calendarYear}
      items={vm.scheduleItems}
      projects={vm.scheduleProjects}
      view={vm.scheduleView}
      onViewChange={vm.setScheduleView}
      statusFilter={vm.scheduleStatusFilter}
      onStatusFilterChange={vm.setScheduleStatusFilter}
      selectedProjectId={vm.selectedScheduleProjectId}
      onPrevWeek={vm.handlePrevWeek}
      onNextWeek={vm.handleNextWeek}
      onPrevMonth={vm.handlePrevMonth}
      onNextMonth={vm.handleNextMonth}
      onToday={vm.handleToday}
      selectedDate={vm.selectedDate}
      onSelectDate={vm.setSelectedDate}
      selectedItem={vm.selectedScheduleItem}
      onSelectItem={vm.setSelectedScheduleItem}
      onToggleComplete={(id) =>
        vm.setScheduleItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: item.status === "closed" ? "backlog" : "closed" }
              : item,
          ),
        )
      }
      onConfirmAttending={() => vm.setSelectedScheduleItem(null)}
      onDeclineAttending={() => vm.setSelectedScheduleItem(null)}
      onNewProject={() => undefined}
      unreadUpdates={3}
    />
  ),
});

export const buildTasksLayout: WorkspaceLayoutBuilder = (vm, { includeSidebar }) => ({
  sidebar: includeSidebar ? (
    <ScrollArea style={{ height: "100%", padding: "var(--lf-space-4) var(--lf-space-3)" }}>
      <MiniCalendar
        month={vm.calendarMonth}
        year={vm.calendarYear}
        onPrevMonth={vm.handlePrevMonth}
        onNextMonth={vm.handleNextMonth}
        onToday={vm.handleToday}
        selectedDate={vm.selectedDate}
        onSelectDate={(iso) =>
          selectCalendarDate(
            iso,
            vm.calendarMonth,
            vm.calendarYear,
            vm.handleCalendarMonthChange,
            vm.setSelectedDate,
          )
        }
        highlightedDates={vm.tasks
          .map((task) => task.dueDateISO)
          .filter((iso): iso is string => Boolean(iso))}
      />
    </ScrollArea>
  ) : undefined,
  main: (
    <TasksWorkspace
      tasks={vm.tasks}
      onToggleComplete={(id) =>
        vm.setTasks((prev) =>
          prev.map((task) =>
            task.id === id
              ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
              : task,
          ),
        )
      }
    />
  ),
});

export const buildNotificationsLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <NotificationsWorkspace
      notifications={vm.notifications}
      onMarkAsRead={(id) =>
        vm.setNotifications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
        )
      }
      onMarkAllAsRead={() => vm.setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))}
    />
  ),
});
