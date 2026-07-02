import type { ReactNode } from "react";
import type { IconName } from "../../../icons";

export interface DocListItem {
  id: string;
  text: ReactNode;
  children?: DocListItem[];
}

export type DocBlockNode =
  | { id: string; type: "heading"; level: 1 | 2 | 3; text: string }
  | { id: string; type: "paragraph"; text: ReactNode }
  | { id: string; type: "bulletList"; items: DocListItem[] }
  | { id: string; type: "numberedList"; items: DocListItem[] }
  | { id: string; type: "flowSteps"; steps: string[] }
  | { id: string; type: "callout"; icon?: IconName; text: ReactNode };

/** A single note page in the vault. */
export interface NotePage {
  id: string;
  title: string;
  tags?: string[];
  folder?: "ideas" | "references" | "daily" | "projects" | "meta" | "clippings";
  blocks: DocBlockNode[];
  /** Explicit outbound links to other note IDs. */
  links?: string[];
}

export interface NotesGraphNode {
  id: string;
  label: string;
  tags?: string[];
  connections: number;
  x: number;
  y: number;
}

export interface NotesGraphEdge {
  id: string;
  from: string;
  to: string;
}

export type NotesView = "editor" | "graph";
