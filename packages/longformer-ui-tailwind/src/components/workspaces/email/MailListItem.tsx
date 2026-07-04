import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import type { EmailThread } from "./types";
import inboxStyles from "../../shell/ListPane/inboxListItem.tailwind";
import styles from "./MailListItem.tailwind";

export interface MailListItemProps {
  thread: EmailThread;
  active?: boolean;
  onClick?: () => void;
  onToggleStar?: () => void;
}

export function MailListItem({ thread, active = false, onClick, onToggleStar }: MailListItemProps) {
  return (
    <button
      type="button"
      className={cx(
        "lf-focusable",
        inboxStyles.row,
        styles.item,
        thread.unread && inboxStyles.rowUnread,
        active && inboxStyles.rowActive,
      )}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
    >
      <span className={inboxStyles.unreadMarker} aria-hidden="true">
        {thread.unread ? <span className={inboxStyles.unreadDot} /> : null}
      </span>
      <Avatar name={thread.senderName} src={thread.senderAvatarSrc} size="md" />
      <span className={inboxStyles.body}>
        <span className={inboxStyles.topRow}>
          <span className={inboxStyles.primary}>{thread.senderName}</span>
          <span className={inboxStyles.timestamp}>{thread.timestamp}</span>
        </span>
        <span className={cx(styles.subject, thread.unread && styles.subjectUnread)}>{thread.subject}</span>
        <span className={inboxStyles.preview}>{thread.preview}</span>
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
