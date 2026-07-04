import { cx } from "../../../utils/cx";
import { Avatar } from "../../primitives/Avatar";
import type { DirectMessage } from "./types";
import styles from "./DirectMessageBubble.tailwind";

export interface DirectMessageBubbleProps {
  message: DirectMessage;
  own: boolean;
  /** Show the sender's avatar + name above the bubble, used for group threads. */
  showSender?: boolean;
}

export function DirectMessageBubble({ message, own, showSender = false }: DirectMessageBubbleProps) {
  return (
    <div className={cx(styles.row, own ? styles.rowOwn : styles.rowOther)}>
      {!own && showSender && (
        <span className={styles.avatarSlot}>
          <Avatar name={message.senderName ?? "?"} src={message.senderAvatarSrc} size="sm" />
        </span>
      )}
      <div className={styles.column}>
        {!own && showSender && message.senderName && <div className={styles.sender}>{message.senderName}</div>}
        <div className={cx(styles.bubble, own ? styles.bubbleOwn : styles.bubbleOther)}>{message.content}</div>
        <div className={styles.timestamp}>{message.timestamp}</div>
      </div>
    </div>
  );
}
