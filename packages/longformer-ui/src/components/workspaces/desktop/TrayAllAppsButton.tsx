import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import { Icon } from "../../../icons";
import { Input } from "../../primitives/Input";
import { Tooltip } from "../../primitives/Tooltip";
import type { TrayOverflowItem } from "./useTrayPinDrag";
import styles from "./TrayAllAppsButton.module.css";

function getPanelPosition(trigger: HTMLElement | null) {
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return undefined;

  return {
    bottom: window.innerHeight - rect.top + 10,
    left: rect.left + rect.width / 2,
  };
}

export interface TrayAllAppsButtonProps {
  items: TrayOverflowItem[];
  activeAppId?: string;
  variant?: "dock" | "taskbar" | "start";
  onSelect: (id: string) => void;
  onMoveToTray: (id: string) => void;
  onRowPointerDown?: (item: TrayOverflowItem) => (event: ReactPointerEvent<HTMLElement>) => void;
  shouldSuppressRowClick?: () => boolean;
  draggingItemId?: string | null;
}

/** All-apps launcher for tray overflow — opens upward from the dock. */
export function TrayAllAppsButton({
  items,
  activeAppId,
  variant = "dock",
  onSelect,
  onMoveToTray,
  onRowPointerDown,
  shouldSuppressRowClick,
  draggingItemId = null,
}: TrayAllAppsButtonProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [panelStyle, setPanelStyle] = useState<{ bottom: number; left: number }>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const overflowActive = items.some((item) => item.id === activeAppId);
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
    onMoveToTray(id);
    setOpen(false);
  }

  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      className={cx(
        "lf-focusable",
        styles.allAppsButton,
        variant === "dock" && styles.allAppsButtonDock,
        variant === "taskbar" && styles.allAppsButtonTaskbar,
        variant === "start" && styles.allAppsButtonStart,
        overflowActive && styles.rowActive,
        open && styles.allAppsButtonOpen,
      )}
      aria-label="All apps"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={handleToggle}
    >
      {variant === "start" ? (
        <span className={styles.startMark} aria-hidden="true" />
      ) : (
        <Icon name="grid" size={variant === "dock" ? 20 : 18} />
      )}
      {items.length > 0 && variant !== "start" && (
        <span className={styles.allAppsCount} aria-hidden="true">
          {items.length}
        </span>
      )}
    </button>
  );

  const resolvedStyle = open ? panelStyle ?? getPanelPosition(triggerRef.current) : undefined;

  const panel =
    open && resolvedStyle ? (
      <div
        ref={panelRef}
        role="dialog"
        aria-label="All apps"
        className={styles.panel}
        style={{
          bottom: resolvedStyle.bottom,
          left: resolvedStyle.left,
          transform: "translateX(-50%)",
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
        <div className={styles.list}>
          {items.length === 0 ? (
            <div className={styles.empty}>All apps are on the tray.</div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.empty}>No apps match your search.</div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={cx(styles.row, draggingItemId === item.id && styles.rowDragging)}
              >
                <button
                  type="button"
                  className={cx(styles.rowMain, item.id === activeAppId && styles.rowActive)}
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
                <button
                  type="button"
                  className={styles.pinButton}
                  aria-label={`Add ${item.label} to tray`}
                  onClick={() => handleDock(item.id)}
                >
                  <Icon name="plus" size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    ) : null;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Tooltip label="All apps">{trigger}</Tooltip>
      {panel && createPortal(panel, getPortalContainer())}
    </div>
  );
}
