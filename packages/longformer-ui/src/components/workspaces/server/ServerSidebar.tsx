import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { NavSidebar } from "../../shell/NavSidebar";
import { cx } from "../../../utils/cx";
import type { ServerView, ServerWorkspaceData } from "./types";
import styles from "./ServerSidebar.module.css";

export interface ServerSidebarProps {
  data: ServerWorkspaceData;
  view: ServerView;
  onViewChange: (view: ServerView) => void;
}

/** Coolify-style global nav — team switcher, search, and infrastructure sections. */
export function ServerSidebar({ data, view, onViewChange }: ServerSidebarProps) {
  const primaryItems = data.navItems.filter((item) =>
    ["dashboard", "deployments", "storage", "servers"].includes(item.view),
  );
  const secondaryItems = data.navItems.filter((item) =>
    ["sources", "domains"].includes(item.view),
  );

  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <>
          <button type="button" className={styles.teamPicker}>
            <span className={styles.teamIcon}>
              <Icon name="terminal" size={14} />
            </span>
            <span className={styles.teamLabel}>
              <span className={styles.teamName}>{data.teamName}</span>
              <span className={styles.planTag}>{data.planLabel}</span>
            </span>
            <Icon name="chevron-down" size={14} />
          </button>

          <div className={styles.search}>
            <Icon name="search" size={14} />
            <span>Find…</span>
            <kbd className={styles.kbd}>⌘K</kbd>
          </div>
        </>
      }
      sections={[
        {
          id: "primary",
          items: primaryItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            trailing: item.badge ? <span className={styles.badge}>{item.badge}</span> : undefined,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
            className: styles.navItem,
          })),
        },
        {
          id: "secondary",
          title: "Configuration",
          items: secondaryItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
            className: styles.navItem,
          })),
        },
      ]}
      footer={
        <div className={styles.footer}>
          <div className={styles.promo}>
            <span className={styles.promoTitle}>Deploy credits</span>
            <span className={styles.promoText}>Add a card to unlock Pro monitoring.</span>
            <button type="button" className={styles.promoBtn}>
              Add Card
            </button>
          </div>
          <div className={styles.profile}>
            <Avatar name={data.userName} size="sm" />
            <span>{data.userName}</span>
            <button type="button" className={cx(styles.iconBtn, "lf-focusable")} aria-label="Settings">
              <Icon name="settings" size={14} />
            </button>
          </div>
        </div>
      }
    />
  );
}
