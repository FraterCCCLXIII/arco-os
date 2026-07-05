import {
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import { useDismissLayer } from "../../../utils/useDismissLayer";
import { Icon, type IconName } from "../../../icons";
import styles from "./Menu.module.css";

export interface MenuItemDescriptor {
  id: string;
  label: ReactNode;
  icon?: IconName;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  separatorAbove?: boolean;
  onSelect?: () => void;
}

export interface MenuProps {
  trigger: ReactElement;
  items: MenuItemDescriptor[];
  align?: "start" | "end";
  /** Which edge of the trigger the panel opens from. */
  side?: "top" | "bottom";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  "aria-label"?: string;
}

/**
 * Panel position: fixed coordinates measured from the trigger, so the panel
 * can render in a portal and never gets clipped by `overflow` ancestors
 * (composer control rows, scrollable panes, drawers).
 */
function getPanelStyle(
  trigger: HTMLElement | null,
  side: "top" | "bottom",
  align: "start" | "end",
): CSSProperties | undefined {
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return undefined;

  const margin = 8;
  const style: CSSProperties = { position: "fixed" };

  if (side === "top") {
    style.bottom = Math.max(margin, window.innerHeight - rect.top + 4);
  } else {
    style.top = Math.min(rect.bottom + 4, window.innerHeight - margin);
  }

  // Clamp horizontally so the panel (max-width 320px) stays on screen.
  const panelMax = 320;
  if (align === "end") {
    style.right = Math.max(margin, Math.min(window.innerWidth - rect.right, window.innerWidth - panelMax - margin));
  } else {
    style.left = Math.max(margin, Math.min(rect.left, window.innerWidth - panelMax - margin));
  }

  return style;
}

/** A lightweight, dependency-free dropdown menu (model pickers, filters, row "more" menus). */
export function Menu({
  trigger,
  items,
  align = "start",
  side = "bottom",
  open: openProp,
  onOpenChange,
  ...aria
}: MenuProps) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>();

  const setOpen = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };

  // Both subtrees count as "inside": the trigger wrapper and the portaled panel.
  useDismissLayer(open, () => setOpen(false), [wrapperRef, panelRef]);

  // Track the trigger while open so the panel follows scrolling/resizes.
  useLayoutEffect(() => {
    if (!open) {
      setPanelStyle(undefined);
      return;
    }

    function updatePosition() {
      setPanelStyle(getPanelStyle(wrapperRef.current, side, align));
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, side, align]);

  const enabledIds = useMemo(() => items.filter((item) => !item.disabled).map((item) => item.id), [items]);

  function select(item: MenuItemDescriptor) {
    if (item.disabled) return;
    item.onSelect?.();
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!open) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const dir = event.key === "ArrowDown" ? 1 : -1;
      const currentPos = enabledIds.indexOf(items[highlighted]?.id ?? enabledIds[0]);
      const nextPos = (currentPos + dir + enabledIds.length) % enabledIds.length;
      const nextId = enabledIds[nextPos];
      setHighlighted(items.findIndex((item) => item.id === nextId));
    } else if (event.key === "Enter") {
      const item = items[highlighted];
      if (item) select(item);
    }
  }

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (event: React.MouseEvent) => {
          (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(event);
          setOpen(!open);
        },
        "aria-haspopup": "menu",
        "aria-expanded": open,
      } as Partial<unknown>)
    : trigger;

  const resolvedPanelStyle = open
    ? panelStyle ?? getPanelStyle(wrapperRef.current, side, align)
    : undefined;

  const panel =
    open && resolvedPanelStyle ? (
      <div
        ref={panelRef}
        role="menu"
        aria-label={aria["aria-label"]}
        className={styles.panel}
        style={resolvedPanelStyle}
        onKeyDown={handleKeyDown}
      >
        {items.map((item, index) => (
          <div key={item.id}>
            {item.separatorAbove && <div className={styles.separator} role="separator" />}
            <button
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={cx(
                styles.item,
                item.danger && styles.itemDanger,
                highlighted === index && styles.itemHighlighted
              )}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => select(item)}
            >
              {item.icon && (
                <span className={styles.itemIcon}>
                  <Icon name={item.icon} size={15} />
                </span>
              )}
              <span className={styles.itemLabel}>{item.label}</span>
              {item.shortcut && <span className={styles.itemShortcut}>{item.shortcut}</span>}
            </button>
          </div>
        ))}
      </div>
    ) : null;

  return (
    <div className={styles.wrapper} ref={wrapperRef} onKeyDown={handleKeyDown}>
      {triggerElement}
      {panel && createPortal(panel, getPortalContainer())}
    </div>
  );
}
