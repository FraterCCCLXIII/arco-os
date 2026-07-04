import { IconButton } from "../../primitives/IconButton";
import { Tabs, TabPanel } from "../../primitives/Tabs";
import { cx } from "../../../utils/cx";
import { ContextBrowserPane } from "./ContextBrowserPane";
import { ContextDiffPane, type DiffHunk } from "./ContextDiffPane";
import { ContextFilesPane } from "./ContextFilesPane";
import type { FileFolderNode } from "../files/types";
import styles from "./ChatContextDrawer.tailwind";

export type ChatContextDrawerTab = "browser" | "diffs" | "files";

export interface ChatContextDrawerProps {
  activeTab: ChatContextDrawerTab;
  onTabChange: (tab: ChatContextDrawerTab) => void;
  onClose?: () => void;
  /** When true, draws a left edge separator — omit when a resize grip sits beside the drawer. */
  showLeadingBorder?: boolean;
  diffHunks?: DiffHunk[];
  activeDiffId?: string;
  folders?: Record<string, FileFolderNode>;
  rootFolderId?: string;
}

const TAB_ITEMS: { id: ChatContextDrawerTab; label: string }[] = [
  { id: "browser", label: "Browser" },
  { id: "diffs", label: "Diffs" },
  { id: "files", label: "Files" },
];

/** Right-hand tool drawer for chat conversations — browser, diffs, and file editing. */
export function ChatContextDrawer({
  activeTab,
  onTabChange,
  onClose,
  showLeadingBorder = false,
  diffHunks = [],
  activeDiffId,
  folders,
  rootFolderId,
}: ChatContextDrawerProps) {
  return (
    <div className={cx(styles.drawer, showLeadingBorder && styles.drawerBordered)}>
      <div className={styles.header}>
        <Tabs
          items={TAB_ITEMS.map(({ id, label }) => ({ id, label }))}
          value={activeTab}
          onChange={(id) => onTabChange(id as ChatContextDrawerTab)}
          variant="underline"
          className={styles.tabs}
          aria-label="Context drawer"
        />
        {onClose && (
          <div className={styles.headerActions}>
            <IconButton icon="panel-right" label="Hide drawer" size="sm" onClick={onClose} />
          </div>
        )}
      </div>

      <div className={styles.body}>
        <TabPanel id="browser" active={activeTab === "browser"} className={styles.panel}>
          <ContextBrowserPane />
        </TabPanel>
        <TabPanel id="diffs" active={activeTab === "diffs"} className={styles.panel}>
          <ContextDiffPane hunks={diffHunks} activeHunkId={activeDiffId} />
        </TabPanel>
        <TabPanel id="files" active={activeTab === "files"} className={styles.panel}>
          {folders ? (
            <ContextFilesPane folders={folders} rootFolderId={rootFolderId} />
          ) : (
            <div className={styles.empty}>No files available in this workspace.</div>
          )}
        </TabPanel>
      </div>
    </div>
  );
}
