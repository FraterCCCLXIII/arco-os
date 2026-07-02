import { Icon } from "../../../icons";
import { NavSidebar } from "../../shell/NavSidebar";
import type { TicketsView, TicketsWorkspaceData } from "./types";
import styles from "./TicketsSidebar.module.css";

export interface TicketsSidebarProps {
  data: TicketsWorkspaceData;
  view: TicketsView;
  onViewChange: (view: TicketsView) => void;
}

/** Helpdesk nav — queues, conversations, pinned tickets, and workspace footer. */
export function TicketsSidebar({ data, view, onViewChange }: TicketsSidebarProps) {
  const primaryItems = data.navItems.filter((item) =>
    ["dashboard", "inbox", "notification", "ticket"].includes(item.view),
  );
  const secondaryItems = data.navItems.filter((item) =>
    ["knowledge-base", "customer", "forum", "report"].includes(item.view),
  );

  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <>
          <div className={styles.brand}>
            <span className={styles.brandIcon} aria-hidden="true">
              FIK
            </span>
            <div className={styles.brandBody}>
              <span className={styles.brandName}>{data.productName}</span>
              <span className={styles.brandRole}>{data.userRole}</span>
            </div>
          </div>

          <div className={styles.search}>
            <Icon name="search" size={14} />
            <span>Search</span>
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
          items: secondaryItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
            className: styles.navItem,
          })),
        },
        {
          id: "conversation",
          title: "Conversation",
          items: data.conversationItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            trailing: item.badge ? <span className={styles.badge}>{item.badge}</span> : undefined,
            className: styles.navItem,
          })),
        },
        {
          id: "pinned",
          title: "Pinned Tickets",
          items: data.pinnedTickets.map((item) => ({
            id: item.id,
            label: item.label,
            trailing: item.meta ? <span className={styles.pinnedMeta}>{item.meta}</span> : undefined,
            className: styles.pinnedItem,
          })),
        },
      ]}
      footer={
        <div className={styles.footer}>
          <div className={styles.footerActions}>
            <button type="button" className={styles.footerLink}>
              <Icon name="plus" size={14} />
              Add new
            </button>
            <button type="button" className={styles.footerLink}>
              <Icon name="message-square" size={14} />
              Help &amp; Support
            </button>
          </div>
          <p className={styles.poweredBy}>
            POWERED BY <strong>kirridesk</strong>
          </p>
        </div>
      }
    />
  );
}
