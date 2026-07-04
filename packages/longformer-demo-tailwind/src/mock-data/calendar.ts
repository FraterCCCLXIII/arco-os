import type { CalendarEvent, CalendarSource } from "longformer-ui-tailwind";
import { companies, primaryUser, teamMembers } from "../demo-personas";

const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, "0");
const pad = (n: number) => String(n).padStart(2, "0");

function dateOffset(dayOfMonth: number): string {
  return `${y}-${m}-${pad(dayOfMonth)}`;
}

const today = now.getDate();
const eventsEmail = `events@${companies.emailDomain}`;

export const calendarSources: CalendarSource[] = [
  { id: "volunteer-shifts", name: "Volunteer Shifts", group: "Google", tone: "accent" },
  { id: "birthdays", name: "Team Birthdays", group: "Google", tone: "success" },
  { id: "event-tasks", name: "Event Tasks", group: "Google", tone: "warning" },
  { id: "picnic-planning", name: "Picnic Planning", group: "Google", tone: "danger" },
  { id: "work", name: "Meridian Work", group: "iCloud", tone: "accent" },
  { id: "personal", name: "Personal", group: "iCloud", tone: "success" },
  { id: "budget", name: "Event Budget", group: "iCloud", tone: "warning" },
  { id: "family", name: "Family Plans", group: primaryUser.email, tone: "accent" },
  { id: "wellness", name: "Wellness", group: primaryUser.email, tone: "success" },
  { id: "routine", name: "Weekly Routine", group: primaryUser.email, tone: "neutral" },
  { id: "community", name: "Community Forum", group: eventsEmail, tone: "warning" },
  { id: "holidays", name: "Public Holidays", group: "Other", tone: "danger" },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Morning volunteer check-in",
    date: dateOffset(today),
    startTime: "9:00 AM",
    endTime: "9:30 AM",
    tone: "accent",
    sourceId: "work",
  },
  {
    id: "e2",
    title: "Poster design review",
    date: dateOffset(today),
    startTime: "11:30 AM",
    endTime: "12:30 PM",
    tone: "warning",
    sourceId: "picnic-planning",
    location: "Meridian Pavilion",
    attendees: [{ name: teamMembers.riley.name }, { name: teamMembers.jordan.name }],
  },
  {
    id: "e3",
    title: "Volunteer shift with Sam",
    date: dateOffset(today),
    startTime: "2:00 PM",
    endTime: "2:45 PM",
    tone: "success",
    sourceId: "family",
  },
  {
    id: "e10",
    title: "Pavilion setup walkthrough",
    date: dateOffset(today),
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    tone: "accent",
    sourceId: "picnic-planning",
    location: "Meridian Pavilion",
  },
  {
    id: "e11",
    title: "Catering vendor call",
    date: dateOffset(today),
    startTime: "11:30 AM",
    endTime: "12:30 PM",
    tone: "neutral",
    sourceId: "work",
    location: "Meridian Pavilion",
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
    sourceId: "picnic-planning",
    location: "Community room",
  },
  {
    id: "e6",
    title: "Event planning sync",
    date: dateOffset(Math.min(today + 3, 28)),
    startTime: "9:30 AM",
    endTime: "11:00 AM",
    tone: "accent",
    sourceId: "work",
    attendees: [
      { name: primaryUser.name },
      { name: teamMembers.riley.name },
      { name: teamMembers.jordan.name },
      { name: teamMembers.sam.name },
    ],
  },
  {
    id: "e7",
    title: "Community forum walkthrough",
    date: dateOffset(Math.min(today + 3, 28)),
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    tone: "success",
    sourceId: "community",
  },
  {
    id: "e8",
    title: "Focus time",
    date: dateOffset(Math.min(today + 5, 28)),
    tone: "neutral",
    sourceId: "routine",
  },
  {
    id: "e12",
    title: "Canada Day",
    date: dateOffset(Math.min(today + 2, 28)),
    tone: "success",
    sourceId: "holidays",
  },
  {
    id: "e13",
    title: "Canada Day",
    date: dateOffset(Math.min(today + 3, 28)),
    tone: "accent",
    sourceId: "holidays",
  },
  {
    id: "e9",
    title: "Picnic budget review",
    date: dateOffset(Math.max(today - 4, 1)),
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    tone: "warning",
    sourceId: "budget",
  },
  {
    id: "e14",
    title: "Volunteer team lunch",
    date: dateOffset(Math.max(today - 1, 1)),
    startTime: "12:00 PM",
    endTime: "1:00 PM",
    tone: "success",
    sourceId: "work",
  },
  {
    id: "e15",
    title: "Signage and layout review",
    date: dateOffset(Math.max(today - 2, 1)),
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    tone: "accent",
    sourceId: "picnic-planning",
  },
];
