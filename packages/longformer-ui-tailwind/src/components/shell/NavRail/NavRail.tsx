import { useRef, useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import { Tooltip } from "../../primitives/Tooltip";
import { NavRailOverflowCard } from "./NavRailOverflowCard";
import { useNavRailPinDrag } from "./useNavRailPinDrag";
import { useNavRailReorder } from "./useNavRailReorder";
import styles from "./NavRail.tailwind";

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
  onMoveToRail?: (id: string, index?: number) => void;
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
  const railBoundsRef = useRef<HTMLElement>(null);
  const canCustomize = Boolean(onMoveToRail && onMoveToOverflow);
  const canUndock = canCustomize && items.length > 1;
  const canReorder = Boolean(onReorder && items.length > 1);
  const showOverflow = overflowItems.length > 0 || canCustomize;

  const { dragState, pendingIndex, itemRefs, createItemPointerDown, shouldSuppressClick } = useNavRailReorder({
    enabled: canReorder || canUndock,
    itemCount: items.length,
    railBoundsRef,
    onReorder,
    onUndock: canUndock
      ? (fromIndex) => {
          const item = items[fromIndex];
          if (item) onMoveToOverflow?.(item.id);
        }
      : undefined,
  });

  const { pinDrag, pinDropIndex, createOverflowDragStart, shouldSuppressOverflowClick } = useNavRailPinDrag({
    enabled: canCustomize,
    itemCount: items.length,
    itemRefs,
    onPin: onMoveToRail,
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
    const isUndockingSource = isDraggingSource && dragState?.isUndocking;
    const showDropBefore =
      (dragState && !dragState.isUndocking && dragState.dropIndex === index && dragState.fromIndex !== index) ||
      (pinDrag && pinDropIndex === index);
    const itemPointerDown =
      canReorder || canUndock ? createItemPointerDown(index, item.label, item.icon) : undefined;

    const button = (
      <button
        type="button"
        className={cx("lf-focusable", styles.itemButton, active && !expanded && styles.itemActive)}
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

    const menuButton =
      expanded && canUnpin ? (
        <Menu
          trigger={
            <button
              type="button"
              className={styles.itemMenuButton}
              aria-label={`${item.label} options`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              <Icon name="more-vertical" size={14} />
            </button>
          }
          items={
            [
              {
                id: "move-to-overflow",
                label: "Move to more apps",
                icon: "minus",
                onSelect: () => onMoveToOverflow?.(item.id),
              },
            ] satisfies MenuItemDescriptor[]
          }
          align="end"
          aria-label={`${item.label} options`}
        />
      ) : null;

    const slot = (
      <div
        ref={(element) => {
          itemRefs.current[index] = element;
        }}
        className={cx(
          styles.itemSlot,
          (canReorder || canUndock) && styles.itemSlotReorderable,
          isPendingHold && styles.itemSlotPending,
          isDraggingSource && styles.itemSlotDragging,
          isUndockingSource && styles.itemSlotUndocking,
          showDropBefore && styles.itemSlotDropBefore,
          dragState && styles.itemSlotReorderActive,
          pinDrag && styles.itemSlotPinDropActive,
        )}
      >
        {expanded ? (
          <div className={cx(styles.itemRow, active && styles.itemRowActive)}>
            {button}
            {menuButton}
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
      ref={railBoundsRef}
      className={cx(
        styles.rail,
        expanded ? styles.expanded : styles.collapsed,
        dragState?.isUndocking && styles.railUndocking,
        dragState && styles.railReordering,
        pinDrag && styles.railPinDragging,
        className,
      )}
      aria-label="Workspaces"
    >
      {(brand || collapseToggle) && (
        <div className={styles.brandRow}>
          <div className={styles.brandHost}>
            {brand && <div className={styles.brand}>{brand}</div>}
            {collapseToggle}
          </div>
        </div>
      )}
      <div className={styles.items}>
        {dragState?.isUndocking ? <span className={styles.undockHint} aria-hidden="true" /> : null}
        {items.map((item, index) => renderItem(item, index))}
        {pinDrag ? (
          <div
            className={cx(styles.itemSlot, pinDropIndex === items.length && styles.itemSlotDropBefore)}
            aria-hidden="true"
          />
        ) : null}
        {showOverflow && onMoveToRail && (
          <NavRailOverflowCard
            items={overflowItems}
            activeId={activeId}
            expanded={expanded}
            onSelect={onSelect}
            onMoveToRail={(id) => onMoveToRail(id)}
            onRowPointerDown={createOverflowDragStart}
            shouldSuppressRowClick={shouldSuppressOverflowClick}
            draggingItemId={pinDrag?.id ?? null}
          />
        )}
      </div>
      {(utilities || footer) && (
        <div className={styles.footer}>
          {utilities && <div className={styles.footerUtilities}>{utilities}</div>}
          {footer}
        </div>
      )}

      {dragState || pinDrag ? (
        <div
          className={cx(
            styles.dragGhost,
            expanded ? styles.dragGhostExpanded : styles.dragGhostCollapsed,
            dragState?.isUndocking && styles.dragGhostUndocking,
          )}
          style={{
            left: (dragState ?? pinDrag)!.ghostX,
            top: (dragState ?? pinDrag)!.ghostY,
          }}
          aria-hidden="true"
        >
          <span className={styles.dragGhostIcon}>
            <Icon name={(dragState ?? pinDrag)!.icon} size={18} />
          </span>
          {expanded ? (
            <span className={styles.dragGhostLabel}>{(dragState ?? pinDrag)!.label}</span>
          ) : null}
        </div>
      ) : null}
    </nav>
  );
}
