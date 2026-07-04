/**
 * Chat workspace state — conversation tabs, per-tab message history, the
 * composer, and every message-level action (copy, edit, fork, feedback…).
 *
 * This is the demo stand-in for the future agent session store: when the
 * OpenClaw gateway lands, `handleSubmit`'s fake reply is replaced by a real
 * stream while the rest of this slice's shape stays the same.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  chatMessageText,
  type ChatMessage,
  type ComposerTypeaheadItem,
} from "longformer-ui";
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

  /** Send the composer text, then simulate an agent reply after a short delay. */
  const handleSubmit = useCallback(() => {
    if (!composerValue.trim()) return;
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: composerValue,
      timestamp: "Just now",
    };
    setChatTabMessages((prev) => ({
      ...prev,
      [activeChatTabId]: [...(prev[activeChatTabId] ?? []), userMessage],
    }));
    setComposerValue("");
    setTimeout(() => {
      setChatTabMessages((prev) => ({
        ...prev,
        [activeChatTabId]: [
          ...(prev[activeChatTabId] ?? []),
          {
            id: `a-${Date.now()}`,
            role: "agent",
            content:
              "Got it — this is a static demo, so I can't actually run that yet, but here's where the reply would stream in.",
            timestamp: "Just now",
          },
        ],
      }));
    }, 400);
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

  const handleChatTabClose = useCallback(
    (id: string) => {
      setChatTabs((prev) => {
        const next = prev.filter((tab) => tab.id !== id);
        if (next.length === 0) return prev;
        if (activeChatTabId === id) {
          setActiveChatTabId(next[next.length - 1].id);
        }
        return next;
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
