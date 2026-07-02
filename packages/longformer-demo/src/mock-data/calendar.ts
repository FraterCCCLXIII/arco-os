import type { CalendarEvent } from "longformer-ui";

const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, "0");
const pad = (n: number) => String(n).padStart(2, "0");

function dateOffset(dayOfMonth: number): string {
  return `${y}-${m}-${pad(dayOfMonth)}`;
}

const today = now.getDate();

export const calendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Standup",
    date: dateOffset(today),
    startTime: "9:00 AM",
    tone: "accent",
  },
  {
    id: "e2",
    title: "Design review",
    date: dateOffset(today),
    startTime: "11:30 AM",
    tone: "warning",
    attendees: [{ name: "Dana Cho" }, { name: "Marcus Webb" }],
  },
  {
    id: "e3",
    title: "1:1 with Priya",
    date: dateOffset(today),
    startTime: "2:00 PM",
    tone: "success",
  },
  {
    id: "e4",
    title: "Ship Notifications workspace",
    date: dateOffset(Math.min(today + 1, 28)),
    startTime: "10:00 AM",
    tone: "accent",
  },
  {
    id: "e5",
    title: "CI watchdog retro",
    date: dateOffset(Math.min(today + 2, 28)),
    startTime: "3:00 PM",
    tone: "danger",
    location: "Zoom",
  },
  {
    id: "e6",
    title: "Sprint planning",
    date: dateOffset(Math.min(today + 3, 28)),
    startTime: "9:30 AM",
    tone: "accent",
    attendees: [{ name: "Paul Bloch" }, { name: "Dana Cho" }, { name: "Marcus Webb" }, { name: "Priya Nair" }],
  },
  {
    id: "e7",
    title: "Longformer demo walkthrough",
    date: dateOffset(Math.min(today + 3, 28)),
    startTime: "1:00 PM",
    tone: "success",
  },
  {
    id: "e8",
    title: "No-meeting block",
    date: dateOffset(Math.min(today + 5, 28)),
    tone: "neutral",
  },
  {
    id: "e9",
    title: "Quarterly planning",
    date: dateOffset(Math.max(today - 4, 1)),
    startTime: "10:00 AM",
    tone: "warning",
  },
];
