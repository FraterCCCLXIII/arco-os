import { useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { ResizablePane } from "../../primitives/ResizablePane";
import styles from "./AppShell.tailwind";

export interface AppShellProps {
  /** Far-left icon rail for switching workspaces (e.g. <NavRail />). */
  rail?: ReactNode;
  /** When true the rail column can be drag-resized (e.g. expanded NavRail). */
  railResizable?: boolean;
  railWidth?: number;
  defaultRailWidth?: number;
  onRailWidthChange?: (width: number) => void;
  /** Contextual nav sidebar for the active workspace (e.g. <NavSidebar />). */
  sidebar?: ReactNode;
  sidebarCollapsed?: boolean;
  sidebarWidth?: number;
  defaultSidebarWidth?: number;
  onSidebarWidthChange?: (width: number) => void;
  /** The active workspace's primary content. */
  main: ReactNode;
  /** Optional right-hand context panel (diff/environment, detail, composer, etc). */
  contextPanel?: ReactNode;
  contextPanelCollapsed?: boolean;
  contextPanelWidth?: number;
  defaultContextPanelWidth?: number;
  onContextPanelWidthChange?: (width: number) => void;
  contextPanelMaxWidth?: number;
  className?: string;
}

/**
 * The reusable rail | sidebar | main | context-panel frame every reference
 * app in this kit shares. Individual workspaces only ever fill in `main`
 * (and optionally `sidebar` / `contextPanel`) — the shell itself never
 * changes shape when switching workspaces.
 */
export function AppShell({
  rail,
  railResizable = false,
  railWidth,
  defaultRailWidth = 208,
  onRailWidthChange,
  sidebar,
  sidebarCollapsed = false,
  sidebarWidth,
  defaultSidebarWidth = 260,
  onSidebarWidthChange,
  main,
  contextPanel,
  contextPanelCollapsed = false,
  contextPanelWidth,
  defaultContextPanelWidth = 320,
  onContextPanelWidthChange,
  contextPanelMaxWidth = 560,
  className,
}: AppShellProps) {
  const [sidebarWidthState, setSidebarWidthState] = useState(defaultSidebarWidth);
  const [contextPanelWidthState, setContextPanelWidthState] = useState(defaultContextPanelWidth);
  const [railWidthState, setRailWidthState] = useState(defaultRailWidth);

  const resolvedSidebarWidth = sidebarWidth ?? sidebarWidthState;
  const resolvedContextPanelWidth = contextPanelWidth ?? contextPanelWidthState;
  const resolvedRailWidth = railWidth ?? railWidthState;

  return (
    <div className={cx(styles.shell, className)}>
      {rail &&
        (railResizable ? (
          <ResizablePane
            width={resolvedRailWidth}
            onWidthChange={onRailWidthChange ?? setRailWidthState}
            defaultWidth={defaultRailWidth}
            minWidth={56}
            maxWidth={280}
            handleSide="right"
            className={styles.railResizable}
            paneClassName={styles.rail}
            handleLabel="Resize navigation rail"
          >
            {rail}
          </ResizablePane>
        ) : (
          <div className={styles.rail}>{rail}</div>
        ))}
      {sidebar && (
        <ResizablePane
          width={resolvedSidebarWidth}
          onWidthChange={onSidebarWidthChange ?? setSidebarWidthState}
          defaultWidth={defaultSidebarWidth}
          minWidth={200}
          maxWidth={480}
          handleSide="right"
          collapsed={sidebarCollapsed}
          className={styles.sidebarResizable}
          paneClassName={styles.sidebar}
          handleLabel="Resize sidebar"
        >
          {sidebar}
        </ResizablePane>
      )}
      <div className={styles.main}>{main}</div>
      {contextPanel && (
        <ResizablePane
          width={resolvedContextPanelWidth}
          onWidthChange={onContextPanelWidthChange ?? setContextPanelWidthState}
          defaultWidth={defaultContextPanelWidth}
          minWidth={240}
          maxWidth={contextPanelMaxWidth}
          handleSide="left"
          collapsed={contextPanelCollapsed}
          clipOverflow={false}
          className={styles.contextPanelResizable}
          paneClassName={styles.contextPanel}
          handleLabel="Resize panel"
        >
          {contextPanel}
        </ResizablePane>
      )}
    </div>
  );
}
