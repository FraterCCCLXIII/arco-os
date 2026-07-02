import { useEffect, useRef } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import type { MenuItemDescriptor } from "../../primitives/Menu";
import { Composer } from "./Composer";
import { MessageBubble } from "./MessageBubble";
import { PromptChips } from "./PromptChips";
import type { UsageStats } from "./UsagePopover";
import type { ChatMessage, PromptChipItem } from "./types";
import styles from "./ChatWorkspace.module.css";

export interface ChatWorkspaceProps {
  messages: ChatMessage[];
  composerValue: string;
  onComposerChange: (value: string) => void;
  onSubmit: () => void;
  emptyStateHeading?: string;
  promptChips?: PromptChipItem[];
  onPromptChipSelect?: (item: PromptChipItem) => void;
  model?: string;
  modelOptions?: MenuItemDescriptor[];
  usage?: UsageStats;
  thinkingLevel?: string;
  onPlanUsageClick?: () => void;
  disabled?: boolean;
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
  emptyStateHeading = "What should we build?",
  promptChips,
  onPromptChipSelect,
  model,
  modelOptions,
  usage,
  thinkingLevel,
  onPlanUsageClick,
  disabled = false,
}: ChatWorkspaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className={styles.workspace}>
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
          />
        </div>
      </div>
    </div>
  );
}
