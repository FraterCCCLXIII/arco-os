import { cx } from "../../../utils/cx";
import { Avatar } from "../../primitives/Avatar";
import { CountBadge } from "../../primitives/Badge";
import type { MessageContact } from "./types";
import inboxStyles from "../../shell/ListPane/inboxListItem.module.css";
import styles from "./ContactListItem.module.css";

export interface ContactListItemProps {
  contact: MessageContact;
  active?: boolean;
  onClick?: () => void;
}

export function ContactListItem({ contact, active = false, onClick }: ContactListItemProps) {
  const unread = (contact.unreadCount ?? 0) > 0;

  return (
    <button
      type="button"
      className={cx(
        "lf-focusable",
        inboxStyles.row,
        unread && inboxStyles.rowUnread,
        active && styles.itemActive,
        active && unread && styles.itemActiveUnread,
      )}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
    >
      <Avatar
        name={contact.name}
        src={contact.avatarSrc}
        size="md"
        status={contact.isGroup ? undefined : contact.status}
      />
      <span className={inboxStyles.body}>
        <span className={inboxStyles.topRow}>
          <span className={inboxStyles.primary}>{contact.name}</span>
          {contact.timestamp && <span className={inboxStyles.timestamp}>{contact.timestamp}</span>}
        </span>
        <span className={cx(inboxStyles.preview, unread && styles.previewUnread)}>
          {contact.typing ? <span className={styles.typing}>typing…</span> : contact.lastMessage}
        </span>
      </span>
      {unread ? (
        <span className={inboxStyles.trailing}>
          <CountBadge count={contact.unreadCount ?? 0} />
        </span>
      ) : null}
    </button>
  );
}
