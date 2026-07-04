import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../../../icons";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import { cx } from "../../../utils/cx";
import type { AdaptiveNavItem } from "./types";
import styles from "./AdaptiveBottomNav.tailwind";

export interface AdaptiveBottomNavProps {
  items: AdaptiveNavItem[];
  activeId: string;
  onChange: (id: string) => void;
  /** Called after a tab is chosen — e.g. reset stacked pane to list. */
  onAfterChange?: () => void;
  variant?: "phone" | "modal";
  className?: string;
  "aria-label"?: string;
}

interface OverflowState {
  left: boolean;
  right: boolean;
}

/** Horizontally scrollable bottom navigation with a docked More menu for off-screen tabs. */
export function AdaptiveBottomNav({
  items,
  activeId,
  onChange,
  onAfterChange,
  variant = "phone",
  className,
  "aria-label": ariaLabel = "App sections",
}: AdaptiveBottomNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const visibilityRef = useRef<Record<string, boolean>>({});
  const [overflow, setOverflow] = useState<OverflowState>({ left: false, right: false });
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  const updateOverflow = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const hasOverflow = element.scrollWidth > element.clientWidth + 1;
    setOverflow({
      left: hasOverflow && element.scrollLeft > 4,
      right: hasOverflow && element.scrollLeft + element.clientWidth < element.scrollWidth - 4,
    });
  }, []);

  const syncHiddenItems = useCallback(() => {
    const hidden = items
      .filter((item) => visibilityRef.current[item.id] === false)
      .map((item) => item.id);
    setHiddenIds(hidden);
  }, [items]);

  useEffect(() => {
    updateOverflow();
    const element = scrollRef.current;
    if (!element) return;

    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);
    if (element.firstElementChild) {
      observer.observe(element.firstElementChild);
    }

    return () => observer.disconnect();
  }, [items.length, updateOverflow]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    visibilityRef.current = Object.fromEntries(items.map((item) => [item.id, true]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-nav-id");
          if (!id) return;
          visibilityRef.current[id] = entry.isIntersecting;
        });
        syncHiddenItems();
        updateOverflow();
      },
      { root: scroller, threshold: 0.72 },
    );

    const buttons = scroller.querySelectorAll<HTMLElement>("[data-nav-id]");
    buttons.forEach((button) => observer.observe(button));

    return () => observer.disconnect();
  }, [items, syncHiddenItems, updateOverflow]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const activeButton = element.querySelector<HTMLElement>(`[data-nav-id="${activeId}"]`);
    activeButton?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId, items]);

  function scrollBy(delta: number) {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  function handleSelect(id: string) {
    onChange(id);
    onAfterChange?.();
  }

  const overflowItems = useMemo(
    () => items.filter((item) => hiddenIds.includes(item.id)),
    [hiddenIds, items],
  );

  const showOverflowDock = variant === "phone" && overflowItems.length > 0;
  const overflowMenuActive = overflowItems.some((item) => item.id === activeId);

  const overflowMenuItems: MenuItemDescriptor[] = overflowItems.map((item, index) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    separatorAbove: index === 0,
    onSelect: () => handleSelect(item.id),
  }));

  const showScrollButtons = variant === "modal" && (overflow.left || overflow.right);

  return (
    <nav
      className={cx(styles.root, styles[variant], showOverflowDock && styles.rootWithDock, className)}
      aria-label={ariaLabel}
      data-overflow-left={overflow.left || undefined}
      data-overflow-right={overflow.right || undefined}
    >
      {showScrollButtons && overflow.left && (
        <button
          type="button"
          className={cx(styles.scrollButton, styles.scrollButtonLeft)}
          aria-label="Scroll tabs left"
          onClick={() => scrollBy(-120)}
        >
          <Icon name="chevron-left" size={14} />
        </button>
      )}

      {overflow.left && <span className={cx(styles.fade, styles.fadeLeft)} aria-hidden="true" />}

      <div ref={scrollRef} className={cx("lf-scrollbar-hidden", styles.scroller)} onScroll={updateOverflow}>
        <div className={styles.track}>
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                data-nav-id={item.id}
                className={cx("lf-focusable", styles.tabButton, active && styles.tabButtonActive)}
                aria-current={active ? "page" : undefined}
                onClick={() => handleSelect(item.id)}
              >
                <span className={styles.tabIcon}>
                  <Icon name={item.icon} size={variant === "modal" ? 14 : 18} />
                </span>
                <span className={styles.tabLabel}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {overflow.right && !showOverflowDock && <span className={cx(styles.fade, styles.fadeRight)} aria-hidden="true" />}

      {showScrollButtons && overflow.right && (
        <button
          type="button"
          className={cx(styles.scrollButton, styles.scrollButtonRight)}
          aria-label="Scroll tabs right"
          onClick={() => scrollBy(120)}
        >
          <Icon name="chevron-right" size={14} />
        </button>
      )}

      {showOverflowDock && (
        <div className={styles.overflowDock}>
          <span className={styles.overflowDockFade} aria-hidden="true" />
          <Menu
            side="top"
            align="end"
            aria-label="More destinations"
            items={overflowMenuItems}
            trigger={
              <button
                type="button"
                className={cx(
                  "lf-focusable",
                  styles.tabButton,
                  styles.overflowTab,
                  overflowMenuActive && styles.tabButtonActive,
                )}
                aria-haspopup="menu"
              >
                <span className={cx(styles.tabIcon, styles.overflowIconWrap)}>
                  <Icon name="more-horizontal" size={18} />
                  <span className={styles.overflowCount}>{overflowItems.length}</span>
                </span>
                <span className={styles.tabLabel}>More</span>
              </button>
            }
          />
        </div>
      )}
    </nav>
  );
}
