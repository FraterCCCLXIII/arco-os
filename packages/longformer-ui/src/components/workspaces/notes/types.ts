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
