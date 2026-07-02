import { cx } from "../../../utils/cx";
import { Avatar } from "../../primitives/Avatar";
import { CountBadge } from "../../primitives/Badge";
import type { MessageContact } from "./types";
import styles from "./ContactListItem.module.css";

export interface ContactListItemProps {
  contact: MessageContact;
  active?: boolean;
  onClick?: () => void;
}

export function ContactListItem({ contact, active = false, onClick }: ContactListItemProps) {
  const unread = (contact.unreadCount ?? 0) > 0;

  return (
    <button type="button" className={cx("lf-focusable", styles.item, active && styles.itemActive)} onClick={onClick}>
      <Avatar name={contact.name} src={contact.avatarSrc} size="md" status={contact.isGroup ? undefined : contact.status} />
      <span className={styles.body}>
        <span className={styles.topRow}>
          <span className={styles.name}>{contact.name}</span>
          {contact.timestamp && <span className={styles.timestamp}>{contact.timestamp}</span>}
        </span>
        <span className={cx(styles.preview, unread && styles.previewUnread)}>
          {contact.typing ? <span className={styles.typing}>typing…</span> : contact.lastMessage}
        </span>
      </span>
      {unread && <CountBadge count={contact.unreadCount ?? 0} className={styles.unreadBadge} />}
    </button>
  );
}
