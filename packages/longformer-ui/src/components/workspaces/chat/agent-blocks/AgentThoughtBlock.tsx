import { useState, type ReactNode } from "react";
import { cx } from "../../../../utils/cx";
import { Icon } from "../../../../icons";
import type { AgentThoughtDuration } from "./types";
import styles from "./AgentBlocks.module.css";

export interface AgentThoughtBlockProps {
  /** Seconds of reasoning, or `"brief"` for a quick thought. */
  duration?: AgentThoughtDuration;
  /** Override the auto-generated label. */
  label?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

function formatThoughtLabel(duration?: AgentThoughtDuration): string {
  if (duration === "brief") return "Thought briefly";
  if (duration !== undefined && duration > 0) return `Thought for ${duration}s`;
  return "Thinking";
}

/** Collapsible reasoning trace — "Thought briefly" / "Thought for 67s" with plain-text body. */
export function AgentThoughtBlock({
  duration,
  label,
  defaultOpen = true,
  children,
  className,
}: AgentThoughtBlockProps) {
  const [open, setOpen] = useState(defaultOpen);
  const displayLabel = label ?? formatThoughtLabel(duration);

  return (
    <div className={cx(styles.thought, className)}>
      <button
        type="button"
        className={cx("lf-focusable", styles.thoughtTrigger)}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={cx(styles.thoughtChevron, open ? styles.thoughtChevronOpen : styles.thoughtChevronClosed)}>
          <Icon name="chevron-down" size={13} />
        </span>
        {displayLabel}
      </button>
      {open && <div className={styles.thoughtContent}>{children}</div>}
    </div>
  );
}
