import type { ReactNode } from "react";

/** Seconds of reasoning — formats as "Thought briefly" or "Thought for Ns". */
export type AgentThoughtDuration = number | "brief";

export interface AgentActionBlockProps {
  /** Short description of the tool action, e.g. "List www package structure". */
  title: ReactNode;
  /** Optional command hint shown in monospace, e.g. "ls, head". */
  command?: string;
  /** Monospace output lines — string or pre-split array. */
  output: string | string[];
  /** Header icon; defaults to terminal. */
  icon?: import("../../../../icons").IconName;
  defaultOpen?: boolean;
  className?: string;
}

export interface AgentStatusLineProps {
  children: ReactNode;
  className?: string;
}

export type AgentTodoStatus = "active" | "pending" | "completed";

export interface AgentTodoItem {
  id: string;
  label: ReactNode;
  status: AgentTodoStatus;
}

export interface AgentTodoCardProps {
  items: AgentTodoItem[];
  className?: string;
}

export type AgentFileKind = "ts" | "tsx" | "css" | "other";

export interface AgentFileChipProps {
  path: string;
  kind?: AgentFileKind;
  onClick?: () => void;
  className?: string;
}

export type AgentFileCreationStatus = "done" | "in-progress";

export interface AgentCreatedFileItem {
  id: string;
  /** Human-readable description, e.g. "Example manifest: task list app". */
  label: ReactNode;
  /** Display filename shown in the monospace pill, e.g. "tasklist.json". */
  filename: string;
  /** Full path for title/tooltip when filename is a basename. */
  path?: string;
  onClick?: () => void;
}

export interface AgentFileCreationBlockProps {
  files: AgentCreatedFileItem[];
  /** Override header text; defaults to "Created N files". */
  title?: ReactNode;
  status?: AgentFileCreationStatus;
  defaultOpen?: boolean;
  className?: string;
}
