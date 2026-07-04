import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { NOTIFICATION_TYPE_ICON, type NotificationItem } from "./types";
import styles from "./NotificationRow.tailwind";

export interface NotificationRowProps {
  notification: NotificationItem;
  onMarkAsRead?: (id: string) => void;
  onSelect?: (id: string) => void;
}

export function NotificationRow({ notification, onMarkAsRead, onSelect }: NotificationRowProps) {
  const unread = !notification.read;

  return (
    <button
      type="button"
      className={cx("lf-focusable", styles.row, unread && styles.rowUnread)}
      onClick={() => onSelect?.(notification.id)}
    >
      <span className={styles.leading}>
        {notification.actor ? (
          <Avatar name={notification.actor.name} src={notification.actor.avatarSrc} size="md" />
        ) : (
          <span className={styles.typeIcon}>
            <Icon name={NOTIFICATION_TYPE_ICON[notification.type]} size={15} />
          </span>
        )}
        {unread && <span className={styles.unreadDot} aria-hidden="true" />}
      </span>
      <span className={styles.body}>
        <span className={styles.topRow}>
          <span className={cx(styles.message, unread && styles.messageUnread)}>{notification.message}</span>
          <span className={styles.timestamp}>{notification.timestamp}</span>
        </span>
        {notification.detail && <span className={styles.detail}>{notification.detail}</span>}
      </span>
      {unread && onMarkAsRead && (
        <span
          role="button"
          tabIndex={-1}
          aria-label="Mark as read"
          className={styles.markReadButton}
          onClick={(event) => {
            event.stopPropagation();
            onMarkAsRead(notification.id);
          }}
        >
          <Icon name="check" size={14} />
        </span>
      )}
    </button>
  );
}
