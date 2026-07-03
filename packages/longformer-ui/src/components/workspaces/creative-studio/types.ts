import type { IconName } from "../../../icons";

export type StudioMode = "vector" | "raster" | "layout";

export type StudioToolId =
  | "select"
  | "node"
  | "pen"
  | "pencil"
  | "brush"
  | "rectangle"
  | "ellipse"
  | "text"
  | "eyedropper"
  | "fill"
  | "transparency"
  | "hand"
  | "eraser"
  | "clone"
  | "blur"
  | "frame"
  | "image-frame"
  | "margins";

export interface StudioTool {
  id: StudioToolId;
  label: string;
  icon: IconName;
  modes: StudioMode[];
}

export interface StudioModeDescriptor {
  id: StudioMode;
  label: string;
  icon: IconName;
}

export type StudioBottomPanel = "transform" | "navigator" | "history";
