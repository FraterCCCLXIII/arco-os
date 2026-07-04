import type { TaskItem } from "longformer-ui-tailwind";

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const initialTasks: TaskItem[] = [
  {
    id: "t1",
    title: "Confirm pavilion rental",
    description: "Verify setup window, power access, and rain backup hold.",
    status: "in_progress",
    priority: "high",
    assignee: { name: "Alex Morgan" },
    dueDate: "Today",
    dueDateISO: addDays(0),
  },
  {
    id: "t2",
    title: "Finalize catering headcount",
    status: "in_progress",
    priority: "medium",
    assignee: { name: "Riley Chen" },
    dueDate: "Fri",
    dueDateISO: addDays(3),
  },
  {
    id: "t3",
    title: "Book cleanup volunteer shift",
    description: "Still need two volunteers for the 2:30 PM teardown block.",
    status: "pending",
    priority: "low",
    dueDate: "Next week",
    dueDateISO: addDays(7),
  },
  {
    id: "t4",
    title: "Print picnic posters and maps",
    status: "pending",
    priority: "medium",
    assignee: { name: "Jordan Hayes" },
  },
  {
    id: "t5",
    title: "Draft volunteer shift schedule",
    status: "completed",
    priority: "medium",
    assignee: { name: "Sam Patel" },
  },
  {
    id: "t6",
    title: "Retire last year's signup form",
    status: "cancelled",
  },
];
