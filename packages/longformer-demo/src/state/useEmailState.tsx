/**
 * Email workspace state — thread selection, stars, compose, and sent-mail
 * simulation. Replies are stored per-thread and merged onto the static demo
 * threads at read time, so the mock fixtures stay immutable.
 *
 * A .tsx file because sent bodies are rendered as React nodes (rich HTML).
 */
import { useCallback, useMemo, useState } from "react";
import type { EmailDetailMessage, EmailDraft } from "longformer-ui";
import { primaryUser } from "../demo-personas";
import { threadMessages, threads } from "../mock-data/email";
import { mailFolders } from "../mock-data/sidebar";

export function useEmailState() {
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0].id);
  const [starred, setStarred] = useState<Set<string>>(
    () => new Set(threads.filter((t) => t.starred).map((t) => t.id)),
  );
  const [threadReplies, setThreadReplies] = useState<Record<string, EmailDetailMessage[]>>({});
  const [emailComposeOpen, setEmailComposeOpen] = useState(false);
  // Sent threads prepend to the demo threads; new sends land at the top.
  const [sentThreads, setSentThreads] = useState(threads);

  // The visible thread = static fixture + any replies added this session.
  // Threads created by "send" have no fixture, so replies are the whole body.
  const activeThread = useMemo(() => {
    const base = threadMessages[activeThreadId];
    const replies = threadReplies[activeThreadId] ?? [];
    if (base) {
      return {
        ...base,
        messages: [...base.messages, ...replies],
      };
    }
    if (replies.length > 0) {
      const thread = sentThreads.find((item) => item.id === activeThreadId);
      return {
        subject: thread?.subject ?? "Message",
        messages: replies,
      };
    }
    return undefined;
  }, [activeThreadId, threadReplies, sentThreads]);

  const handleSendEmailReply = useCallback(
    (content: { plain: string; html: string }) => {
      const reply: EmailDetailMessage = {
        id: `reply-${Date.now()}`,
        senderName: primaryUser.name,
        timestamp: "Just now",
        body: <div dangerouslySetInnerHTML={{ __html: content.html }} />,
      };
      setThreadReplies((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] ?? []), reply],
      }));
    },
    [activeThreadId],
  );

  /** Create a new "sent" thread from a compose draft and focus it. */
  const handleSendEmail = useCallback((draft: EmailDraft) => {
    const preview = draft.body.plain.slice(0, 80);
    const id = `sent-${Date.now()}`;
    setSentThreads((prev) => [
      {
        id,
        senderName: primaryUser.name,
        subject: draft.subject,
        preview: preview.length < draft.body.plain.length ? `${preview}…` : preview,
        timestamp: "Just now",
      },
      ...prev,
    ]);
    setActiveThreadId(id);
    setThreadReplies((prev) => ({
      ...prev,
      [id]: [
        {
          id: `${id}-m1`,
          senderName: primaryUser.name,
          timestamp: "Just now",
          body: <div dangerouslySetInnerHTML={{ __html: draft.body.html }} />,
        },
      ],
    }));
  }, []);

  return useMemo(
    () => ({
      threads: sentThreads,
      activeThreadId,
      setActiveThreadId,
      starred,
      setStarred,
      activeThread,
      emailComposeOpen,
      setEmailComposeOpen,
      handleSendEmailReply,
      handleSendEmail,
      mailFolders,
    }),
    [
      sentThreads,
      activeThreadId,
      starred,
      activeThread,
      emailComposeOpen,
      handleSendEmailReply,
      handleSendEmail,
    ],
  );
}

export type EmailSlice = ReturnType<typeof useEmailState>;
