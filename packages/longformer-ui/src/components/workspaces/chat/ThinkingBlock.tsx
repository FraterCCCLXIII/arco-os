import { useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import styles from "./ThinkingBlock.module.css";

export interface ThinkingBlockProps {
  label?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** Collapsible "Thinking" / tool-call trace shown above an agent's reply. */
export function ThinkingBlock({ label = "Thinking", defaultOpen = true, children }: ThinkingBlockProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.thinking}>
      <button
        type="button"
        className={cx("lf-focusable", styles.trigger)}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={cx(styles.chevron, open ? styles.chevronOpen : styles.chevronClosed)}>
          <Icon name="chevron-down" size={13} />
        </span>
        {label}
      </button>
      {open && <div className={styles.content}>{children}</div>}
    </div>
  );
}
