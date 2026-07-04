import { cx } from "../../../../utils/cx";
import { Icon } from "../../../../icons";
import type { AgentTodoCardProps, AgentTodoStatus } from "./types";
import styles from "./AgentBlocks.module.css";

function TodoIndicator({ status }: { status: AgentTodoStatus }) {
  if (status === "completed") {
    return (
      <span className={cx(styles.todoIndicator, styles.todoIndicatorCompleted)} aria-hidden="true">
        <Icon name="check" size={10} strokeWidth={2.5} />
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className={cx(styles.todoIndicator, styles.todoIndicatorActive)} aria-hidden="true">
        <Icon name="chevron-right" size={14} />
      </span>
    );
  }
  return <span className={cx(styles.todoIndicator, styles.todoIndicatorPending)} aria-hidden="true" />;
}

/** Agent plan card — "To-dos N" header with active, pending, and completed task rows. */
export function AgentTodoCard({ items, className }: AgentTodoCardProps) {
  return (
    <div className={cx(styles.todoCard, className)} role="group" aria-label={`To-dos ${items.length}`}>
      <div className={styles.todoHeader}>
        <span className={styles.todoHeaderIcon} aria-hidden="true">
          <Icon name="list" size={14} />
        </span>
        <span>To-dos</span>
        <span className={styles.todoCount}>{items.length}</span>
      </div>
      <ul className={styles.todoList}>
        {items.map((item) => (
          <li
            key={item.id}
            className={cx(
              styles.todoRow,
              item.status === "pending" && styles.todoRowPending,
              item.status === "completed" && styles.todoRowCompleted,
            )}
          >
            <TodoIndicator status={item.status} />
            <span className={styles.todoLabel}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
