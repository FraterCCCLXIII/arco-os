/**
 * Tasks & notifications state — the two list workspaces whose items the
 * workspace components mutate directly via setState (check off, dismiss).
 */
import { useMemo, useState } from "react";
import type { NotificationItem, TaskItem } from "longformer-ui";
import { initialTasks } from "../mock-data/tasks";
import { initialNotifications } from "../mock-data/notifications";

export function useProductivityState() {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  return useMemo(
    () => ({ tasks, setTasks, notifications, setNotifications }),
    [tasks, notifications],
  );
}

export type ProductivitySlice = ReturnType<typeof useProductivityState>;
