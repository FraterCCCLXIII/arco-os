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
  /** Collapsible "Thinking" / tool-call trace rendered above the content. */
  thinking?: {
    label?: string;
    steps: ChatThinkingStep[];
  };
}

export interface PromptChipItem {
  id: string;
  label: string;
  icon?: import("../../../icons").IconName;
}
