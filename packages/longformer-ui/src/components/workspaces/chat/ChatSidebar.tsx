import { useMemo, useState } from "react";
import {
  NavSidebar,
  NavSidebarGroupedItems,
  NavSidebarSectionFilter,
  SidebarUserFooter,
  type NavSidebarListItem,
} from "../../shell/NavSidebar";

export type ChatSidebarListView = "recent" | "grouped";

export interface ChatConversationNavItem {
  id: string;
  label: string;
  meta?: string;
  project?: string;
}

export interface ChatSidebarProps {
  conversations: ChatConversationNavItem[];
  activeConversationId: string;
  onConversationSelect: (id: string) => void;
  openConversationIds: string[];
  onNewChat?: () => void;
  footerName: string;
  footerMeta?: string;
}

const LIST_VIEW_OPTIONS = [
  { id: "recent", label: "Recent" },
  { id: "grouped", label: "Grouped" },
] as const satisfies { id: ChatSidebarListView; label: string }[];

function buildConversationItem(
  conversation: ChatConversationNavItem,
  activeConversationId: string,
  openConversationIds: Set<string>,
  onConversationSelect: (id: string) => void,
): NavSidebarListItem {
  return {
    id: conversation.id,
    label: conversation.label,
    trailing: conversation.meta,
    active: conversation.id === activeConversationId,
    onClick: openConversationIds.has(conversation.id) ? () => onConversationSelect(conversation.id) : undefined,
  };
}

/** Chat workspace sidebar with Recent and project-grouped conversation lists. */
export function ChatSidebar({
  conversations,
  activeConversationId,
  onConversationSelect,
  openConversationIds: openConversationIdsProp,
  onNewChat,
  footerName,
  footerMeta,
}: ChatSidebarProps) {
  const [listView, setListView] = useState<ChatSidebarListView>("recent");
  const openConversationIds = useMemo(() => new Set(openConversationIdsProp), [openConversationIdsProp]);

  const recentItems = useMemo(
    () =>
      conversations.map((conversation) =>
        buildConversationItem(conversation, activeConversationId, openConversationIds, onConversationSelect),
      ),
    [activeConversationId, conversations, onConversationSelect, openConversationIds],
  );

  const groupedItems = useMemo(() => {
    const groups = new Map<string, ChatConversationNavItem[]>();

    for (const conversation of conversations) {
      const project = conversation.project ?? "Other";
      const bucket = groups.get(project);
      if (bucket) bucket.push(conversation);
      else groups.set(project, [conversation]);
    }

    return Array.from(groups.entries()).map(([project, items]) => ({
      id: project,
      label: project,
      icon: "folder" as const,
      items: items.map((conversation) =>
        buildConversationItem(conversation, activeConversationId, openConversationIds, onConversationSelect),
      ),
    }));
  }, [activeConversationId, conversations, onConversationSelect, openConversationIds]);

  return (
    <NavSidebar
      primaryAction={{ label: "New chat", icon: "plus", onClick: onNewChat }}
      quickLinks={[
        { id: "search", label: "Search", icon: "search" },
        { id: "scheduled", label: "Scheduled", icon: "calendar" },
        { id: "plugins", label: "Plugins", icon: "grid" },
      ]}
      sections={[
        {
          id: "conversations",
          title: "Conversations",
          action: (
            <NavSidebarSectionFilter
              value={listView}
              options={LIST_VIEW_OPTIONS}
              onChange={(next) => setListView(next as ChatSidebarListView)}
              aria-label="Conversation list view"
            />
          ),
          items: listView === "recent" ? recentItems : undefined,
          content: listView === "grouped" ? <NavSidebarGroupedItems groups={groupedItems} /> : undefined,
        },
      ]}
      footer={<SidebarUserFooter name={footerName} meta={footerMeta} />}
    />
  );
}
