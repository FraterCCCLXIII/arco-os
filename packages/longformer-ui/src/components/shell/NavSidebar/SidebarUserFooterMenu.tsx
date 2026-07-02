import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import { Icon } from "../../../icons";
import { Avatar, type AvatarStatus } from "../../primitives/Avatar";
import { type MenuItemDescriptor } from "../../primitives/Menu";
import type { LongformerTheme } from "../../../tokens/tokens";
import menuStyles from "../../primitives/Menu/Menu.module.css";
import sidebarStyles from "./NavSidebar.module.css";
import styles from "./SidebarUserFooterMenu.module.css";

function getPanelPosition(trigger: HTMLElement | null) {
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return undefined;

  return {
    bottom: window.innerHeight - rect.top + 8,
    left: rect.left,
    width: Math.max(rect.width, 220),
  };
}

export interface SidebarUserFooterMenuProps {
  name: string;
  meta?: string;
  avatarSrc?: string;
  status?: AvatarStatus;
  compact?: boolean;
  items: MenuItemDescriptor[];
  theme?: LongformerTheme;
  onThemeChange?: (theme: LongformerTheme) => void;
  menuLabel?: string;
}

/** User footer row that opens an upward popover menu — for rail and sidebar footers. */
export function SidebarUserFooterMenu({
  name,
  meta,
  avatarSrc,
  status = "online",
  compact = false,
  items,
  theme,
  onThemeChange,
  menuLabel = "Account menu",
}: SidebarUserFooterMenuProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [panelStyle, setPanelStyle] = useState<{ bottom: number; left: number; width: number }>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const enabledIds = useMemo(() => items.filter((item) => !item.disabled).map((item) => item.id), [items]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
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

  function select(item: MenuItemDescriptor) {
    if (item.disabled) return;
    item.onSelect?.();
    setOpen(false);
  }

  function handleToggle() {
    setOpen((value) => !value);
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

  const resolvedStyle = open ? panelStyle ?? getPanelPosition(triggerRef.current) : undefined;

  const panel =
    open && resolvedStyle ? (
      <div
        ref={panelRef}
        role="menu"
        aria-label={menuLabel}
        className={styles.panel}
        style={{
          bottom: resolvedStyle.bottom,
          left: resolvedStyle.left,
          width: resolvedStyle.width,
        }}
      >
        <div className={styles.header}>
          <Avatar name={name} src={avatarSrc} status={status} size="md" />
          <span className={styles.headerBody}>
            <span className={styles.headerName}>{name}</span>
            {meta && <span className={styles.headerMeta}>{meta}</span>}
          </span>
        </div>
        {items.map((item, index) => (
          <div key={item.id}>
            {item.separatorAbove && <div className={menuStyles.separator} role="separator" />}
            <button
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={cx(
                menuStyles.item,
                item.danger && menuStyles.itemDanger,
                highlighted === index && menuStyles.itemHighlighted,
              )}
              onMouseEnter={() => setHighlighted(index)}
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
        {theme && onThemeChange && (
          <>
            <div className={menuStyles.separator} role="separator" />
            <div className={styles.themeRow}>
              <span className={styles.themeRowLabel}>
                <span className={styles.themeRowIcon}>
                  <Icon name="sun" size={15} />
                </span>
                Appearance
              </span>
              <div className={styles.themeSegment} role="group" aria-label="Theme">
                <button
                  type="button"
                  className={cx(styles.themeSegmentButton, theme === "light" && styles.themeSegmentButtonActive)}
                  aria-label="Light mode"
                  aria-pressed={theme === "light"}
                  onClick={() => onThemeChange("light")}
                >
                  <Icon name="sun" size={14} />
                </button>
                <button
                  type="button"
                  className={cx(styles.themeSegmentButton, theme === "dark" && styles.themeSegmentButtonActive)}
                  aria-label="Dark mode"
                  aria-pressed={theme === "dark"}
                  onClick={() => onThemeChange("dark")}
                >
                  <Icon name="moon" size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    ) : null;

  return (
    <div
      className={cx(styles.wrapper, compact && styles.compact)}
      ref={wrapperRef}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cx("lf-focusable", sidebarStyles.userFooter, compact && sidebarStyles.userFooterCompact)}
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleToggle}
      >
        <Avatar name={name} src={avatarSrc} status={status} size="md" />
        {!compact && (
          <>
            <span className={sidebarStyles.userFooterBody}>
              <span className={sidebarStyles.userFooterName}>{name}</span>
              {meta && <span className={sidebarStyles.userFooterMeta}>{meta}</span>}
            </span>
            <Icon name="more-vertical" size={15} />
          </>
        )}
      </button>
      {panel && createPortal(panel, getPortalContainer())}
    </div>
  );
}
