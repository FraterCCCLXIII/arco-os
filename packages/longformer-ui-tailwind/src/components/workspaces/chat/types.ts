import type { ReactNode } from "react";

export interface ChatThinkingStep {
  id: string;
  text: ReactNode;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: ReactNode;
  timestamp?: string;
  /** User feedback on an agent reply. */
  feedback?: "up" | "down";
  /** Collapsible "Thinking" / tool-call trace rendered above the content. */
  thinking?: {
    label?: string;
    steps: ChatThinkingStep[];
  };
}

/** Plain-text copy of a message when `content` is a string. */
export function chatMessageText(message: ChatMessage): string {
  return typeof message.content === "string" ? message.content : "";
}

export interface PromptChipItem {
  id: string;
  label: string;
  icon?: import("../../../icons").IconName;
}
