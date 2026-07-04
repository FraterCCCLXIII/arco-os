import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ResizablePane } from "../../primitives/ResizablePane";
import { EmptyState } from "../../primitives/EmptyState";
import { cx } from "../../../utils/cx";
import type { FileFolderNode, FileItem } from "../files/types";
import { FILE_KIND_ICON } from "../files/types";
import styles from "./ContextFilesPane.tailwind";

export interface ContextFilesPaneProps {
  folders: Record<string, FileFolderNode>;
  rootFolderId?: string;
  treeWidth?: number;
  defaultTreeWidth?: number;
  onTreeWidthChange?: (width: number) => void;
}

interface TreeNode {
  id: string;
  name: string;
  kind: "folder" | "file";
  folderId?: string;
  file?: FileItem;
  children?: TreeNode[];
}

function buildTree(folders: Record<string, FileFolderNode>, folderId: string): TreeNode[] {
  const folder = folders[folderId];
  if (!folder) return [];

  return folder.items.map((item) => {
    if (item.kind === "folder" && folders[item.id]) {
      return {
        id: item.id,
        name: item.name,
        kind: "folder" as const,
        folderId: item.id,
        children: buildTree(folders, item.id),
      };
    }
    return {
      id: item.id,
      name: item.name,
      kind: "file" as const,
      file: item,
    };
  });
}

function findFileContent(folders: Record<string, FileFolderNode>, fileId: string): FileItem | null {
  for (const folder of Object.values(folders)) {
    const match = folder.items.find((item) => item.id === fileId);
    if (match && match.kind !== "folder") return match;
  }
  return null;
}

/** File tree on the left and a read-only editor on the right for agent file context. */
export function ContextFilesPane({
  folders,
  rootFolderId = "root",
  treeWidth,
  defaultTreeWidth = 168,
  onTreeWidthChange,
}: ContextFilesPaneProps) {
  const tree = useMemo(() => buildTree(folders, rootFolderId), [folders, rootFolderId]);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([rootFolderId, ...tree.filter((n) => n.kind === "folder").map((n) => n.id)]));
  const [selectedFileId, setSelectedFileId] = useState<string | null>("f3-1");

  const selectedFile = selectedFileId ? findFileContent(folders, selectedFileId) : null;
  const editorContent =
    selectedFile?.previewText ??
    (selectedFile
      ? `// ${selectedFile.name}\n// ${selectedFile.sizeLabel ?? "Unknown size"} · Modified ${selectedFile.modifiedLabel ?? "recently"}\n\n// Agent file preview — wire to your editor backend.`
      : "");

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderNode(node: TreeNode, depth = 0) {
    const isFolder = node.kind === "folder";
    const isExpanded = isFolder && expanded.has(node.id);
    const isSelected = !isFolder && node.id === selectedFileId;

    return (
      <div key={node.id}>
        <button
          type="button"
          className={cx(styles.treeRow, isSelected && styles.treeRowSelected)}
          style={{ paddingLeft: `calc(var(--lf-space-2) + ${depth} * 12px)` }}
          onClick={() => {
            if (isFolder) toggleExpanded(node.id);
            else setSelectedFileId(node.id);
          }}
        >
          {isFolder ? (
            <Icon name={isExpanded ? "chevron-down" : "chevron-right"} size={12} className={styles.treeChevron} />
          ) : (
            <span className={styles.treeChevronSpacer} aria-hidden="true" />
          )}
          <Icon name={isFolder ? "folder" : FILE_KIND_ICON[node.file?.kind ?? "other"]} size={13} />
          <span className={styles.treeLabel}>{node.name}</span>
        </button>
        {isFolder && isExpanded && node.children?.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  }

  const lines = editorContent.split("\n");

  return (
    <div className={styles.pane}>
      <ResizablePane
        width={treeWidth}
        defaultWidth={defaultTreeWidth}
        onWidthChange={onTreeWidthChange}
        minWidth={120}
        maxWidth={280}
        handleSide="right"
        className={styles.treeResizable}
        paneClassName={styles.treePane}
        handleLabel="Resize file tree"
      >
        <div className={styles.treeHeader}>Files</div>
        <ScrollArea className={styles.treeScroll}>{tree.map((node) => renderNode(node))}</ScrollArea>
      </ResizablePane>

      <div className={styles.editor}>
        {selectedFile ? (
          <>
            <div className={styles.editorHeader}>
              <Icon name={FILE_KIND_ICON[selectedFile.kind]} size={13} />
              <span className={styles.editorPath}>{selectedFile.name}</span>
            </div>
            <ScrollArea className={styles.editorScroll}>
              <pre className={styles.editorContent}>
                {lines.map((line, index) => (
                  <div key={index} className={styles.editorLine}>
                    <span className={styles.lineNumber}>{index + 1}</span>
                    <code>{line || " "}</code>
                  </div>
                ))}
              </pre>
            </ScrollArea>
          </>
        ) : (
          <EmptyState
            className={styles.editorEmpty}
            icon={<Icon name="file" size={20} />}
            title="No file selected"
            description="Choose a file from the tree to preview or edit."
          />
        )}
      </div>
    </div>
  );
}
