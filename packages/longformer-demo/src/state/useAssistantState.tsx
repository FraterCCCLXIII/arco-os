/**
 * Assistant panel state — the contextual AI conversation shown in the right
 * context panel and the floating chat bubble. Mirrors the chat slice's tab
 * model but stays independent: the assistant is a separate surface over the
 * same (future) agent session, per spec D6's one-session-many-surfaces rule.
 */
import { useCallback, useMemo, useState } from "react";
import {
  ChatInlineSurface,
  chatMessageText,
  type ChatMessage,
  type ComposerTypeaheadItem,
  type PromptChipItem,
} from "longformer-ui";
import { generateSurface } from "../agent/generateSurface";
import {
  assistantConversationNavItems,
  assistantConversationTabs,
  assistantPromptChips,
} from "../mock-data/chat";

export function useAssistantState() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantTabs, setAssistantTabs] = useState(() => [...assistantConversationTabs]);
  const [activeAssistantTabId, setActiveAssistantTabId] = useState(assistantConversationTabs[2].id);
  const [assistantTabMessages, setAssistantTabMessages] = useState<Record<string, ChatMessage[]>>(
    () => Object.fromEntries(assistantConversationTabs.map((tab) => [tab.id, []])),
  );
  const [assistantComposerValue, setAssistantComposerValue] = useState("");
  const [assistantNavId, setAssistantNavId] = useState(assistantConversationNavItems[0].id);

  const handleAssistantMessageCopy = useCallback((message: ChatMessage) => {
    const text = chatMessageText(message);
    if (text) void navigator.clipboard?.writeText(text);
  }, []);

  const handleAssistantMessageEdit = useCallback((message: ChatMessage) => {
    setAssistantComposerValue(chatMessageText(message));
  }, []);

  /** Truncate the conversation back to this message (restore checkpoint). */
  const handleAssistantMessageRestore = useCallback(
    (message: ChatMessage) => {
      setAssistantTabMessages((prev) => {
        const messages = prev[activeAssistantTabId] ?? [];
        const index = messages.findIndex((item) => item.id === message.id);
        if (index === -1) return prev;
        return { ...prev, [activeAssistantTabId]: messages.slice(0, index + 1) };
      });
    },
    [activeAssistantTabId],
  );

  const handleAssistantAgentMessageCopy = handleAssistantMessageCopy;

  const handleAssistantAgentRegenerate = useCallback(
    (message: ChatMessage) => {
      setAssistantTabMessages((prev) => {
        const messages = prev[activeAssistantTabId] ?? [];
        const index = messages.findIndex((item) => item.id === message.id);
        if (index === -1) return prev;
        return { ...prev, [activeAssistantTabId]: messages.slice(0, index) };
      });
    },
    [activeAssistantTabId],
  );

  const handleAssistantAgentFeedback = useCallback(
    (message: ChatMessage, feedback: "up" | "down") => {
      setAssistantTabMessages((prev) => ({
        ...prev,
        [activeAssistantTabId]: (prev[activeAssistantTabId] ?? []).map((item) =>
          item.id === message.id
            ? { ...item, feedback: item.feedback === feedback ? undefined : feedback }
            : item,
        ),
      }));
    },
    [activeAssistantTabId],
  );

  const handleAssistantAgentShare = handleAssistantMessageCopy;

  /** Fork into a new assistant tab with history up to this message. */
  const handleAssistantAgentFork = useCallback(
    (message: ChatMessage) => {
      const id = `assistant-tab-${Date.now()}`;
      const messages = assistantTabMessages[activeAssistantTabId] ?? [];
      const index = messages.findIndex((item) => item.id === message.id);
      const forked = index === -1 ? messages : messages.slice(0, index + 1);
      setAssistantTabs((prev) => [
        ...prev,
        { id, label: "Forked conversation", icon: "sparkles" as const, closable: true },
      ]);
      setAssistantTabMessages((prev) => ({ ...prev, [id]: forked }));
      setActiveAssistantTabId(id);
    },
    [assistantTabMessages, activeAssistantTabId],
  );

  const handleAssistantTypeaheadSelect = useCallback((item: ComposerTypeaheadItem) => {
    setAssistantComposerValue(item.text);
  }, []);

  /**
   * Send composer text through the same generative-UI loop the main chat
   * uses — one agent contract, two surfaces (spec D6).
   */
  const handleAssistantSubmit = useCallback(() => {
    const prompt = assistantComposerValue.trim();
    if (!prompt) return;
    const tabId = activeAssistantTabId;
    const stamp = Date.now();
    const pendingId = `aa-${stamp}`;
    const userMessage: ChatMessage = {
      id: `au-${stamp}`,
      role: "user",
      content: prompt,
      timestamp: "Just now",
    };
    const pendingMessage: ChatMessage = {
      id: pendingId,
      role: "agent",
      content: "Designing a surface for that…",
      timestamp: "Just now",
    };
    setAssistantTabMessages((prev) => ({
      ...prev,
      [tabId]: [...(prev[tabId] ?? []), userMessage, pendingMessage],
    }));
    setAssistantComposerValue("");

    void generateSurface(prompt).then((result) => {
      const reply: ChatMessage = {
        id: pendingId,
        role: "agent",
        content: (
          <>
            <p>{result.summary}</p>
            {result.surface && result.surface.blocks.length > 0 && (
              <ChatInlineSurface
                label={result.engine === "llm" ? "Generated UI" : "Generated UI · local engine"}
                schema={result.surface}
              />
            )}
          </>
        ),
        timestamp: "Just now",
      };
      setAssistantTabMessages((prev) => ({
        ...prev,
        [tabId]: (prev[tabId] ?? []).map((message) => (message.id === pendingId ? reply : message)),
      }));
    });
  }, [assistantComposerValue, activeAssistantTabId]);

  const handleAssistantNewTab = useCallback(() => {
    const id = `assistant-tab-${Date.now()}`;
    setAssistantTabs((prev) => [...prev, { id, label: "New conversation", icon: "sparkles", closable: true }]);
    setAssistantTabMessages((prev) => ({ ...prev, [id]: [] }));
    setActiveAssistantTabId(id);
  }, []);

  const handleAssistantTabClose = useCallback(
    (id: string) => {
      setAssistantTabs((prev) => {
        const next = prev.filter((tab) => tab.id !== id);
        if (next.length === 0) return prev;
        if (activeAssistantTabId === id) {
          setActiveAssistantTabId(next[next.length - 1].id);
        }
        return next;
      });
      setAssistantTabMessages((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [activeAssistantTabId],
  );

  const handleAssistantPromptChip = useCallback((item: PromptChipItem) => {
    setAssistantComposerValue(item.label);
  }, []);

  // Menu for the hover assistant bubble: new conversation + prompt shortcuts.
  const assistantMenuItems = useMemo(
    () => [
      {
        id: "new-conversation",
        label: "New conversation",
        icon: "plus" as const,
        onSelect: handleAssistantNewTab,
      },
      ...assistantPromptChips.map((chip, index) => ({
        id: chip.id,
        label: chip.label,
        icon: chip.icon,
        separatorAbove: index === 0,
        onSelect: () => handleAssistantPromptChip(chip),
      })),
    ],
    [handleAssistantNewTab, handleAssistantPromptChip],
  );

  return useMemo(
    () => ({
      assistantOpen,
      setAssistantOpen,
      assistantTabs,
      activeAssistantTabId,
      setActiveAssistantTabId,
      assistantMessages: assistantTabMessages[activeAssistantTabId] ?? [],
      assistantComposerValue,
      setAssistantComposerValue,
      assistantNavId,
      setAssistantNavId,
      assistantNavItems: assistantConversationNavItems,
      assistantPromptChips,
      assistantMenuItems,
      handleAssistantSubmit,
      handleAssistantNewTab,
      handleAssistantTabClose,
      handleAssistantPromptChip,
      handleAssistantMessageCopy,
      handleAssistantMessageEdit,
      handleAssistantMessageRestore,
      handleAssistantAgentMessageCopy,
      handleAssistantAgentRegenerate,
      handleAssistantAgentFeedback,
      handleAssistantAgentShare,
      handleAssistantAgentFork,
      handleAssistantTypeaheadSelect,
    }),
    [
      assistantOpen,
      assistantTabs,
      activeAssistantTabId,
      assistantTabMessages,
      assistantComposerValue,
      assistantNavId,
      assistantMenuItems,
      handleAssistantSubmit,
      handleAssistantNewTab,
      handleAssistantTabClose,
      handleAssistantPromptChip,
      handleAssistantMessageCopy,
      handleAssistantMessageEdit,
      handleAssistantMessageRestore,
      handleAssistantAgentMessageCopy,
      handleAssistantAgentRegenerate,
      handleAssistantAgentFeedback,
      handleAssistantAgentShare,
      handleAssistantAgentFork,
      handleAssistantTypeaheadSelect,
    ],
  );
}

export type AssistantSlice = ReturnType<typeof useAssistantState>;
