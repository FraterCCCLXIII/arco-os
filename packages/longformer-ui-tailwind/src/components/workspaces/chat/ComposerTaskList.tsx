import { useId, useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import styles from "./ComposerTaskList.tailwind";

export type ComposerTaskStatus = "completed" | "active" | "pending";

export interface ComposerTaskItem {
  id: string;
  label: ReactNode;
  status: ComposerTaskStatus;
}

export interface ComposerTaskListProps {
  items: ComposerTaskItem[];
  /**
   * When more than this many tasks are completed they collapse into an
   * expandable "N completed tasks" row. Set to Infinity to never group.
   */
  groupCompletedAfter?: number;
  className?: string;
}

function StatusIndicator({ status }: { status: ComposerTaskStatus }) {
  if (status === "completed") {
    return (
      <span className={cx(styles.indicator, styles.indicatorCompleted)} aria-hidden="true">
        <Icon name="check" size={11} strokeWidth={2.5} />
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className={cx(styles.indicator, styles.indicatorActive)} aria-hidden="true">
        <Icon name="loader" size={14} />
      </span>
    );
  }
  return <span className={cx(styles.indicator, styles.indicatorPending)} aria-hidden="true" />;
}

function TaskRow({ item }: { item: ComposerTaskItem }) {
  return (
    <li className={cx(styles.row, item.status === "completed" && styles.rowCompleted)}>
      <StatusIndicator status={item.status} />
      <span className={styles.rowLabel}>{item.label}</span>
    </li>
  );
}

/**
 * Compact agent task-progress list for the `ComposerDrawer`: completed tasks
 * collapse into a single expandable row, the active task shows a spinner,
 * and pending tasks a dashed placeholder circle.
 */
export function ComposerTaskList({
  items,
  groupCompletedAfter = 1,
  className,
}: ComposerTaskListProps) {
  const [completedExpanded, setCompletedExpanded] = useState(false);
  const completedListId = useId();

  const completed = items.filter((item) => item.status === "completed");
  const rest = items.filter((item) => item.status !== "completed");
  const shouldGroup = completed.length > groupCompletedAfter;

  return (
    <div className={cx(styles.list, className)}>
      {shouldGroup ? (
        <>
          <button
            type="button"
            className={cx("lf-focusable", styles.completedToggle)}
            aria-expanded={completedExpanded}
            aria-controls={completedListId}
            onClick={() => setCompletedExpanded((prev) => !prev)}
          >
            <span className={cx(styles.indicator, styles.indicatorCompleted)} aria-hidden="true">
              <Icon name="check" size={11} strokeWidth={2.5} />
            </span>
            <span className={styles.rowLabel}>
              {`${completed.length} completed ${completed.length === 1 ? "task" : "tasks"}`}
            </span>
            <span
              className={cx(styles.completedChevron, completedExpanded && styles.completedChevronOpen)}
              aria-hidden="true"
            >
              <Icon name="chevron-down" size={12} />
            </span>
          </button>
          {completedExpanded && (
            <ul id={completedListId} className={styles.items}>
              {completed.map((item) => (
                <TaskRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </>
      ) : (
        completed.length > 0 && (
          <ul className={styles.items}>
            {completed.map((item) => (
              <TaskRow key={item.id} item={item} />
            ))}
          </ul>
        )
      )}
      <ul className={styles.items}>
        {rest.map((item) => (
          <TaskRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
