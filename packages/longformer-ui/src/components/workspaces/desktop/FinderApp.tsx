import { useState } from "react";
import { FilesWorkspace } from "../files/FilesWorkspace";
import type { FileItem } from "../files/types";
import type { BreadcrumbItem } from "../../shell/TopBar";

export interface FinderFolder {
  id: string;
  label: string;
  items: FileItem[];
}

export interface FinderAppProps {
  /** Folder graph keyed by id — `rootFolderId` is the starting point. */
  folders: Record<string, FinderFolder>;
  rootFolderId?: string;
}

/**
 * Real Finder-style window content: reuses the `FilesWorkspace` list view
 * (breadcrumb + sortable columns) with self-contained folder navigation, so
 * a desktop "Finder" window has actual file-browsing behavior instead of
 * static placeholder text.
 */
export function FinderApp({ folders, rootFolderId = "root" }: FinderAppProps) {
  const [path, setPath] = useState<string[]>([rootFolderId]);
  const [starred, setStarred] = useState<Set<string>>(
    () => new Set(Object.values(folders).flatMap((folder) => folder.items.filter((item) => item.starred).map((item) => item.id)))
  );

  const currentFolderId = path[path.length - 1];
  const currentFolder = folders[currentFolderId] ?? folders[rootFolderId];

  const breadcrumb: BreadcrumbItem[] = path.map((id, index) => ({
    label: folders[id]?.label ?? id,
    onClick: index < path.length - 1 ? () => setPath(path.slice(0, index + 1)) : undefined,
  }));

  function openFile(file: FileItem) {
    if (file.kind === "folder" && folders[file.id]) {
      setPath((prev) => [...prev, file.id]);
    }
  }

  function toggleStar(id: string) {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const files = currentFolder.items.map((file) => ({ ...file, starred: starred.has(file.id) }));

  return (
    <FilesWorkspace
      breadcrumb={breadcrumb}
      files={files}
      folders={folders}
      onOpenFile={openFile}
      onToggleStar={toggleStar}
    />
  );
}
