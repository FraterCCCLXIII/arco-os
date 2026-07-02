import { useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Tooltip } from "../../primitives/Tooltip";
import { NavRailOverflowCard } from "./NavRailOverflowCard";
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
  /** Apps hidden from the rail and shown in the overflow menu instead. */
  overflowItems?: NavRailItem[];
  onMoveToRail?: (id: string) => void;
  onMoveToOverflow?: (id: string) => void;
  /** Small brand mark rendered at the top, e.g. the product's initial. */
  brand?: ReactNode;
  /** Icon row above the footer, e.g. theme toggle or assistant. */
  utilities?: ReactNode;
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
  overflowItems = [],
  onMoveToRail,
  onMoveToOverflow,
  brand,
  utilities,
  footer,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  collapsible = true,
  className,
}: NavRailProps) {
  const [expandedState, setExpandedState] = useState(defaultExpanded);
  const expanded = expandedProp ?? expandedState;
  const canCustomize = Boolean(onMoveToRail && onMoveToOverflow);
  const showOverflow = overflowItems.length > 0 || canCustomize;

  function setExpanded(next: boolean) {
    setExpandedState(next);
    onExpandedChange?.(next);
  }

  function renderItem(item: NavRailItem) {
    const active = item.id === activeId;
    const canUnpin = canCustomize && items.length > 1;

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

    const unpinButton =
      expanded && canUnpin ? (
        <button
          type="button"
          className={styles.unpinButton}
          aria-label={`Move ${item.label} to more apps`}
          onClick={(event) => {
            event.stopPropagation();
            onMoveToOverflow?.(item.id);
          }}
        >
          <Icon name="minus" size={14} />
        </button>
      ) : null;

    if (expanded) {
      return (
        <div key={item.id} className={styles.itemRow}>
          {button}
          {unpinButton}
        </div>
      );
    }

    return (
      <Tooltip key={item.id} label={item.label} placement="right">
        {button}
      </Tooltip>
    );
  }

  const collapseToggle = collapsible ? (
    <button
      type="button"
      className={cx("lf-focusable", styles.toggleButton)}
      aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      aria-pressed={expanded}
      onClick={() => setExpanded(!expanded)}
    >
      <Icon name={expanded ? "chevron-left" : "chevron-right"} size={16} />
    </button>
  ) : null;

  return (
    <nav
      className={cx(styles.rail, expanded ? styles.expanded : styles.collapsed, className)}
      aria-label="Workspaces"
    >
      {(brand || collapseToggle) && (
        <div className={styles.brandRow}>
          {brand && <div className={styles.brand}>{brand}</div>}
          {collapseToggle}
        </div>
      )}
      <div className={styles.items}>
        {items.map((item) => renderItem(item))}
        {showOverflow && onMoveToRail && (
          <NavRailOverflowCard
            items={overflowItems}
            activeId={activeId}
            expanded={expanded}
            onSelect={onSelect}
            onMoveToRail={onMoveToRail}
          />
        )}
      </div>
      {(utilities || footer) && (
        <div className={styles.footer}>
          {utilities && <div className={styles.footerUtilities}>{utilities}</div>}
          {footer}
        </div>
      )}
    </nav>
  );
}
