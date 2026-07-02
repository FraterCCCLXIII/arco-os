import { useMemo, useState } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import type { BreadcrumbItem } from "../../shell/TopBar";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ResizablePane } from "../../primitives/ResizablePane";
import { SidebarPane } from "../../shell/NavSidebar";
import { EmptyState } from "../../primitives/EmptyState";
import { FilesSidebar } from "./FilesSidebar";
import { FilesToolbar } from "./FilesToolbar";
import { FileRow } from "./FileRow";
import { FileCard } from "./FileCard";
import { FilePreviewPane, FilePreviewEmpty } from "./FilePreviewPane";
import type { FileFolderNode, FileItem, FilesLocation, FilesViewMode } from "./types";
import styles from "./FilesWorkspace.module.css";

const LOCATION_LABELS: Record<FilesLocation, string> = {
  home: "Home",
  drive: "My Drive",
  recent: "Recent",
  starred: "Starred",
  trash: "Trash",
};

export interface FilesWorkspaceProps {
  breadcrumb: BreadcrumbItem[];
  files: FileItem[];
  onOpenFile: (file: FileItem) => void;
  onToggleStar?: (id: string) => void;
  onNewFile?: () => void;
  /** Optional folder graph for sidebar views like Recent and Starred. */
  folders?: Record<string, FileFolderNode>;
  location?: FilesLocation;
  onLocationChange?: (location: FilesLocation) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: FilesViewMode;
  onViewModeChange?: (mode: FilesViewMode) => void;
  selectedFileId?: string | null;
  onSelectFile?: (file: FileItem | null) => void;
  showSidebar?: boolean;
  showPreview?: boolean;
  previewPaneWidth?: number;
  defaultPreviewPaneWidth?: number;
  onPreviewPaneWidthChange?: (width: number) => void;
}

function flattenFiles(folders: Record<string, FileFolderNode>): FileItem[] {
  const seen = new Set<string>();
  const items: FileItem[] = [];
  for (const folder of Object.values(folders)) {
    for (const file of folder.items) {
      if (!seen.has(file.id)) {
        seen.add(file.id);
        items.push(file);
      }
    }
  }
  return items;
}

