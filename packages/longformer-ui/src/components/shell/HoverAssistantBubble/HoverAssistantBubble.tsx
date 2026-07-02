/**
 * HoverAssistantBubble — right-edge sparkles bubble that reveals a quick-action
 * popover menu on hover and opens the AppShell context panel.
 */
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import { type MenuItemDescriptor } from "../../primitives/Menu";
import menuStyles from "../../primitives/Menu/Menu.module.css";
import styles from "./HoverAssistantBubble.module.css";

function getPanelPosition(trigger: HTMLElement | null) {
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return undefined;

  return {
    top: rect.top + rect.height / 2,
    right: window.innerWidth - rect.left + 10,
  };
}

export interface HoverAssistantBubbleProps {
  /** When false the bubble is not rendered. */
  enabled?: boolean;
  /** Whether the assistant context panel is already open. */
  assistantOpen?: boolean;
  /** Fires when hover should open the assistant context panel. */
  onOpenAssistant?: () => void;
  /** Quick actions shown in the hover popover. */
  items: MenuItemDescriptor[];
  menuLabel?: string;
  bubbleLabel?: string;
}

/** Right-edge hover bubble with a popover menu for opening the AI assistant panel. */
export function HoverAssistantBubble({
  enabled = true,
  assistantOpen = false,
  onOpenAssistant,
  items,
  menuLabel = "Assistant menu",
  bubbleLabel = "Ask Longformer",
}: HoverAssistantBubbleProps) {
  const [hovering, setHovering] = useState(false);
  const [panelStyle, setPanelStyle] = useState<{ top: number; right: number }>();
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const menuOpen = hovering;
  const visible = enabled && (!assistantOpen || hovering);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setHovering(false);
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setHovering(false);
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!enabled) setHovering(false);
  }, [enabled]);

  function handleEnter() {
    setHovering(true);
    onOpenAssistant?.();
  }

  function handleLeave(event: MouseEvent) {
    const related = event.relatedTarget as Node | null;
    if (wrapperRef.current?.contains(related) || panelRef.current?.contains(related)) return;
    setHovering(false);
  }

  useLayoutEffect(() => {
    if (!menuOpen) {
      setPanelStyle(undefined);
      return;
    }

    function updatePosition() {
      const next = getPanelPosition(bubbleRef.current);
      if (next) setPanelStyle(next);
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [menuOpen]);

  function select(item: MenuItemDescriptor) {
    if (item.disabled) return;
    item.onSelect?.();
  }

  if (!visible) return null;

  const resolvedStyle = menuOpen ? panelStyle ?? getPanelPosition(bubbleRef.current) : undefined;

  const panel =
    menuOpen && resolvedStyle ? (
      <div
        ref={panelRef}
        role="menu"
        aria-label={menuLabel}
        className={styles.panel}
        style={{
          top: resolvedStyle.top,
          right: resolvedStyle.right,
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleLeave}
      >
        <div className={styles.header}>Ask Longformer</div>
        {items.map((item) => (
          <div key={item.id}>
            {item.separatorAbove && <div className={menuStyles.separator} role="separator" />}
            <button
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={cx(menuStyles.item, item.danger && menuStyles.itemDanger)}
              onClick={() => select(item)}
            >
              {item.icon && (
                <span className={menuStyles.itemIcon}>
                  <Icon name={item.icon} size={15} />
                </span>
              )}
              <span className={menuStyles.itemLabel}>{item.label}</span>
              {item.shortcut && <span className={menuStyles.itemShortcut}>{item.shortcut}</span>}
            </button>
          </div>
        ))}
      </div>
    ) : null;

  return (
    <div
      ref={wrapperRef}
      className={cx(styles.wrapper, menuOpen && styles.wrapperOpen)}
      onMouseLeave={handleLeave}
    >
      <div className={styles.hoverZone} onMouseEnter={handleEnter} aria-hidden="true" />
      <div className={cx(styles.bubbleContainer, menuOpen && styles.bubbleContainerOpen)}>
        <button
          ref={bubbleRef}
          type="button"
          className={cx("lf-focusable", styles.bubble)}
          aria-label={bubbleLabel}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onMouseEnter={handleEnter}
        >
          <Icon name="sparkles" size={20} />
        </button>
      </div>
      {panel && createPortal(panel, getPortalContainer())}
    </div>
  );
}
