import { useEffect, useRef, type ReactNode } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import type { MenuItemDescriptor } from "../../primitives/Menu";
import type { TabItem } from "../../primitives/Tabs";
import { Composer } from "./Composer";
import { MessageBubble } from "./MessageBubble";
import { PromptChips } from "./PromptChips";
import { ConversationTabBar, type ConversationTabItem } from "./ConversationTabBar";
import type { UsageStats } from "./UsagePopover";
import type { ChatMessage, PromptChipItem } from "./types";
import styles from "./ChatWorkspace.module.css";

export interface ChatWorkspaceProps {
  messages: ChatMessage[];
  composerValue: string;
  onComposerChange: (value: string) => void;
  onSubmit: () => void;
  tabs?: ConversationTabItem[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  onTabClose?: (id: string) => void;
  onTabHistory?: () => void;
  onTabMore?: () => void;
  onNewConversation?: () => void;
  projectLabel?: ReactNode;
  emptyStateHeading?: string;
  promptChips?: PromptChipItem[];
  onPromptChipSelect?: (item: PromptChipItem) => void;
  model?: string;
  modelOptions?: MenuItemDescriptor[];
  usage?: UsageStats;
  thinkingLevel?: string;
  onPlanUsageClick?: () => void;
  disabled?: boolean;
  navItems?: TabItem[];
  activeNavId?: string;
  onNavChange?: (id: string) => void;
}

/**
 * Chat workspace: shows a centered prompt + suggestion chips when there is
 * no conversation yet, otherwise a scrollable transcript pinned above a
 * persistent composer — the pattern shared by OpenHands/Codex/Cursor.
 */
export function ChatWorkspace({
  messages,
  composerValue,
  onComposerChange,
  onSubmit,
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onTabHistory,
  onTabMore,
  onNewConversation,
  projectLabel,
  emptyStateHeading = "What should we build?",
  promptChips,
  onPromptChipSelect,
  model,
  modelOptions,
  usage,
  thinkingLevel,
  onPlanUsageClick,
  disabled = false,
  navItems,
  activeNavId,
  onNavChange,
}: ChatWorkspaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasTabBar = tabs && tabs.length > 0 && activeTabId && onTabChange;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const composerModeProps =
    navItems && activeNavId && onNavChange
      ? { navItems, activeNavId, onNavChange }
      : undefined;

  const tabBar = hasTabBar ? (
    <ConversationTabBar
      tabs={tabs}
      activeId={activeTabId}
      onSelect={onTabChange}
      projectLabel={projectLabel}
      onClose={onTabClose}
      onNewTab={onNewConversation}
      onHistory={onTabHistory}
      onMore={onTabMore}
    />
  ) : null;

  if (messages.length === 0) {
    return (
      <div className={styles.workspace}>
        {tabBar}
        <div className={styles.emptyState}>
          <div className={styles.emptyHeading}>{emptyStateHeading}</div>
          <div className={styles.emptyBody}>
            <Composer
              value={composerValue}
              onChange={onComposerChange}
              onSubmit={onSubmit}
              disabled={disabled}
              model={model}
              modelOptions={modelOptions}
              usage={usage}
              thinkingLevel={thinkingLevel}
              onPlanUsageClick={onPlanUsageClick}
              {...composerModeProps}
            />
            {promptChips && promptChips.length > 0 && onPromptChipSelect && (
              <PromptChips items={promptChips} onSelect={onPromptChipSelect} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.workspace}>
      {tabBar}
      <ScrollArea ref={scrollRef} className={styles.messages}>
        <div className={styles.messagesInner}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
      <div className={styles.composerDock}>
        <div className={styles.composerDockInner}>
          <Composer
            value={composerValue}
            onChange={onComposerChange}
            onSubmit={onSubmit}
            disabled={disabled}
            model={model}
            modelOptions={modelOptions}
            usage={usage}
            thinkingLevel={thinkingLevel}
            onPlanUsageClick={onPlanUsageClick}
            {...composerModeProps}
          />
        </div>
      </div>
    </div>
  );
}