/** Drive + Finder file browser: left nav, search, view modes, list/grid, and a preview pane. */
export function FilesWorkspace({
  breadcrumb,
  files,
  onOpenFile,
  onToggleStar,
  onNewFile,
  folders,
  location: locationProp,
  onLocationChange,
  searchQuery: searchQueryProp,
  onSearchChange,
  viewMode: viewModeProp,
  onViewModeChange,
  selectedFileId: selectedFileIdProp,
  onSelectFile,
  showSidebar = true,
  showPreview = true,
  previewPaneWidth,
  defaultPreviewPaneWidth = 340,
  onPreviewPaneWidthChange,
}: FilesWorkspaceProps) {
  const [locationState, setLocationState] = useState<FilesLocation>("drive");
  const [searchState, setSearchState] = useState("");
  const [viewModeState, setViewModeState] = useState<FilesViewMode>("list");
  const [selectedFileIdState, setSelectedFileIdState] = useState<string | null>(null);

  const location = locationProp ?? locationState;
  const searchQuery = searchQueryProp ?? searchState;
  const viewMode = viewModeProp ?? viewModeState;
  const selectedFileId = selectedFileIdProp ?? selectedFileIdState;

  function setLocation(next: FilesLocation) {
    if (onLocationChange) onLocationChange(next);
    else setLocationState(next);
  }

  function setSearchQuery(next: string) {
    if (onSearchChange) onSearchChange(next);
    else setSearchState(next);
  }

  function setViewMode(next: FilesViewMode) {
    if (onViewModeChange) onViewModeChange(next);
    else setViewModeState(next);
  }

  function selectFile(file: FileItem | null) {
    if (onSelectFile) onSelectFile(file);
    else setSelectedFileIdState(file?.id ?? null);
  }

  const sourceFiles = useMemo(() => {
    if (location === "drive" || location === "home") return files;
    if (!folders) return [];
    const all = flattenFiles(folders);
    if (location === "starred") return all.filter((file) => file.starred);
    if (location === "recent") return [...all].sort((a, b) => (a.modifiedLabel ?? "").localeCompare(b.modifiedLabel ?? "")).slice(0, 12);
    return [];
  }, [location, files, folders]);

  const filteredFiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return sourceFiles;
    return sourceFiles.filter((file) => file.name.toLowerCase().includes(query) || file.kind.includes(query));
  }, [sourceFiles, searchQuery]);

  const selectedFile = useMemo(
    () => filteredFiles.find((file) => file.id === selectedFileId) ?? sourceFiles.find((file) => file.id === selectedFileId) ?? null,
    [filteredFiles, sourceFiles, selectedFileId],
  );

  const pageTitle = location === "drive" ? undefined : LOCATION_LABELS[location];
  const suggestedFolders = location === "home" ? files.filter((file) => file.kind === "folder") : [];

  const emptyCopy =
    location === "trash"
      ? { title: "Trash is empty", description: "Items you delete will appear here." }
      : location === "starred"
        ? { title: "No starred files", description: "Star files to find them quickly here." }
        : { title: "This folder is empty", description: "Files the agent creates or that you upload will show up here." };

  const previewFile = selectedFile && selectedFile.kind !== "folder" ? selectedFile : null;

  return (
    <div className={styles.workspace}>
      {showSidebar && (
        <SidebarPane handleLabel="Resize files sidebar" className={styles.sidebarResizable} defaultWidth={260} maxWidth={320}>
          <FilesSidebar location={location} onLocationChange={setLocation} onNewFile={onNewFile} />
        </SidebarPane>
      )}

      <div className={styles.browser}>
        <FilesToolbar
          title={pageTitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {location === "home" && suggestedFolders.length > 0 && (
          <section className={styles.homeSection}>
            <h3 className={styles.sectionHeading}>Suggested folders</h3>
            <div className={styles.homeFolders}>
              {suggestedFolders.map((folder) => (
                <FileCard
                  key={folder.id}
                  file={folder}
                  compact
                  onOpen={() => {
                    setLocation("drive");
                    onOpenFile(folder);
                  }}
                  onSelect={() => selectFile(folder)}
                />
              ))}
            </div>
          </section>
        )}

        {viewMode === "list" ? (
          <>
            <div className={styles.columnHeader}>
              <span className={styles.columnHeaderCell}>Name</span>
              <span className={cx(styles.columnHeaderCell, styles.columnHeaderOwner)}>Owner</span>
              <span className={cx(styles.columnHeaderCell, styles.columnHeaderModified)}>Last modified</span>
              <span className={cx(styles.columnHeaderCell, styles.columnHeaderSize)}>File size</span>
              <span aria-hidden="true" />
            </div>
            <ScrollArea className={styles.scroll}>
              {filteredFiles.length === 0 ? (
                <EmptyState
                  className={styles.empty}
                  icon={<Icon name="folder" size={22} />}
                  title={emptyCopy.title}
                  description={emptyCopy.description}
                />
              ) : (
                filteredFiles.map((file) => (
                  <FileRow
                    key={file.id}
                    file={file}
                    selected={file.id === selectedFileId}
                    onOpen={() => onOpenFile(file)}
                    onSelect={() => selectFile(file)}
                    onToggleStar={() => onToggleStar?.(file.id)}
                  />
                ))
              )}
            </ScrollArea>
          </>
        ) : (
          <ScrollArea className={cx(styles.scroll, styles.gridScroll)}>
            {filteredFiles.length === 0 ? (
              <EmptyState
                className={styles.empty}
                icon={<Icon name="folder" size={22} />}
                title={emptyCopy.title}
                description={emptyCopy.description}
              />
            ) : (
              <div className={cx(styles.grid, viewMode === "gallery" && styles.galleryGrid)}>
                {filteredFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    selected={file.id === selectedFileId}
                    compact={viewMode === "grid"}
                    onOpen={() => onOpenFile(file)}
                    onSelect={() => selectFile(file)}
                    onToggleStar={() => onToggleStar?.(file.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        )}

        {selectedFile && (
          <div className={styles.pathBar} aria-label="Selected item path">
            <Icon name="folder" size={13} />
            {breadcrumb.map((item) => item.label).join(" › ")}
            {breadcrumb.length > 0 && " › "}
            <Icon name={selectedFile.kind === "folder" ? "folder" : "file"} size={13} />
            {selectedFile.name}
          </div>
        )}
      </div>

      {showPreview && (
        <ResizablePane
          width={previewPaneWidth}
          defaultWidth={defaultPreviewPaneWidth}
          onWidthChange={onPreviewPaneWidthChange}
          minWidth={280}
          maxWidth={520}
          handleSide="left"
          className={styles.previewResizable}
          paneClassName={styles.previewPane}
          handleLabel="Resize file preview"
        >
          {previewFile ? (
            <FilePreviewPane
              file={previewFile}
              onClose={() => selectFile(null)}
              onOpen={() => onOpenFile(previewFile)}
            />
          ) : (
            <FilePreviewEmpty />
          )}
        </ResizablePane>
      )}
    </div>
  );
}
