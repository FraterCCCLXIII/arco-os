import type { IconName } from "../../../icons";

export type WireframeToolId =
  | "select"
  | "frame"
  | "rectangle"
  | "pen"
  | "text"
  | "component"
  | "hand"
  | "comment"
  | "code";

export interface WireframeTool {
  id: WireframeToolId;
  label: string;
  icon: IconName;
  shortcut?: string;
}

export interface WireframePage {
  id: string;
  label: string;
}

export interface WireframeLayer {
  id: string;
  label: string;
  kind: "frame" | "group" | "vector";
}

export interface WireframeRailItem {
  id: string;
  label: string;
  icon: IconName;
}

export interface WireframeTab {
  id: string;
  label: string;
}

export interface WireframeWorkspaceData {
  projectName: string;
  workspaceName: string;
  pages: WireframePage[];
  layers: WireframeLayer[];
  tabs: WireframeTab[];
}
