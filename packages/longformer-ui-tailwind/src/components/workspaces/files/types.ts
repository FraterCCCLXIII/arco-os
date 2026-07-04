import type { IconName } from "../../../icons";
import type { BadgeTone } from "../../primitives/Badge";

export type FileKind = "folder" | "doc" | "sheet" | "slides" | "pdf" | "image" | "video" | "code" | "archive" | "other";

export type FilesViewMode = "list" | "grid" | "gallery";

export type FilesLocation = "home" | "drive" | "recent" | "starred" | "trash";

export interface FileFolderNode {
  id: string;
  label: string;
  items: FileItem[];
}

export interface FileItem {
  id: string;
  name: string;
  kind: FileKind;
  /** Present on folders — number of items inside, shown instead of a size. */
  itemCount?: number;
  sizeLabel?: string;
  modifiedLabel?: string;
  owner?: { name: string; avatarSrc?: string };
  starred?: boolean;
  /** Optional preview body shown in the file viewer pane. */
  previewText?: string;
  previewImageSrc?: string;
}

export const FILE_KIND_ICON: Record<FileKind, IconName> = {
  folder: "folder",
  doc: "file",
  sheet: "grid",
  slides: "layers",
  pdf: "file",
  image: "image",
  video: "video",
  code: "code",
  archive: "archive",
  other: "file",
};

export const FILE_KIND_TONE: Record<FileKind, BadgeTone> = {
  folder: "neutral",
  doc: "accent",
  sheet: "success",
  slides: "warning",
  pdf: "danger",
  image: "accent",
  video: "accent",
  code: "neutral",
  archive: "neutral",
  other: "neutral",
};
