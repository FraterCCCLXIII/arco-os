import { useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Tooltip } from "../../primitives/Tooltip";
import styles from "./NavRail.module.css";

export interface NavRailItem {
  id: string;
  label: string;
  icon: IconName;
}

export interface NavRailProps {
  items: NavRailItem[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Small brand mark rendered at the top, e.g. the product's initial. */
  brand?: ReactNode;
  footer?: ReactNode;
  /** Controlled expanded state — omit to let the rail manage its own state. */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Hide the built-in expand/collapse toggle. */
  collapsible?: boolean;
  className?: string;
}

/**
 * The far-left icon rail used to switch between entire workspaces
 * (Chat / Notes / Email / Tasks / Generated UI), mirroring the Notion/Slack-style
 * app switchers seen across the reference apps. Collapsed it shows icons with
 * tooltips; expanded it shows icon + label rows, like a macOS Finder sidebar.
 */
export function NavRail({
  items,
  activeId,
  onSelect,
  brand,
  footer,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  collapsible = true,
  className,
}: NavRailProps) {
  const [expandedState, setExpandedState] = useState(defaultExpanded);
  const expanded = expandedProp ?? expandedState;

  function setExpanded(next: boolean) {
    setExpandedState(next);
    onExpandedChange?.(next);
  }

  return (
    <nav
      className={cx(styles.rail, expanded ? styles.expanded : styles.collapsed, className)}
      aria-label="Workspaces"
    >
      {brand && (
        <div className={styles.brandRow}>
          <div className={styles.brand}>{brand}</div>
        </div>
      )}
      <div className={styles.items}>
        {items.map((item) => {
          const active = item.id === activeId;
          const button = (
            <button
              type="button"
              className={cx("lf-focusable", styles.itemButton, active && styles.itemActive)}
              aria-current={active ? "true" : undefined}
              aria-label={item.label}
              onClick={() => onSelect(item.id)}
            >
              <span className={styles.itemIcon}>
                <Icon name={item.icon} size={18} />
              </span>
              {expanded && <span className={styles.itemLabel}>{item.label}</span>}
            </button>
          );
          return expanded ? (
            <div key={item.id}>{button}</div>
          ) : (
            <Tooltip key={item.id} label={item.label} placement="right">
              {button}
            </Tooltip>
          );
        })}
      </div>
      <div className={styles.footer}>
        {footer}
        {collapsible && (
          <button
            type="button"
            className={cx("lf-focusable", styles.toggleButton)}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-pressed={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            <Icon name={expanded ? "chevron-left" : "chevron-right"} size={16} />
            {expanded && <span className={styles.itemLabel}>Collapse</span>}
          </button>
        )}
      </div>
    </nav>
  );
}
