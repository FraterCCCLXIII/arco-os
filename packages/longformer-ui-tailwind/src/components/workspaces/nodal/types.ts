import type { IconName } from "../../../icons";

export type NodalNodeKind = "rectangle" | "circle" | "sticky" | "text";

export type NodalToolId =
  | "select"
  | "hand"
  | "pen"
  | "sticky"
  | "rectangle"
  | "circle"
  | "diamond"
  | "connector"
  | "text"
  | "table"
  | "stamp";

export interface NodalTool {
  id: NodalToolId;
  label: string;
  icon: IconName;
  accent?: string;
}

export interface NodalNode {
  id: string;
  kind: NodalNodeKind;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface NodalConnector {
  id: string;
  fromId: string;
  toId: string;
}

export interface NodalTab {
  id: string;
  label: string;
}

export interface NodalWorkspaceData {
  fileName: string;
  tabs: NodalTab[];
  nodes: NodalNode[];
  connectors: NodalConnector[];
}
