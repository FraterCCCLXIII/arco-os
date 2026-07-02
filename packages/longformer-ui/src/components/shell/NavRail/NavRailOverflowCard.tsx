import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import { Icon } from "../../../icons";
import { Input } from "../../primitives/Input";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import { ScrollArea } from "../../primitives/ScrollArea";
import { Tooltip } from "../../primitives/Tooltip";
import type { NavRailItem } from "./NavRail";
import styles from "./NavRailOverflowCard.module.css";
import railStyles from "./NavRail.module.css";

function getPanelPosition(trigger: HTMLElement | null) {
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return undefined;

  return {
    top: rect.top + rect.height / 2,
    left: rect.right + 10,
  };
}

export interface NavRailOverflowCardProps {
  items: NavRailItem[];
  activeId: string;
  expanded: boolean;
  onSelect: (id: string) => void;
  onMoveToRail: (id: string) => void;
  onRowPointerDown?: (item: NavRailItem) => (event: ReactPointerEvent<HTMLElement>) => void;
  shouldSuppressRowClick?: () => boolean;
  draggingItemId?: string | null;
}

/** Click-triggered overflow menu for workspace apps not pinned to the rail. */
export function NavRailOverflowCard({
  items,
  activeId,
  expanded,
  onSelect,
  onMoveToRail,
  onRowPointerDown,
  shouldSuppressRowClick,
  draggingItemId = null,
}: NavRailOverflowCardProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [panelStyle, setPanelStyle] = useState<{ top: number; left: number }>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const overflowActive = items.some((item) => item.id === activeId);
  const wasDraggingRef = useRef(false);

  useEffect(() => {
    if (draggingItemId) {
      wasDraggingRef.current = true;
      return;
    }

    if (wasDraggingRef.current) {
      wasDraggingRef.current = false;
      setOpen(false);
    }
  }, [draggingItemId]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) => item.label.toLowerCase().includes(query) || item.id.toLowerCase().includes(query),
    );
  }, [items, searchQuery]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      setPanelStyle(undefined);
      return;
    }

    function updatePosition() {
      const next = getPanelPosition(triggerRef.current);
      if (next) setPanelStyle(next);
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    searchInputRef.current?.focus({ preventScroll: true });
    searchInputRef.current?.select();
  }, [open]);

  useEffect(() => {
    if (!open) setSearchQuery("");
  }, [open]);

  function handleToggle() {
    setOpen((value) => !value);
  }

  function handleSelect(id: string) {
    onSelect(id);
    setOpen(false);
  }

  function handleDock(id: string) {
    onMoveToRail(id);
    setOpen(false);
  }

  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      className={cx(
        "lf-focusable",
        railStyles.itemButton,
        railStyles.overflowButton,
        overflowActive && railStyles.itemActive,
        open && railStyles.overflowButtonOpen,
      )}
      aria-label="More apps"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={handleToggle}
    >
      <span className={railStyles.itemIcon}>
        <Icon name="grid" size={18} />
      </span>
      {expanded && <span className={railStyles.itemLabel}>More apps</span>}
      {expanded && items.length > 0 && <span className={railStyles.overflowCount}>{items.length}</span>}
    </button>
  );

  const resolvedStyle = open ? panelStyle ?? getPanelPosition(triggerRef.current) : undefined;

  const panel =
    open && resolvedStyle ? (
      <div
        ref={panelRef}
        role="dialog"
        aria-label="More apps"
        className={styles.panel}
        style={{
          top: resolvedStyle.top,
          left: resolvedStyle.left,
          transform: "translateY(-50%)",
        }}
      >
        <div className={styles.header}>
          <Input
            ref={searchInputRef}
            className={styles.searchInput}
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search apps"
            aria-label="Search apps"
            autoFocus
            startSlot={<Icon name="search" size={14} />}
          />
        </div>
        <ScrollArea className={styles.list}>
          {items.length === 0 ? (
            <div className={styles.empty}>All apps are on the sidebar.</div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.empty}>No apps match your search.</div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={cx(
                  styles.row,
                  item.id === activeId && styles.rowActive,
                  draggingItemId === item.id && styles.rowDragging,
                )}
              >
                <button
                  type="button"
                  className={styles.rowMain}
                  onPointerDown={onRowPointerDown?.(item)}
                  onClick={() => {
                    if (shouldSuppressRowClick?.()) return;
                    handleSelect(item.id);
                  }}
                >
                  <span className={styles.rowIcon}>
                    <Icon name={item.icon} size={18} />
                  </span>
                  <span className={styles.rowLabel}>{item.label}</span>
                </button>
                <Menu
                  trigger={
                    <button
                      type="button"
                      className={styles.rowMenuButton}
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
                        id: "add-to-nav",
                        label: "Add to nav",
                        icon: "panel-right",
                        onSelect: () => handleDock(item.id),
                      },
                    ] satisfies MenuItemDescriptor[]
                  }
                  align="end"
                  aria-label={`${item.label} options`}
                />
              </div>
            ))
          )}
        </ScrollArea>
      </div>
    ) : null;

  return (
    <div className={cx(styles.wrapper, !expanded && styles.collapsedWrapper)} ref={wrapperRef}>
      {expanded ? trigger : <Tooltip label="More apps" placement="right">{trigger}</Tooltip>}
      {panel && createPortal(panel, getPortalContainer())}
    </div>
  );
}
