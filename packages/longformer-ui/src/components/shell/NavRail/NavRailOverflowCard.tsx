import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import { Icon } from "../../../icons";
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
}

/** Click-triggered overflow menu for workspace apps not pinned to the rail. */
export function NavRailOverflowCard({
  items,
  activeId,
  expanded,
  onSelect,
  onMoveToRail,
}: NavRailOverflowCardProps) {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<{ top: number; left: number }>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overflowActive = items.some((item) => item.id === activeId);

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

  function handleToggle() {
    setOpen((value) => !value);
  }

  function handleSelect(id: string) {
    onSelect(id);
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
          <div className={styles.title}>More apps</div>
          <div className={styles.hint}>Pin apps to the sidebar or open them here.</div>
        </div>
        <div className={styles.list}>
          {items.length === 0 ? (
            <div className={styles.empty}>All apps are on the sidebar.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.row}>
                <button
                  type="button"
                  className={cx(styles.rowMain, item.id === activeId && styles.rowActive)}
                  onClick={() => handleSelect(item.id)}
                >
                  <span className={styles.rowIcon}>
                    <Icon name={item.icon} size={18} />
                  </span>
                  <span className={styles.rowLabel}>{item.label}</span>
                </button>
                <button
                  type="button"
                  className={styles.pinButton}
                  aria-label={`Pin ${item.label} to sidebar`}
                  onClick={() => onMoveToRail(item.id)}
                >
                  <Icon name="panel-right" size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    ) : null;

  return (
    <div className={cx(styles.wrapper, !expanded && styles.collapsedWrapper)} ref={wrapperRef}>
      {expanded ? trigger : <Tooltip label="More apps" placement="right">{trigger}</Tooltip>}
      {panel && createPortal(panel, getPortalContainer())}
    </div>
  );
}
