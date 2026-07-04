import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Checkbox } from "../../primitives/Checkbox";
import { Avatar } from "../../primitives/Avatar";
import { Badge } from "../../primitives/Badge";
import type { TaskItem } from "./types";
import styles from "./TaskRow.tailwind";

export interface TaskRowProps {
  task: TaskItem;
  onToggleComplete: (id: string) => void;
}

const PRIORITY_CLASS: Record<string, string> = {
  low: styles.priorityLow,
  medium: styles.priorityMedium,
  high: styles.priorityHigh,
};

export function TaskRow({ task, onToggleComplete }: TaskRowProps) {
  const completed = task.status === "completed";

  return (
    <div className={styles.row}>
      <span className={styles.checkboxSlot}>
        <Checkbox
          checked={completed}
          onChange={() => onToggleComplete(task.id)}
          aria-label={completed ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
        />
      </span>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={cx(styles.title, completed && styles.titleCompleted)}>{task.title}</span>
        </div>
        {task.description && <div className={styles.description}>{task.description}</div>}
        <div className={styles.meta}>
          {task.priority && (
            <Badge tone="neutral" dot className={PRIORITY_CLASS[task.priority]}>
              {task.priority}
            </Badge>
          )}
          {task.dueDate && (
            <span className={styles.dueDate}>
              <Icon name="calendar" size={12} />
              {task.dueDate}
            </span>
          )}
          {task.assignee && <Avatar name={task.assignee.name} src={task.assignee.avatarSrc} size="sm" />}
        </div>
      </div>
    </div>
  );
}
