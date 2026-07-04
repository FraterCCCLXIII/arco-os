import type { ReactNode } from "react";
import { Icon } from "../../../icons";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ResizablePane } from "../../primitives/ResizablePane";
import { CountBadge } from "../../primitives/Badge";
import { EmptyState } from "../../primitives/EmptyState";
import { TaskRow } from "./TaskRow";
import { TASK_STATUS_LABEL, type TaskItem, type TaskStatus } from "./types";
import styles from "./TasksWorkspace.tailwind";

export interface TasksWorkspaceProps {
  title?: string;
  tasks: TaskItem[];
  onToggleComplete: (id: string) => void;
  actions?: ReactNode;
  /** Optional slot rendered as a fixed-width pane to the left of the task column, e.g. a `MiniCalendar`. */
  calendar?: ReactNode;
  calendarPaneWidth?: number;
  defaultCalendarPaneWidth?: number;
  onCalendarPaneWidthChange?: (width: number) => void;
}

const GROUP_ORDER: TaskStatus[] = ["in_progress", "pending", "completed", "cancelled"];

/** A task-list workspace: items grouped by status, each with a checkbox, priority, due date, and assignee. */
export function TasksWorkspace({
  title = "Tasks",
  tasks,
  onToggleComplete,
  actions,
  calendar,
  calendarPaneWidth,
  defaultCalendarPaneWidth = 260,
  onCalendarPaneWidthChange,
}: TasksWorkspaceProps) {
  const openCount = tasks.filter((task) => task.status !== "completed" && task.status !== "cancelled").length;

  const groups = GROUP_ORDER.map((status) => ({
    status,
    items: tasks.filter((task) => task.status === status),
  })).filter((group) => group.items.length > 0);

  return (
    <div className={styles.workspace}>
      {calendar && (
        <ResizablePane
          width={calendarPaneWidth}
          defaultWidth={defaultCalendarPaneWidth}
          onWidthChange={onCalendarPaneWidthChange}
          minWidth={180}
          maxWidth={360}
          handleSide="right"
          className={styles.calendarResizable}
          paneClassName={styles.calendarPane}
          handleLabel="Resize calendar panel"
        >
          <ScrollArea className={styles.calendarScroll}>{calendar}</ScrollArea>
        </ResizablePane>
      )}
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Icon name="check" size={15} />
            {title}
            <CountBadge count={openCount} />
          </div>
          {actions}
        </div>
        <ScrollArea className={styles.scroll}>
          <div className={styles.page}>
            {groups.length === 0 ? (
              <EmptyState icon={<Icon name="check" size={22} />} title="No tasks yet" description="Tasks the agent creates will show up here." />
            ) : (
              groups.map((group) => (
                <div key={group.status} className={styles.group}>
                  <div className={styles.groupHeader}>
                    {TASK_STATUS_LABEL[group.status]}
                    <CountBadge count={group.items.length} />
                  </div>
                  {group.items.map((task) => (
                    <TaskRow key={task.id} task={task} onToggleComplete={onToggleComplete} />
                  ))}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
