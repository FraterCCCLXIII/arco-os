import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { ThinkingBlock } from "./ThinkingBlock";
import type { ChatMessage } from "./types";
import styles from "./MessageBubble.module.css";

export interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className={cx(styles.row, styles.rowUser)}>
        <div className={styles.bubble}>{message.content}</div>
      </div>
    );
  }

  return (
    <div className={cx(styles.row, styles.rowAgent)}>
      <div className={styles.agentColumn}>
        {message.thinking && (
          <ThinkingBlock label={message.thinking.label}>
            <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
              {message.thinking.steps.map((step) => (
                <li key={step.id}>{step.text}</li>
              ))}
            </ul>
          </ThinkingBlock>
        )}
        <div className={styles.agentContent}>{message.content}</div>
        <div className={styles.meta}>
          {message.timestamp && <span>{message.timestamp}</span>}
          <span className={styles.metaAction} role="button" aria-label="Copy message" tabIndex={0}>
            <Icon name="copy" size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}
