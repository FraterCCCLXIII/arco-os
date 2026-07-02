import type { ScheduleChannel, ScheduleItem, ScheduleProject } from "longformer-ui";
import { getWeekStart, toISODate } from "longformer-ui";

const weekStart = getWeekStart(new Date());
const weekStartISO = toISODate(weekStart);

function dayOffset(days: number): string {
  const date = new Date(weekStart);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export const scheduleProjects: ScheduleProject[] = [
  { id: "p1", name: "Conducting user research", color: "#5b8def" },
  { id: "p2", name: "Develop wireframes", color: "#e3a53c" },
  { id: "p3", name: "High-fidelity mockups", color: "#ea5f5f" },
  { id: "p4", name: "Interactive prototypes", color: "#3fbf72" },
];

export const scheduleChannels: ScheduleChannel[] = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "tasks", label: "Tasks", icon: "check" },
  { id: "messages", label: "Messages", icon: "chat" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export const scheduleItems: ScheduleItem[] = [
  {
    id: "s1",
    title: "Make the logo bigger",
    date: dayOffset(0),
    startMinutes: 7 * 60 + 30,
    endMinutes: 8 * 60 + 30,
    tone: "beige",
    status: "active",
    projectId: "p3",
    assignees: [{ name: "Dana Cho" }],
    priority: "medium",
  },
  {
    id: "s2",
    title: "Test the prototypes",
    date: dayOffset(1),
    startMinutes: 10 * 60,
    endMinutes: 11 * 60 + 30,
    tone: "pink",
    status: "active",
    projectId: "p4",
    assignees: [{ name: "Marcus Webb" }, { name: "Priya Nair" }],
    priority: "high",
  },
  {
    id: "s3",
    title: "Kick-off meeting",
    date: dayOffset(2),
    startMinutes: 9 * 60,
    endMinutes: 10 * 60,
    tone: "blue",
    status: "active",
    projectId: "p1",
    assignees: [{ name: "Paul Bloch" }, { name: "Dana Cho" }, { name: "Marcus Webb" }],
    requiresRsvp: true,
    location: "Zoom",
    description: "Align on research goals, interview scripts, and the week-one synthesis plan.",
  },
  {
    id: "s4",
    title: "Prepare Final Design",
    date: dayOffset(3),
    startMinutes: 9 * 60 + 40,
    endMinutes: 11 * 60 + 30,
    tone: "purple",
    status: "active",
    projectId: "p3",
    assignees: [
      { name: "Paul Bloch" },
      { name: "Dana Cho" },
      { name: "Marcus Webb" },
      { name: "Priya Nair" },
      { name: "Alex Kim" },
      { name: "Jordan Lee" },
      { name: "Sam Rivera" },
    ],
    requiresRsvp: true,
    description:
      "A style guide is a document that outlines the visual language of a brand or product. It includes typography, color palettes, spacing rules, and component usage so every screen stays consistent.",
    priority: "high",
  },
  {
    id: "s5",
    title: "Wireframe review",
    date: dayOffset(3),
    startMinutes: 14 * 60,
    endMinutes: 15 * 60,
    tone: "warning",
    status: "backlog",
    projectId: "p2",
    assignees: [{ name: "Dana Cho" }],
  },
  {
    id: "s6",
    title: "Sprint planning",
    date: dayOffset(4),
    startMinutes: 9 * 60 + 30,
    endMinutes: 11 * 60,
    tone: "accent",
    status: "active",
    projectId: "p1",
    assignees: [{ name: "Paul Bloch" }, { name: "Priya Nair" }],
    location: "Conference room B",
  },
  {
    id: "s7",
    title: "Ship notifications workspace",
    date: dayOffset(4),
    startMinutes: 13 * 60,
    endMinutes: 14 * 60 + 30,
    tone: "success",
    status: "closed",
    projectId: "p4",
    assignees: [{ name: "Marcus Webb" }],
  },
  {
    id: "s8",
    title: "Research synthesis",
    date: dayOffset(5),
    startMinutes: 10 * 60,
    endMinutes: 12 * 60,
    tone: "neutral",
    status: "backlog",
    projectId: "p1",
    description: "Consolidate interview notes into themes and opportunity areas.",
  },
];

export { weekStartISO };
