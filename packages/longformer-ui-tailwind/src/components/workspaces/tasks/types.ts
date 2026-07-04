export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assignee?: { name: string; avatarSrc?: string };
  /** Display label, e.g. "Today" / "Fri" / "Next week". */
  dueDate?: string;
  /** ISO date (e.g. "2026-07-14") backing `dueDate`, used to plot the task on a calendar. */
  dueDateISO?: string;
}

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  pending: "To do",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};
