/**
 * Files workspace state — folder tree navigation via a breadcrumb path,
 * plus star/new-file actions applied to the current folder.
 *
 * The path is a stack of folder ids ("root" at the bottom); the current
 * folder is always the top of the stack, and breadcrumb clicks pop back.
 */
import { useCallback, useMemo, useState } from "react";
import type { FileItem } from "longformer-ui";
import { primaryUser } from "../demo-personas";
import { fileFolders } from "../mock-data/files";

export function useFilesState() {
  const [folders, setFolders] = useState(fileFolders);
  const [folderPath, setFolderPath] = useState<string[]>(["root"]);
  const currentFolderId = folderPath[folderPath.length - 1];
  const currentFolder = folders[currentFolderId];

  const handleOpenFile = useCallback(
    (file: FileItem) => {
      if (file.kind === "folder" && folders[file.id]) {
        setFolderPath((prev) => [...prev, file.id]);
      }
    },
    [folders],
  );

  const handleToggleStarFile = useCallback(
    (id: string) => {
      setFolders((prev) => ({
        ...prev,
        [currentFolderId]: {
          ...prev[currentFolderId],
          items: prev[currentFolderId].items.map((item) =>
            item.id === id ? { ...item, starred: !item.starred } : item,
          ),
        },
      }));
    },
    [currentFolderId],
  );

  const handleNewFile = useCallback(() => {
    const newFile: FileItem = {
      id: `new-${Date.now()}`,
      name: "Untitled document",
      kind: "doc",
      sizeLabel: "0 KB",
      owner: { name: primaryUser.name },
      modifiedLabel: "Just now",
    };
    setFolders((prev) => ({
      ...prev,
      [currentFolderId]: { ...prev[currentFolderId], items: [newFile, ...prev[currentFolderId].items] },
    }));
  }, [currentFolderId]);

  // Last crumb is the current folder, so it renders without an onClick.
  const filesBreadcrumb = useMemo(
    () =>
      folderPath.map((id, index) => ({
        label: folders[id]?.label ?? id,
        onClick:
          index < folderPath.length - 1
            ? () => setFolderPath(folderPath.slice(0, index + 1))
            : undefined,
      })),
    [folderPath, folders],
  );

  return useMemo(
    () => ({
      folders,
      currentFolder,
      filesBreadcrumb,
      handleOpenFile,
      handleToggleStarFile,
      handleNewFile,
    }),
    [folders, currentFolder, filesBreadcrumb, handleOpenFile, handleToggleStarFile, handleNewFile],
  );
}

export type FilesSlice = ReturnType<typeof useFilesState>;
