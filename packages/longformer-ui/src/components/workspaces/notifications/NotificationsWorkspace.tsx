import { useMemo, type ReactNode } from "react";
import { Icon } from "../../../icons";
import { ScrollArea } from "../../primitives/ScrollArea";
import { CountBadge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { EmptyState } from "../../primitives/EmptyState";
import { NotificationRow } from "./NotificationRow";
import type { NotificationItem } from "./types";
import styles from "./NotificationsWorkspace.module.css";

export interface NotificationsWorkspaceProps {
  title?: string;
  notifications: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onSelect?: (id: string) => void;
  actions?: ReactNode;
}

interface NotificationGroup {
  label: string;
  items: NotificationItem[];
}

/** A single-pane activity feed: mentions, comments, assignments, and agent/system updates grouped by recency. */
export function NotificationsWorkspace({
  title = "Notifications",
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelect,
  actions,
}: NotificationsWorkspaceProps) {
  const unreadCount = notifications.filter((item) => !item.read).length;

  const groups = useMemo<NotificationGroup[]>(() => {
    const order: string[] = [];
    const byLabel = new Map<string, NotificationItem[]>();
    for (const item of notifications) {
      const label = item.group ?? "Notifications";
      if (!byLabel.has(label)) {
        byLabel.set(label, []);
        order.push(label);
      }
      byLabel.get(label)!.push(item);
    }
    return order.map((label) => ({ label, items: byLabel.get(label)! }));
  }, [notifications]);

  return (
    <div className={styles.workspace}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Icon name="bell" size={15} />
          {title}
          <CountBadge count={unreadCount} />
        </div>
        <div className={styles.headerActions}>
          {onMarkAllAsRead && unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
          {actions}
        </div>
      </div>
      <ScrollArea className={styles.scroll}>
        <div className={styles.list}>
          {groups.length === 0 ? (
            <EmptyState
              className={styles.empty}
              icon={<Icon name="bell" size={22} />}
              title="You're all caught up"
              description="Mentions, comments, and agent updates will show up here."
            />
          ) : (
            groups.map((group) => (
              <div key={group.label} className={styles.group}>
                <div className={styles.groupHeader}>{group.label}</div>
                <div className={styles.groupList}>
                  {group.items.map((notification) => (
                    <NotificationRow
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={onMarkAsRead}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
