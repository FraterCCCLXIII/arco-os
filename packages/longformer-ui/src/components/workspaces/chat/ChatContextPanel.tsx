import { useEffect, useMemo, useState } from "react";
import { IconButton } from "../../primitives/IconButton";
import { ResizablePane } from "../../primitives/ResizablePane";
import { cx } from "../../../utils/cx";
import { ConversationPanel, type ConversationPanelProps } from "./ConversationPanel";
import { ChatContextDrawer, type ChatContextDrawerProps, type ChatContextDrawerTab } from "./ChatContextDrawer";
import styles from "./ChatContextPanel.module.css";

const DRAWER_TAB_ICONS: { id: ChatContextDrawerTab; label: string }[] = [
  { id: "browser", label: "Browser" },
  { id: "diffs", label: "Diffs" },
  { id: "files", label: "Files" },
];

const CONVERSATION_MIN_WIDTH = 240;
const DRAWER_MIN_WIDTH = 260;
const DRAWER_MAX_WIDTH = 560;

export interface ChatContextPanelProps extends ConversationPanelProps {
  /** When false, only the tool drawer is shown in the context panel. */
  showConversation?: boolean;
  drawerOpen?: boolean;
  onDrawerOpenChange?: (open: boolean) => void;
  drawerTab?: ChatContextDrawerTab;
  onDrawerTabChange?: (tab: ChatContextDrawerTab) => void;
  drawerWidth?: number;
  defaultDrawerWidth?: number;
  onDrawerWidthChange?: (width: number) => void;
  /** Total width of the AppShell context panel — used to clamp drawer resize. */
  contextPanelWidth?: number;
  diffHunks?: ChatContextDrawerProps["diffHunks"];
  activeDiffId?: string;
  folders?: ChatContextDrawerProps["folders"];
  rootFolderId?: string;
}

/**
 * Chat conversation surface with an optional right-hand tool drawer for
 * browser previews, diffs, and file editing — both columns share the
 * AppShell context panel slot.
 */
export function ChatContextPanel({
  showConversation = true,
  drawerOpen = true,
  onDrawerOpenChange,
  drawerTab: drawerTabProp,
  onDrawerTabChange,
  drawerWidth,
  defaultDrawerWidth = 340,
  onDrawerWidthChange,
  contextPanelWidth,
  diffHunks,
  activeDiffId,
  folders,
  rootFolderId,
  className,
  ...conversationProps
}: ChatContextPanelProps) {
  const [drawerTabState, setDrawerTabState] = useState<ChatContextDrawerTab>("browser");
  const [internalDrawerWidth, setInternalDrawerWidth] = useState(defaultDrawerWidth);
  const drawerTab = drawerTabProp ?? drawerTabState;
  const resolvedDrawerWidth = drawerWidth ?? internalDrawerWidth;

  const drawerMaxWidth = useMemo(() => {
    if (!showConversation || contextPanelWidth == null) return DRAWER_MAX_WIDTH;
    return Math.min(DRAWER_MAX_WIDTH, Math.max(DRAWER_MIN_WIDTH, contextPanelWidth - CONVERSATION_MIN_WIDTH));
  }, [contextPanelWidth, showConversation]);

  useEffect(() => {
    if (!showConversation) return;
    const clamped = Math.min(resolvedDrawerWidth, drawerMaxWidth);
    if (clamped === resolvedDrawerWidth) return;
    setDrawerWidth(clamped);
  }, [drawerMaxWidth, resolvedDrawerWidth, showConversation]);

  function setDrawerTab(tab: ChatContextDrawerTab) {
    if (onDrawerTabChange) onDrawerTabChange(tab);
    else setDrawerTabState(tab);
  }

  function setDrawerWidth(width: number) {
    if (onDrawerWidthChange) onDrawerWidthChange(width);
    else setInternalDrawerWidth(width);
  }

  const drawerProps: ChatContextDrawerProps = {
    activeTab: drawerTab,
    onTabChange: setDrawerTab,
    onClose: onDrawerOpenChange ? () => onDrawerOpenChange(false) : undefined,
    diffHunks,
    activeDiffId,
    folders,
    rootFolderId,
  };

  return (
    <div className={cx(styles.panel, !showConversation && styles.panelDrawerOnly)}>
      {showConversation && (
        <ConversationPanel {...conversationProps} className={className ?? styles.conversation} />
      )}

      {drawerOpen ? (
        showConversation ? (
          <ResizablePane
            width={resolvedDrawerWidth}
            defaultWidth={defaultDrawerWidth}
            onWidthChange={setDrawerWidth}
            minWidth={DRAWER_MIN_WIDTH}
            maxWidth={drawerMaxWidth}
            handleSide="left"
            className={styles.drawerResizable}
            paneClassName={styles.drawerPane}
            handleClassName={styles.drawerResizeHandle}
            handleLabel="Resize context drawer"
          >
            <ChatContextDrawer {...drawerProps} showLeadingBorder={false} />
          </ResizablePane>
        ) : (
          <div className={styles.drawerFull}>
            <ChatContextDrawer {...drawerProps} />
          </div>
        )
      ) : onDrawerOpenChange ? (
        <div className={styles.collapsedRail} aria-label="Context drawer">
          {DRAWER_TAB_ICONS.map((tab) => (
            <IconButton
              key={tab.id}
              icon={tab.id === "browser" ? "globe" : tab.id === "diffs" ? "layers" : "folder"}
              label={tab.label}
              size="sm"
              onClick={() => {
                setDrawerTab(tab.id);
                onDrawerOpenChange(true);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
