/**
 * Chat workspace state — conversation tabs, per-tab message history, the
 * composer, and every message-level action (copy, edit, fork, feedback…).
 *
 * Submitting a prompt runs the real generative-UI loop: `generateSurface`
 * produces block JSON (LLM when configured, local composer otherwise), the
 * registry validates it, and the reply renders it inline. When the OpenClaw
 * gateway lands, only the engine behind `generateSurface` changes.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChatInlineSurface,
  chatMessageText,
  type ChatMessage,
  type ComposerTypeaheadItem,
} from "longformer-ui";
import { generateSurface } from "../agent/generateSurface";
import {
  chatConversationNavItems,
  chatConversationTabs,
  chatTabConversations,
  composerTypeaheadItems,
  demoUsage,
  promptChips,
} from "../mock-data/chat";
import { chatConversations } from "../mock-data/sidebar";

export function useChatState() {
  const [composerValue, setComposerValue] = useState("");
  const [chatTabs, setChatTabs] = useState(() => [...chatConversationTabs]);
  const [activeChatTabId, setActiveChatTabId] = useState(chatConversationTabs[0].id);
  const [chatTabMessages, setChatTabMessages] = useState<Record<string, ChatMessage[]>>(() => ({
    ...chatTabConversations,
  }));
  const [chatNavId, setChatNavId] = useState(chatConversationNavItems[0].id);

  // Re-seed demo conversations that were emptied by tab-close in a previous
  // session; runs once so user-created empty tabs aren't clobbered later.
  useEffect(() => {
    setChatTabMessages((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const [tabId, conversation] of Object.entries(chatTabConversations)) {
        if (!next[tabId]?.length) {
          next[tabId] = conversation;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  /**
   * Send the composer text, then run the generative-UI loop: a pending agent
   * message appears immediately and is swapped in place for the validated
   * generated surface once the engine responds.
   */
  const handleSubmit = useCallback(() => {
    const prompt = composerValue.trim();
    if (!prompt) return;
    const tabId = activeChatTabId;
    const stamp = Date.now();
    const pendingId = `a-${stamp}`;
    const userMessage: ChatMessage = {
      id: `u-${stamp}`,
      role: "user",
      content: prompt,
      timestamp: "Just now",
    };
    const pendingMessage: ChatMessage = {
      id: pendingId,
      role: "agent",
      content: "Researching and designing a surface for that…",
      timestamp: "Just now",
    };
    setChatTabMessages((prev) => ({
      ...prev,
      [tabId]: [...(prev[tabId] ?? []), userMessage, pendingMessage],
    }));
    setComposerValue("");

    void generateSurface(prompt).then((result) => {
      if (result.warnings.length) {
        console.warn("Some generated blocks were rejected by validation:", result.warnings);
      }
      const reply: ChatMessage = {
        id: pendingId,
        role: "agent",
        content: (
          <>
            {result.fallbackReason && (
              <p>
                <em>{result.fallbackReason} Showing the offline composer instead.</em>
              </p>
            )}
            <p>{result.summary}</p>
            {result.surface && result.surface.blocks.length > 0 && (
              <ChatInlineSurface
                label={[
                  "Generated UI",
                  result.engine === "llm" ? result.model : "local engine",
                  result.evidence ? "researched" : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
                schema={result.surface}
              />
            )}
            {result.evidence && (
              <p>
                <small>
                  Sources:{" "}
                  {result.evidence.sources.slice(0, 4).map((source, index) => (
                    <span key={source.url}>
                      {index > 0 && " · "}
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title}
                      </a>
                    </span>
                  ))}
                </small>
              </p>
            )}
          </>
        ),
        timestamp: "Just now",
      };
      setChatTabMessages((prev) => ({
        ...prev,
        [tabId]: (prev[tabId] ?? []).map((message) => (message.id === pendingId ? reply : message)),
      }));
    });
  }, [composerValue, activeChatTabId]);

  const handleChatMessageCopy = useCallback((message: ChatMessage) => {
    const text = chatMessageText(message);
    if (text) void navigator.clipboard?.writeText(text);
  }, []);

  const handleChatMessageEdit = useCallback((message: ChatMessage) => {
    setComposerValue(chatMessageText(message));
  }, []);

  /** "Restore checkpoint" — truncate the conversation back to this message. */
  const handleChatMessageRestore = useCallback(
    (message: ChatMessage) => {
      setChatTabMessages((prev) => {
        const messages = prev[activeChatTabId] ?? [];
        const index = messages.findIndex((item) => item.id === message.id);
        if (index === -1) return prev;
        return { ...prev, [activeChatTabId]: messages.slice(0, index + 1) };
      });
    },
    [activeChatTabId],
  );

  const handleChatAgentMessageCopy = handleChatMessageCopy;

  /** Regenerate — drop the agent message (and everything after) so it can re-run. */
  const handleChatAgentRegenerate = useCallback(
    (message: ChatMessage) => {
      setChatTabMessages((prev) => {
        const messages = prev[activeChatTabId] ?? [];
        const index = messages.findIndex((item) => item.id === message.id);
        if (index === -1) return prev;
        return { ...prev, [activeChatTabId]: messages.slice(0, index) };
      });
    },
    [activeChatTabId],
  );

  /** Toggle thumbs up/down; clicking the active choice clears it. */
  const handleChatAgentFeedback = useCallback(
    (message: ChatMessage, feedback: "up" | "down") => {
      setChatTabMessages((prev) => ({
        ...prev,
        [activeChatTabId]: (prev[activeChatTabId] ?? []).map((item) =>
          item.id === message.id
            ? { ...item, feedback: item.feedback === feedback ? undefined : feedback }
            : item,
        ),
      }));
    },
    [activeChatTabId],
  );

  const handleChatAgentShare = handleChatMessageCopy;

  /** Fork the conversation into a new tab, keeping history up to this message. */
  const handleChatAgentFork = useCallback(
    (message: ChatMessage) => {
      const id = `chat-tab-${Date.now()}`;
      const messages = chatTabMessages[activeChatTabId] ?? [];
      const index = messages.findIndex((item) => item.id === message.id);
      const forked = index === -1 ? messages : messages.slice(0, index + 1);
      setChatTabs((prev) => [
        ...prev,
        { id, label: "Forked conversation", icon: "sparkles" as const, closable: true },
      ]);
      setChatTabMessages((prev) => ({ ...prev, [id]: forked }));
      setActiveChatTabId(id);
    },
    [chatTabMessages, activeChatTabId],
  );

  const handleTypeaheadSelect = useCallback((item: ComposerTypeaheadItem) => {
    setComposerValue(item.text);
  }, []);

  const handleChatNewTab = useCallback(() => {
    const id = `chat-tab-${Date.now()}`;
    setChatTabs((prev) => [...prev, { id, label: "New conversation", icon: "sparkles", closable: true }]);
    setChatTabMessages((prev) => ({ ...prev, [id]: [] }));
    setActiveChatTabId(id);
  }, []);

  /**
   * Close a tab. Closing the last one swaps in a fresh empty conversation so
   * demo content can be fully cleared without stranding the workspace.
   */
  const handleChatTabClose = useCallback(
    (id: string) => {
      setChatTabs((prev) => {
        const remaining = prev.filter((tab) => tab.id !== id);
        if (remaining.length === 0) {
          const freshId = `chat-tab-${Date.now()}`;
          setChatTabMessages((messages) => ({ ...messages, [freshId]: [] }));
          setActiveChatTabId(freshId);
          return [{ id: freshId, label: "New conversation", icon: "sparkles" as const, closable: true }];
        }
        if (activeChatTabId === id) {
          setActiveChatTabId(remaining[remaining.length - 1].id);
        }
        return remaining;
      });
      setChatTabMessages((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [activeChatTabId],
  );

  // Slice keys match WorkspaceLayoutViewModel so App can spread this directly.
  return useMemo(
    () => ({
      messages: chatTabMessages[activeChatTabId] ?? [],
      composerValue,
      setComposerValue,
      handleSubmit,
      handleChatMessageCopy,
      handleChatMessageEdit,
      handleChatMessageRestore,
      handleChatAgentMessageCopy,
      handleChatAgentRegenerate,
      handleChatAgentFeedback,
      handleChatAgentShare,
      handleChatAgentFork,
      composerTypeaheadItems,
      handleTypeaheadSelect,
      promptChips,
      demoUsage,
      chatConversations,
      chatTabs,
      activeChatTabId,
      setActiveChatTabId,
      handleChatTabClose,
      handleChatNewTab,
      chatNavItems: chatConversationNavItems,
      chatNavId,
      setChatNavId,
    }),
    [
      chatTabMessages,
      activeChatTabId,
      composerValue,
      chatTabs,
      chatNavId,
      handleSubmit,
      handleChatMessageCopy,
      handleChatMessageEdit,
      handleChatMessageRestore,
      handleChatAgentMessageCopy,
      handleChatAgentRegenerate,
      handleChatAgentFeedback,
      handleChatAgentShare,
      handleChatAgentFork,
      handleTypeaheadSelect,
      handleChatTabClose,
      handleChatNewTab,
    ],
  );
}

export type ChatSlice = ReturnType<typeof useChatState>;
