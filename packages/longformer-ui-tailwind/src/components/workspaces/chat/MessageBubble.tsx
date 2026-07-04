import { type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { ThinkingBlock } from "./ThinkingBlock";
import { chatMessageText, type ChatMessage } from "./types";
import styles from "./MessageBubble.tailwind";

export interface MessageBubbleProps {
  message: ChatMessage;
  onCopy?: (message: ChatMessage) => void;
  onEdit?: (message: ChatMessage) => void;
  /** Rewind the conversation to this user message (checkpoint restore). */
  onRestore?: (message: ChatMessage) => void;
  onAgentCopy?: (message: ChatMessage) => void;
  onAgentRegenerate?: (message: ChatMessage) => void;
  onAgentThumbsUp?: (message: ChatMessage) => void;
  onAgentThumbsDown?: (message: ChatMessage) => void;
  onAgentShare?: (message: ChatMessage) => void;
  onAgentFork?: (message: ChatMessage) => void;
}

function BubbleAction({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cx("lf-focusable", styles.bubbleAction, active && styles.bubbleActionActive)}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function UserBubbleActions({
  message,
  onCopy,
  onEdit,
  onRestore,
}: Pick<MessageBubbleProps, "message" | "onCopy" | "onEdit" | "onRestore">) {
  const text = chatMessageText(message);
  const showCopy = Boolean(onCopy || text);
  if (!showCopy && !onEdit && !onRestore) return null;

  function handleCopy() {
    if (onCopy) {
      onCopy(message);
      return;
    }
    if (text && typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text);
    }
  }

  return (
    <div className={styles.userActions}>
      {showCopy ? (
        <BubbleAction label="Copy message" onClick={handleCopy}>
          <Icon name="copy" size={13} />
        </BubbleAction>
      ) : null}
      {onEdit ? (
        <BubbleAction label="Edit message" onClick={() => onEdit(message)}>
          <Icon name="edit" size={13} />
        </BubbleAction>
      ) : null}
      {onRestore ? (
        <BubbleAction label="Restore checkpoint" onClick={() => onRestore(message)}>
          <Icon name="undo" size={13} />
        </BubbleAction>
      ) : null}
    </div>
  );
}

function AgentBubbleActions({
  message,
  onAgentCopy,
  onAgentRegenerate,
  onAgentThumbsUp,
  onAgentThumbsDown,
  onAgentShare,
  onAgentFork,
}: Pick<
  MessageBubbleProps,
  | "message"
  | "onAgentCopy"
  | "onAgentRegenerate"
  | "onAgentThumbsUp"
  | "onAgentThumbsDown"
  | "onAgentShare"
  | "onAgentFork"
>) {
  const text = chatMessageText(message);
  const showCopy = Boolean(onAgentCopy || text);
  const hasActions =
    showCopy || onAgentRegenerate || onAgentThumbsUp || onAgentThumbsDown || onAgentShare || onAgentFork;
  if (!hasActions) return null;

  function handleCopy() {
    if (onAgentCopy) {
      onAgentCopy(message);
      return;
    }
    if (text && typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text);
    }
  }

  return (
    <div className={styles.agentActions}>
      {showCopy ? (
        <BubbleAction label="Copy message" onClick={handleCopy}>
          <Icon name="copy" size={13} />
        </BubbleAction>
      ) : null}
      {onAgentRegenerate ? (
        <BubbleAction label="Regenerate response" onClick={() => onAgentRegenerate(message)}>
          <Icon name="refresh" size={13} />
        </BubbleAction>
      ) : null}
      {onAgentThumbsUp ? (
        <BubbleAction
          label="Good response"
          active={message.feedback === "up"}
          onClick={() => onAgentThumbsUp(message)}
        >
          <Icon name="thumbs-up" size={13} />
        </BubbleAction>
      ) : null}
      {onAgentThumbsDown ? (
        <BubbleAction
          label="Bad response"
          active={message.feedback === "down"}
          onClick={() => onAgentThumbsDown(message)}
        >
          <Icon name="thumbs-down" size={13} />
        </BubbleAction>
      ) : null}
      {onAgentShare ? (
        <BubbleAction label="Share response" onClick={() => onAgentShare(message)}>
          <Icon name="share" size={13} />
        </BubbleAction>
      ) : null}
      {onAgentFork ? (
        <BubbleAction label="Fork conversation" onClick={() => onAgentFork(message)}>
          <Icon name="fork" size={13} />
        </BubbleAction>
      ) : null}
    </div>
  );
}

export function MessageBubble({
  message,
  onCopy,
  onEdit,
  onRestore,
  onAgentCopy,
  onAgentRegenerate,
  onAgentThumbsUp,
  onAgentThumbsDown,
  onAgentShare,
  onAgentFork,
}: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className={cx(styles.row, styles.rowUser)}>
        <div className={styles.userColumn}>
          <div className={styles.bubble}>{message.content}</div>
          <UserBubbleActions message={message} onCopy={onCopy} onEdit={onEdit} onRestore={onRestore} />
        </div>
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
        <div className={styles.agentFooter}>
          {message.timestamp ? <span className={styles.agentTimestamp}>{message.timestamp}</span> : null}
          <AgentBubbleActions
            message={message}
            onAgentCopy={onAgentCopy}
            onAgentRegenerate={onAgentRegenerate}
            onAgentThumbsUp={onAgentThumbsUp}
            onAgentThumbsDown={onAgentThumbsDown}
            onAgentShare={onAgentShare}
            onAgentFork={onAgentFork}
          />
        </div>
      </div>
    </div>
  );
}
