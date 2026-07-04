import type { ReactNode } from "react";
import { Icon, type IconName } from "../../../icons";
import { IconButton } from "../../primitives/IconButton";
import { cx } from "../../../utils/cx";
import styles from "./ConversationTabBar.tailwind";

export interface ConversationTabItem {
  id: string;
  label: ReactNode;
  icon?: IconName;
  /** Small color swatch shown when no icon is provided. */
  swatch?: string;
  closable?: boolean;
}

export interface ConversationTabBarProps {
  tabs: ConversationTabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Project or workspace name shown to the left of conversation tabs. */
  projectLabel?: ReactNode;
  onClose?: (id: string) => void;
  onNewTab?: () => void;
  onHistory?: () => void;
  onMore?: () => void;
  onClosePanel?: () => void;
  className?: string;
}

/** Flat, divider-separated tab row for the right conversation drawer header. */
export function ConversationTabBar({
  tabs,
  activeId,
  onSelect,
  projectLabel,
  onClose,
  onNewTab,
  onHistory,
  onMore,
  onClosePanel,
  className,
}: ConversationTabBarProps) {
  return (
    <div className={cx(styles.bar, className)}>
      {projectLabel ? <div className={styles.project}>{projectLabel}</div> : null}
      <div className={cx("lf-scrollbar-hidden", styles.tabs)} role="tablist" aria-label="Conversation tabs">
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              className={cx("lf-focusable", styles.tab, active && styles.tabActive)}
              onClick={() => onSelect(tab.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(tab.id);
              }}
            >
              {tab.icon ? (
                <Icon name={tab.icon} size={12} className={styles.tabIcon} />
              ) : (
                <span className={styles.swatch} style={tab.swatch ? { background: tab.swatch } : undefined} />
              )}
              <span className={styles.label}>{tab.label}</span>
              {active && tab.closable && onClose && (
                <span
                  className={styles.close}
                  role="button"
                  aria-label={`Close ${typeof tab.label === "string" ? tab.label : "tab"}`}
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

      <div className={styles.actions}>
        {onNewTab && <IconButton icon="plus" label="New conversation" size="sm" onClick={onNewTab} />}
        {onHistory && <IconButton icon="clock" label="Conversation history" size="sm" onClick={onHistory} />}
        {onMore && <IconButton icon="more-horizontal" label="More options" size="sm" onClick={onMore} />}
        {onClosePanel && <IconButton icon="panel-right" label="Close panel" size="sm" onClick={onClosePanel} />}
      </div>
    </div>
  );
}
