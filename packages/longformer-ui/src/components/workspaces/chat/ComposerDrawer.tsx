import { useId, useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import styles from "./ComposerDrawer.module.css";

export type ComposerDrawerTone = "default" | "danger";

export interface ComposerDrawerProps {
  /** Summary shown in the always-visible header row, e.g. "Task 4 of 5 in progress". */
  title: ReactNode;
  /** Controlled open state; leave undefined for uncontrolled behavior. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Max body height in px before the content scrolls. */
  maxBodyHeight?: number;
  /** Visual emphasis for error/status drawers in a stack. */
  tone?: ComposerDrawerTone;
  /** Optional controls rendered on the right side of the header row. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Collapsible "eyebrow" panel that docks to the top edge of the `Composer`
 * input surface — used for agent task progress, queued actions, or any
 * contextual status that should stay attached to the input.
 *
 * The bottom edge is intentionally square and padded so the composer card
 * can overlap it by one corner radius (see `Composer`'s drawer slot).
 */
export function ComposerDrawer({
  title,
  open,
  defaultOpen = true,
  onOpenChange,
  maxBodyHeight = 140,
  tone = "default",
  actions,
  children,
  className,
}: ComposerDrawerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const bodyId = useId();

  function handleToggle() {
    const next = !isOpen;
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  return (
    <div className={cx(styles.drawer, tone === "danger" && styles.drawerDanger, className)}>
      <div className={styles.header}>
        <button
          type="button"
          className={cx("lf-focusable", styles.trigger)}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          onClick={handleToggle}
        >
          <span className={cx(styles.chevron, !isOpen && styles.chevronClosed)} aria-hidden="true">
            <Icon name="chevron-down" size={14} />
          </span>
          <span className={styles.title}>{title}</span>
        </button>
        {actions ? <div className={styles.headerActions}>{actions}</div> : null}
      </div>
      <div id={bodyId} className={cx(styles.body, isOpen && styles.bodyOpen)}>
        <div className={styles.bodyClip}>
          <div
            className={cx("lf-scrollbar", styles.bodyScroll)}
            style={{ maxHeight: maxBodyHeight }}
            tabIndex={-1}
          >
            <div className={styles.bodyContent}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
