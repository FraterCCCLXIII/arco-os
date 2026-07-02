export type CalendarEventTone = "accent" | "success" | "warning" | "danger" | "neutral";

export interface CalendarEvent {
  id: string;
  title: string;
  /** ISO date, e.g. "2026-07-14". */
  date: string;
  startTime?: string;
  endTime?: string;
  tone?: CalendarEventTone;
  location?: string;
  attendees?: { name: string; avatarSrc?: string }[];
}

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
