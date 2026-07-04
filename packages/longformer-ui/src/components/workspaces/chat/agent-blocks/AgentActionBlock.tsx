import { useState } from "react";
import { cx } from "../../../../utils/cx";
import { Icon } from "../../../../icons";
import type { AgentActionBlockProps } from "./types";
import styles from "./AgentBlocks.module.css";

/** Tool-call output card — header with action title and monospace command output body. */
export function AgentActionBlock({
  title,
  command,
  output,
  icon = "terminal",
  defaultOpen = true,
  className,
}: AgentActionBlockProps) {
  const [open, setOpen] = useState(defaultOpen);
  const lines = Array.isArray(output) ? output : output.split("\n");
  const text = lines.join("\n");

  return (
    <div className={cx(styles.action, className)} role="group">
      <button
        type="button"
        className={cx("lf-focusable", styles.actionHeader)}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.actionIcon} aria-hidden="true">
          <Icon name={icon} size={14} />
        </span>
        <span className={styles.actionTitle}>{title}</span>
        {command && <code className={styles.actionCommand}>{command}</code>}
        <span className={cx(styles.actionChevron, open ? styles.actionChevronOpen : styles.actionChevronClosed)}>
          <Icon name="chevron-down" size={13} />
        </span>
      </button>
      {open && (
        <div className={styles.actionBody}>
          <pre className={styles.actionOutput}>{text}</pre>
        </div>
      )}
    </div>
  );
}
