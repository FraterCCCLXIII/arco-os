import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import type { EmailThread } from "./types";
import styles from "./MailListItem.module.css";

export interface MailListItemProps {
  thread: EmailThread;
  active?: boolean;
  onClick?: () => void;
  onToggleStar?: () => void;
}

export function MailListItem({ thread, active = false, onClick, onToggleStar }: MailListItemProps) {
  return (
    <button type="button" className={cx("lf-focusable", styles.item, active && styles.itemActive)} onClick={onClick}>
      {thread.unread ? <span className={styles.unreadDot} aria-label="Unread" /> : <span style={{ width: 7 }} />}
      <Avatar name={thread.senderName} src={thread.senderAvatarSrc} size="md" />
      <span className={styles.body}>
        <span className={styles.topRow}>
          <span className={cx(styles.sender, thread.unread && styles.senderUnread)}>{thread.senderName}</span>
          <span className={styles.timestamp}>{thread.timestamp}</span>
        </span>
        <span className={styles.subject}>{thread.subject}</span>
        <span className={styles.preview}>{thread.preview}</span>
      </span>
      <span
        role="button"
        tabIndex={-1}
        aria-label={thread.starred ? "Unstar" : "Star"}
        className={cx(styles.starButton, thread.starred && styles.starActive)}
        onClick={(event) => {
          event.stopPropagation();
          onToggleStar?.();
        }}
      >
        <Icon name="star" size={14} />
      </span>
    </button>
  );
}
