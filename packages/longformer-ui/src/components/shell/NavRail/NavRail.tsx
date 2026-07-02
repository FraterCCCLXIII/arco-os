import { useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Tooltip } from "../../primitives/Tooltip";
import { NavRailOverflowCard } from "./NavRailOverflowCard";
import { useNavRailReorder } from "./useNavRailReorder";
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
  /** Reorder pinned tabs after hold-and-drag. */
  onReorder?: (fromIndex: number, toIndex: number) => void;
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
  onReorder,
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
  const canReorder = Boolean(onReorder && items.length > 1);
  const showOverflow = overflowItems.length > 0 || canCustomize;

  const { dragState, pendingIndex, itemRefs, createItemPointerDown, shouldSuppressClick } = useNavRailReorder({
    enabled: canReorder,
    itemCount: items.length,
    onReorder,
  });

  function setExpanded(next: boolean) {
    setExpandedState(next);
    onExpandedChange?.(next);
  }

  function renderItem(item: NavRailItem, index: number) {
    const active = item.id === activeId;
    const canUnpin = canCustomize && items.length > 1;
    const isPendingHold = pendingIndex === index;
    const isDraggingSource = dragState?.fromIndex === index;
    const showDropBefore = dragState && dragState.dropIndex === index && dragState.fromIndex !== index;
    const itemPointerDown = canReorder ? createItemPointerDown(index, item.label, item.icon) : undefined;

    const button = (
      <button
        type="button"
        className={cx("lf-focusable", styles.itemButton, active && styles.itemActive)}
        aria-current={active ? "true" : undefined}
        aria-label={item.label}
        onPointerDown={itemPointerDown}
        onClick={() => {
          if (shouldSuppressClick()) return;
          onSelect(item.id);
        }}
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
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onMoveToOverflow?.(item.id);
          }}
        >
          <Icon name="minus" size={14} />
        </button>
      ) : null;

    const slot = (
      <div
        ref={(element) => {
          itemRefs.current[index] = element;
        }}
        className={cx(
          styles.itemSlot,
          canReorder && styles.itemSlotReorderable,
          isPendingHold && styles.itemSlotPending,
          isDraggingSource && styles.itemSlotDragging,
          showDropBefore && styles.itemSlotDropBefore,
          dragState && styles.itemSlotReorderActive,
        )}
      >
        {expanded ? (
          <div className={styles.itemRow}>
            {button}
            {unpinButton}
          </div>
        ) : (
          button
        )}
      </div>
    );

    if (expanded) {
      return <div key={item.id}>{slot}</div>;
    }

    return (
      <Tooltip key={item.id} label={item.label} placement="right">
        {slot}
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
      className={cx(
        styles.rail,
        expanded ? styles.expanded : styles.collapsed,
        dragState && styles.railReordering,
        className,
      )}
      aria-label="Workspaces"
    >
      {(brand || collapseToggle) && (
        <div className={styles.brandRow}>
          {brand && <div className={styles.brand}>{brand}</div>}
          {collapseToggle}
        </div>
      )}
      <div className={styles.items}>
        {items.map((item, index) => renderItem(item, index))}
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

      {dragState ? (
        <div
          className={cx(styles.dragGhost, expanded ? styles.dragGhostExpanded : styles.dragGhostCollapsed)}
          style={{ left: dragState.ghostX, top: dragState.ghostY }}
          aria-hidden="true"
        >
          <span className={styles.dragGhostIcon}>
            <Icon name={dragState.icon} size={18} />
          </span>
          {expanded ? <span className={styles.dragGhostLabel}>{dragState.label}</span> : null}
        </div>
      ) : null}
    </nav>
  );
}
