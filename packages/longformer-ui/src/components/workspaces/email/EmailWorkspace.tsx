import { useMemo, useState, type ReactNode } from "react";
import { Icon } from "../../../icons";
import { Chip } from "../../primitives/Chip";
import { Input } from "../../primitives/Input";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ResizablePane } from "../../primitives/ResizablePane";
import { CountBadge } from "../../primitives/Badge";
import { EmptyState } from "../../primitives/EmptyState";
import { ListPane } from "../../shell/ListPane";
import listPaneStyles from "../../shell/ListPane/ListPane.module.css";
import { MailListItem } from "./MailListItem";
import { ReadingPane } from "./ReadingPane";
import type { EmailDetailMessage, EmailThread } from "./types";
import styles from "./EmailWorkspace.module.css";

export type EmailInboxFilter = "all" | "unread" | "starred";

export interface EmailWorkspaceProps {
  threads: EmailThread[];
  activeThreadId?: string;
  onSelectThread: (id: string) => void;
  onToggleStar?: (id: string) => void;
  activeSubject?: string;
  activeMessages?: EmailDetailMessage[];
  replyBar?: ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  inboxFilter?: EmailInboxFilter;
  onInboxFilterChange?: (filter: EmailInboxFilter) => void;
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
  searchQuery: searchQueryProp,
  onSearchChange,
  inboxFilter: inboxFilterProp,
  onInboxFilterChange,
  listPaneWidth,
  defaultListPaneWidth = 360,
  onListPaneWidthChange,
}: EmailWorkspaceProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalFilter, setInternalFilter] = useState<EmailInboxFilter>("all");

  const searchQuery = searchQueryProp ?? internalSearch;
  const setSearchQuery = onSearchChange ?? setInternalSearch;
  const inboxFilter = inboxFilterProp ?? internalFilter;
  const setInboxFilter = onInboxFilterChange ?? setInternalFilter;

  const unreadCount = threads.filter((thread) => thread.unread).length;
  const starredCount = threads.filter((thread) => thread.starred).length;

  const filteredThreads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return threads.filter((thread) => {
      if (inboxFilter === "unread" && !thread.unread) return false;
      if (inboxFilter === "starred" && !thread.starred) return false;
      if (!query) return true;

      return (
        thread.senderName.toLowerCase().includes(query) ||
        thread.subject.toLowerCase().includes(query) ||
        thread.preview.toLowerCase().includes(query)
      );
    });
  }, [threads, searchQuery, inboxFilter]);

  return (
    <div className={styles.workspace}>
      <ResizablePane
        width={listPaneWidth}
        defaultWidth={defaultListPaneWidth}
        onWidthChange={onListPaneWidthChange}
        minWidth={280}
        maxWidth={520}
        handleSide="right"
        className={styles.listResizable}
        handleLabel="Resize inbox list"
      >
        <ListPane
          className={styles.listPane}
          bodyClassName={listPaneStyles.bodyInset}
          title={
            <>
              <Icon name="mail" size={16} />
              Inbox
              <CountBadge count={unreadCount} />
            </>
          }
          toolbar={
            <>
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search mail"
                aria-label="Search mail"
                startSlot={<Icon name="search" size={14} />}
              />
              <div className={styles.filterRow} role="tablist" aria-label="Inbox filters">
                <Chip active={inboxFilter === "all"} onClick={() => setInboxFilter("all")}>
                  All
                </Chip>
                <Chip active={inboxFilter === "unread"} onClick={() => setInboxFilter("unread")}>
                  Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
                </Chip>
                <Chip active={inboxFilter === "starred"} onClick={() => setInboxFilter("starred")}>
                  Starred{starredCount > 0 ? ` (${starredCount})` : ""}
                </Chip>
              </div>
            </>
          }
        >
          <ScrollArea className={styles.listScroll}>
            <div className={styles.listInner}>
              {filteredThreads.length === 0 ? (
                <EmptyState
                  icon={<Icon name="inbox" size={20} />}
                  title={searchQuery.trim() ? "No mail found" : "Inbox is empty"}
                  description={
                    searchQuery.trim()
                      ? "Try a different sender, subject, or preview."
                      : "Messages matching this filter will appear here."
                  }
                />
              ) : (
                filteredThreads.map((thread) => (
                  <MailListItem
                    key={thread.id}
                    thread={thread}
                    active={thread.id === activeThreadId}
                    onClick={() => onSelectThread(thread.id)}
                    onToggleStar={() => onToggleStar?.(thread.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </ListPane>
      </ResizablePane>
      <div className={styles.detail}>
        <ReadingPane subject={activeSubject} messages={activeMessages} replyBar={replyBar} />
      </div>
    </div>
  );
}
