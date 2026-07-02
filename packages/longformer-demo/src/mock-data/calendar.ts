import type { CalendarEvent, CalendarSource } from "longformer-ui";

const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, "0");
const pad = (n: number) => String(n).padStart(2, "0");

function dateOffset(dayOfMonth: number): string {
  return `${y}-${m}-${pad(dayOfMonth)}`;
}

const today = now.getDate();

export const calendarSources: CalendarSource[] = [
  { id: "reading", name: "Reading Schedule", group: "Google", tone: "accent" },
  { id: "birthdays", name: "Birthdays", group: "Google", tone: "success" },
  { id: "tasks", name: "Tasks", group: "Google", tone: "warning" },
  { id: "all-hands", name: "All Hands (engineering)", group: "Google", tone: "danger" },
  { id: "work", name: "Work", group: "iCloud", tone: "accent" },
  { id: "home", name: "Home", group: "iCloud", tone: "success" },
  { id: "finances", name: "Finances", group: "iCloud", tone: "warning" },
  { id: "family", name: "Family", group: "alex@all-hands.dev", tone: "accent" },
  { id: "health", name: "Health", group: "alex@all-hands.dev", tone: "success" },
  { id: "routine", name: "Routine", group: "alex@all-hands.dev", tone: "neutral" },
  { id: "fathom", name: "alex@studio.fm", group: "alex@studio.fm", tone: "warning" },
  { id: "holidays-ca", name: "Holidays in Canada", group: "Other", tone: "danger" },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Standup",
    date: dateOffset(today),
    startTime: "9:00 AM",
    endTime: "9:30 AM",
    tone: "accent",
    sourceId: "work",
  },
  {
    id: "e2",
    title: "Design review",
    date: dateOffset(today),
    startTime: "11:30 AM",
    endTime: "12:30 PM",
    tone: "warning",
    sourceId: "all-hands",
    location: "us06web.zoom.us",
    attendees: [{ name: "Riley Chen" }, { name: "Jordan Hayes" }],
  },
  {
    id: "e3",
    title: "1:1 with Sam",
    date: dateOffset(today),
    startTime: "2:00 PM",
    endTime: "2:45 PM",
    tone: "success",
    sourceId: "family",
  },
  {
    id: "e10",
    title: "Engineering Office Hours",
    date: dateOffset(today),
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    tone: "accent",
    sourceId: "all-hands",
    location: "us06web.zoom.us",
  },
  {
    id: "e11",
    title: "Design Sync",
    date: dateOffset(today),
    startTime: "11:30 AM",
    endTime: "12:30 PM",
    tone: "neutral",
    sourceId: "work",
    location: "us06web.zoom.us",
  },
  {
    id: "e4",
    title: "Picnic supply review",
    date: dateOffset(Math.min(today + 1, 28)),
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    tone: "accent",
    sourceId: "work",
  },
  {
    id: "e5",
    title: "Volunteer coordination retro",
    date: dateOffset(Math.min(today + 2, 28)),
    startTime: "3:00 PM",
    endTime: "4:00 PM",
    tone: "danger",
    sourceId: "all-hands",
    location: "Zoom",
  },
  {
    id: "e6",
    title: "Event planning sync",
    date: dateOffset(Math.min(today + 3, 28)),
    startTime: "9:30 AM",
    endTime: "11:00 AM",
    tone: "accent",
    sourceId: "work",
    attendees: [{ name: "Alex Morgan" }, { name: "Riley Chen" }, { name: "Jordan Hayes" }, { name: "Sam Patel" }],
  },
  {
    id: "e7",
    title: "Community forum walkthrough",
    date: dateOffset(Math.min(today + 3, 28)),
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    tone: "success",
    sourceId: "fathom",
  },
  {
    id: "e8",
    title: "No-meeting block",
    date: dateOffset(Math.min(today + 5, 28)),
    tone: "neutral",
    sourceId: "routine",
  },
  {
    id: "e12",
    title: "Independence Day",
    date: dateOffset(Math.min(today + 2, 28)),
    tone: "success",
    sourceId: "holidays-ca",
  },
  {
    id: "e13",
    title: "Independence Day",
    date: dateOffset(Math.min(today + 3, 28)),
    tone: "accent",
    sourceId: "holidays-ca",
  },
  {
    id: "e9",
    title: "Quarterly planning",
    date: dateOffset(Math.max(today - 4, 1)),
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    tone: "warning",
    sourceId: "finances",
  },
  {
    id: "e14",
    title: "Team lunch",
    date: dateOffset(Math.max(today - 1, 1)),
    startTime: "12:00 PM",
    endTime: "1:00 PM",
    tone: "success",
    sourceId: "work",
  },
  {
    id: "e15",
    title: "Product roadmap review",
    date: dateOffset(Math.max(today - 2, 1)),
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    tone: "accent",
    sourceId: "all-hands",
  },
];
