import type { ReactNode } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ResizablePane } from "../../primitives/ResizablePane";
import { CountBadge } from "../../primitives/Badge";
import { MailListItem } from "./MailListItem";
import { ReadingPane } from "./ReadingPane";
import type { EmailDetailMessage, EmailThread } from "./types";
import styles from "./EmailWorkspace.module.css";

export interface EmailWorkspaceProps {
  threads: EmailThread[];
  activeThreadId?: string;
  onSelectThread: (id: string) => void;
  onToggleStar?: (id: string) => void;
  activeSubject?: string;
  activeMessages?: EmailDetailMessage[];
  replyBar?: ReactNode;
  listPaneWidth?: number;
  defaultListPaneWidth?: number;
  onListPaneWidthChange?: (width: number) => void;
}

/** Inbox list + reading pane, combining the Notion-inbox and Slack-thread patterns. */
export function EmailWorkspace({
  threads,
  activeThreadId,
  onSelectThread,
  onToggleStar,
  activeSubject,
  activeMessages = [],
  replyBar,
  listPaneWidth,
  defaultListPaneWidth = 360,
  onListPaneWidthChange,
}: EmailWorkspaceProps) {
  const unreadCount = threads.filter((thread) => thread.unread).length;

  return (
    <div className={styles.workspace}>
      <ResizablePane
        width={listPaneWidth}
        defaultWidth={defaultListPaneWidth}
        onWidthChange={onListPaneWidthChange}
        minWidth={260}
        maxWidth={520}
        handleSide="right"
        className={styles.listResizable}
        paneClassName={styles.list}
        handleLabel="Resize inbox list"
      >
        <div className={styles.listHeader}>
          Inbox
          <CountBadge count={unreadCount} />
        </div>
        <ScrollArea className={styles.listScroll}>
          {threads.map((thread) => (
            <MailListItem
              key={thread.id}
              thread={thread}
              active={thread.id === activeThreadId}
              onClick={() => onSelectThread(thread.id)}
              onToggleStar={() => onToggleStar?.(thread.id)}
            />
          ))}
        </ScrollArea>
      </ResizablePane>
      <div className={styles.detail}>
        <ReadingPane subject={activeSubject} messages={activeMessages} replyBar={replyBar} />
      </div>
    </div>
  );
}
