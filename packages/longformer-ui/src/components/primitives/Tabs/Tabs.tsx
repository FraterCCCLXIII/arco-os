import { useRef, type KeyboardEvent } from "react";
import { cx } from "../../../utils/cx";
import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  variant?: "pill" | "underline";
  className?: string;
  "aria-label"?: string;
}

/** Accessible tab list — roving tabindex, arrow-key navigation. */
export function Tabs({ items, value, onChange, variant = "pill", className, ...aria }: TabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = items.findIndex((item) => item.id === value);
    if (currentIndex === -1) return;
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }
    if (nextIndex !== null) {
      event.preventDefault();
      const next = items[nextIndex];
      onChange(next.id);
      refs.current[next.id]?.focus();
    }
  }

  const isUnderline = variant === "underline";

  return (
    <div
      role="tablist"
      aria-label={aria["aria-label"]}
      className={cx(isUnderline ? styles.underlineList : styles.list, className)}
      onKeyDown={handleKeyDown}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[item.id] = el;
            }}
            role="tab"
            type="button"
            id={`lf-tab-${item.id}`}
            aria-selected={active}
            aria-controls={`lf-tabpanel-${item.id}`}
            tabIndex={active ? 0 : -1}
            className={cx(
              "lf-focusable",
              isUnderline ? styles.underlineTab : styles.tab,
              active && (isUnderline ? styles.underlineTabActive : styles.tabActive)
            )}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps {
  id: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, active, children, className }: TabPanelProps) {
  if (!active) return null;
  return (
    <div role="tabpanel" id={`lf-tabpanel-${id}`} aria-labelledby={`lf-tab-${id}`} className={className}>
      {children}
    </div>
  );
}
