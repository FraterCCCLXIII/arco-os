import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import styles from "./TabStrip.module.css";

export interface TabStripItem {
  id: string;
  label: ReactNode;
  icon?: IconName;
  /** Small color swatch shown in place of a real favicon. */
  swatch?: string;
  closable?: boolean;
}

export interface TabStripProps {
  tabs: TabStripItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
  className?: string;
}

/** Horizontal browser-style tab row, used inside `BrowserApp`'s window content. */
export function TabStrip({ tabs, activeId, onSelect, onClose, className }: TabStripProps) {
  return (
    <div className={cx("lf-scrollbar-hidden", styles.strip, className)} role="tablist">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className={cx("lf-focusable", styles.tab, active && styles.active)}
            onClick={() => onSelect(tab.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onSelect(tab.id);
            }}
          >
            {tab.icon ? (
              <Icon name={tab.icon} size={12} />
            ) : (
              <span className={styles.swatch} style={tab.swatch ? { background: tab.swatch } : undefined} />
            )}
            <span className={styles.label}>{tab.label}</span>
            {tab.closable && onClose && (
              <span
                className={styles.close}
                role="button"
                aria-label="Close tab"
                tabIndex={-1}
                onClick={(event) => {
                  event.stopPropagation();
                  onClose(tab.id);
                }}
              >
                <Icon name="close" size={11} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
