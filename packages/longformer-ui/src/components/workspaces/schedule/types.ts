import type { CalendarEvent, CalendarEventTone } from "../calendar/types";
import type { TaskItem, TaskPriority, TaskStatus } from "../tasks/types";

export type ScheduleView = "week" | "month" | "list" | "board";
export type ScheduleStatusFilter = "all" | "backlog" | "active" | "closed";

export type ScheduleItemTone = CalendarEventTone | "beige" | "pink" | "blue" | "purple";

export type ScheduleItemStatus = "backlog" | "active" | "closed";

export interface ScheduleProject {
  id: string;
  name: string;
  /** CSS color used for the project swatch. */
  color: string;
}

export interface ScheduleChannel {
  id: string;
  label: string;
  icon?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  /** ISO date, e.g. "2026-07-14". */
  date: string;
  /** Minutes from midnight, e.g. 580 = 9:40 AM. */
  startMinutes?: number;
  endMinutes?: number;
  tone?: ScheduleItemTone;
  status: ScheduleItemStatus;
  projectId?: string;
  channelId?: string;
  assignees?: { name: string; avatarSrc?: string }[];
  priority?: TaskPriority;
  requiresRsvp?: boolean;
  location?: string;
}

export const SCHEDULE_STATUS_LABEL: Record<ScheduleItemStatus, string> = {
  backlog: "Backlog",
  active: "Active",
  closed: "Closed",
};

export const SCHEDULE_VIEW_LABEL: Record<ScheduleView, string> = {
  week: "Week",
  month: "Month",
  list: "List",
  board: "Board",
};

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseTimeLabelToMinutes(label: string): number {
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function formatMinutesToLabel(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

export function formatTimeRange(startMinutes?: number, endMinutes?: number): string | undefined {
  if (startMinutes == null) return undefined;
  if (endMinutes == null) return formatMinutesToLabel(startMinutes);
  return `${formatMinutesToLabel(startMinutes)} – ${formatMinutesToLabel(endMinutes)}`;
}

export function getWeekStart(date: Date, weekStartsOnMonday = true): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = copy.getDay();
  const offset = weekStartsOnMonday ? (day === 0 ? -6 : 1 - day) : -day;
  copy.setDate(copy.getDate() + offset);
  return copy;
}

export function addDaysISO(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);
  return toISODate(date);
}

export function scheduleItemToCalendarEvent(item: ScheduleItem): CalendarEvent {
  return {
    id: item.id,
    title: item.title,
    date: item.date,
    startTime: formatTimeRange(item.startMinutes, item.endMinutes)?.split(" – ")[0],
    endTime: item.endMinutes != null ? formatMinutesToLabel(item.endMinutes) : undefined,
    tone: item.tone === "beige" || item.tone === "pink" || item.tone === "blue" || item.tone === "purple" ? "accent" : item.tone,
    location: item.location,
    attendees: item.assignees,
  };
}

export function scheduleItemToTaskItem(item: ScheduleItem): TaskItem {
  const statusMap: Record<ScheduleItemStatus, TaskStatus> = {
    backlog: "pending",
    active: "in_progress",
    closed: "completed",
  };
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    status: statusMap[item.status],
    priority: item.priority,
    assignee: item.assignees?.[0],
    dueDateISO: item.date,
    dueDate: item.date,
  };
}

export function filterScheduleItems(
  items: ScheduleItem[],
  statusFilter: ScheduleStatusFilter,
  projectId?: string,
): ScheduleItem[] {
  return items.filter((item) => {
    if (projectId && item.projectId !== projectId) return false;
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });
}
