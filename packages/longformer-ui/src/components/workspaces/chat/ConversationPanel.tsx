import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "../../../icons";
import { IconButton } from "../../primitives/IconButton";
import { ScrollArea } from "../../primitives/ScrollArea";
import type { MenuItemDescriptor } from "../../primitives/Menu";
import { cx } from "../../../utils/cx";
import { Composer } from "./Composer";
import { MessageBubble } from "./MessageBubble";
import { PromptChips } from "./PromptChips";
import type { ChatMessage, PromptChipItem } from "./types";
import { ConversationTabBar, type ConversationTabItem } from "./ConversationTabBar";
import styles from "./ConversationPanel.module.css";

export interface ConversationPanelProps {
  title?: ReactNode;
  tabs?: ConversationTabItem[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  onTabClose?: (id: string) => void;
  onTabHistory?: () => void;
  onTabMore?: () => void;
  messages: ChatMessage[];
  composerValue: string;
  onComposerChange: (value: string) => void;
  onSubmit: () => void;
  onClose?: () => void;
  onNewConversation?: () => void;
  emptyStateHeading?: string;
  promptChips?: PromptChipItem[];
  onPromptChipSelect?: (item: PromptChipItem) => void;
  model?: string;
  modelOptions?: MenuItemDescriptor[];
  disabled?: boolean;
  /** Drop header and panel background — for floating overlays without window chrome. */
  chromeless?: boolean;
  className?: string;
}

/**
 * A narrow, always-available AI conversation surface for the `AppShell`
 * context panel — the same message/composer building blocks as
 * `ChatWorkspace`, docked to the right so any workspace can "ask the agent"
 * without leaving the page.
 */
export function ConversationPanel({
  title = "Ask Longformer",
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onTabHistory,
  onTabMore,
  messages,
  composerValue,
  onComposerChange,
  onSubmit,
  onClose,
  onNewConversation,
  emptyStateHeading = "Ask about this workspace",
  promptChips,
  onPromptChipSelect,
  model,
  modelOptions,
  disabled = false,
  chromeless = false,
  className,
}: ConversationPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className={cx(styles.panel, chromeless && styles.panelChromeless, className)}>
      {!chromeless && tabs && tabs.length > 0 && activeTabId && onTabChange ? (
        <ConversationTabBar
          tabs={tabs}
          activeId={activeTabId}
          onSelect={onTabChange}
          onClose={onTabClose}
          onNewTab={onNewConversation}
          onHistory={onTabHistory}
          onMore={onTabMore}
          onClosePanel={onClose}
        />
      ) : !chromeless ? (
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Icon name="sparkles" size={14} />
            {title}
          </div>
          <div className={styles.headerActions}>
            {onNewConversation && (
              <IconButton icon="edit" label="New conversation" size="sm" onClick={onNewConversation} />
            )}
            {onClose && <IconButton icon="close" label="Close panel" size="sm" onClick={onClose} />}
          </div>
        </div>
      ) : null}

      {messages.length === 0 ? (
        <div className={styles.emptyState}>
          {emptyStateHeading ? <div className={styles.emptyHeading}>{emptyStateHeading}</div> : null}
          <div className={styles.emptyBody}>
            <Composer
              value={composerValue}
              onChange={onComposerChange}
              onSubmit={onSubmit}
              placeholder="Ask a question…"
              disabled={disabled}
              model={model}
              modelOptions={modelOptions}
              surfaceClassName={chromeless ? styles.composerChromeless : undefined}
            />
            {promptChips && promptChips.length > 0 && onPromptChipSelect && (
              <PromptChips items={promptChips} onSelect={onPromptChipSelect} />
            )}
          </div>
        </div>
      ) : (
        <>
          <ScrollArea ref={scrollRef} className={styles.messages}>
            <div className={styles.messagesInner}>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          </ScrollArea>
          <div className={styles.composerDock}>
            <Composer
              value={composerValue}
              onChange={onComposerChange}
              onSubmit={onSubmit}
              placeholder="Ask a question…"
              disabled={disabled}
              model={model}
              modelOptions={modelOptions}
              surfaceClassName={chromeless ? styles.composerChromeless : undefined}
            />
          </div>
        </>
      )}
    </div>
  );
}
