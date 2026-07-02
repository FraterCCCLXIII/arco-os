import type { TaskItem } from "longformer-ui";

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const initialTasks: TaskItem[] = [
  {
    id: "t1",
    title: "Wire the WebSocket gateway validation",
    description: "Validate message shape and cap payload size before dispatch.",
    status: "in_progress",
    priority: "high",
    assignee: { name: "Paul Bloch" },
    dueDate: "Today",
    dueDateISO: addDays(0),
  },
  {
    id: "t2",
    title: "Split App.tsx into input / rendering / HUD modules",
    status: "in_progress",
    priority: "medium",
    assignee: { name: "Dana Cho" },
    dueDate: "Fri",
    dueDateISO: addDays(3),
  },
  {
    id: "t3",
    title: "Add assertNever to the dispatch switch",
    description: "Missing action handlers should fail to compile, not silently no-op.",
    status: "pending",
    priority: "low",
    dueDate: "Next week",
    dueDateISO: addDays(7),
  },
  {
    id: "t4",
    title: "Write onboarding doc for the design token system",
    status: "pending",
    priority: "medium",
    assignee: { name: "Marcus Webb" },
  },
  {
    id: "t5",
    title: "Set up CI watchdog automation",
    status: "completed",
    priority: "medium",
    assignee: { name: "Priya Nair" },
  },
  {
    id: "t6",
    title: "Retire the old template gallery prototype",
    status: "cancelled",
  },
];
