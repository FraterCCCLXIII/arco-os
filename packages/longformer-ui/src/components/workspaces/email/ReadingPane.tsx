import { useEffect, useState, type ReactNode } from "react";
import { Avatar } from "../../primitives/Avatar";
import { IconButton } from "../../primitives/IconButton";
import { ScrollArea } from "../../primitives/ScrollArea";
import { EmptyState } from "../../primitives/EmptyState";
import { Icon } from "../../../icons";
import { EmailReplyComposer } from "./EmailReplyComposer";
import type { EmailDetailMessage } from "./types";
import styles from "./ReadingPane.module.css";

export interface ReadingPaneProps {
  subject?: string;
  messages: EmailDetailMessage[];
  /** Override the built-in rich-text reply composer. */
  replyBar?: ReactNode;
}

export function ReadingPane({ subject, messages, replyBar }: ReadingPaneProps) {
  const [replyOpen, setReplyOpen] = useState(false);

  useEffect(() => {
    setReplyOpen(false);
  }, [subject]);
  if (!subject || messages.length === 0) {
    return (
      <div className={styles.pane}>
        <EmptyState
          icon={<Icon name="mail" size={22} />}
          title="No thread selected"
          description="Pick a message from the inbox to read it here."
        />
      </div>
    );
  }

  return (
    <div className={styles.pane}>
      <div className={styles.header}>
        <h2 className={styles.subject}>{subject}</h2>
        <div className={styles.headerActions}>
          <IconButton
            icon="reply"
            label={replyOpen ? "Hide reply" : "Reply"}
            size="sm"
            aria-pressed={replyOpen}
            onClick={() => setReplyOpen((open) => !open)}
          />
          <IconButton icon="archive" label="Archive" size="sm" />
          <IconButton icon="trash" label="Delete" size="sm" />
        </div>
      </div>
      <ScrollArea className={styles.scroll}>
        <div className={styles.messages}>
          {messages.map((message) => (
            <div key={message.id} className={styles.message}>
              <Avatar name={message.senderName} src={message.senderAvatarSrc} size="md" />
              <div className={styles.messageBody}>
                <div className={styles.messageHead}>
                  <span className={styles.messageSender}>{message.senderName}</span>
                  <span className={styles.messageTimestamp}>{message.timestamp}</span>
                </div>
                <div className={styles.messageContent}>{message.body}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {(replyOpen || replyBar) && (
        <div className={styles.replyBar}>{replyBar ?? <EmailReplyComposer />}</div>
      )}
    </div>
  );
}
