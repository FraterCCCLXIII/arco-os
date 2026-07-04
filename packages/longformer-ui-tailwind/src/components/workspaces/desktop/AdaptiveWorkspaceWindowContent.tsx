import { useEffect, useMemo, useState, type ReactNode } from "react";
import { IconButton } from "../../primitives/IconButton";
import { AdaptiveAppLayout } from "../app-port/AdaptiveAppLayout";
import {
  layoutModeForViewport,
  type AdaptiveMobilePane,
  type AdaptiveNavItem,
  type AppPortLayoutMode,
  type AppPortViewport,
} from "../app-port/types";
import { SidebarPane } from "../../shell/NavSidebar/SidebarPane";
import { WorkspaceWindowShell } from "./WorkspaceWindowShell";
import type { IconName } from "../../../icons";
import styles from "./AdaptiveWorkspaceWindowContent.tailwind";

export interface AdaptiveWorkspaceWindowContentProps {
  viewport: AppPortViewport;
  title: string;
  icon: IconName;
  sidebar?: ReactNode;
  main: ReactNode;
}

/**
 * Wraps a workspace view for desktop window rendering using App Port collapse rules.
 * When a native app sidebar is provided, it is rendered directly beside main content
 * instead of adding a redundant App Port navigation column.
 */
export function AdaptiveWorkspaceWindowContent({
  viewport,
  title,
  icon,
  sidebar,
  main,
}: AdaptiveWorkspaceWindowContentProps) {
  const [mobilePane, setMobilePane] = useState<AdaptiveMobilePane>("list");
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null);

  const navItems = useMemo<AdaptiveNavItem[]>(
    () => [{ id: "main", label: title, icon }],
    [icon, title],
  );

  const baseLayoutMode = layoutModeForViewport(viewport);
  const layoutMode = useMemo<AppPortLayoutMode>(() => {
    if (baseLayoutMode !== "expanded" || containerWidth <= 0) return baseLayoutMode;
    if (containerWidth < 560) return sidebar ? "stacked" : baseLayoutMode;
    if (containerWidth < 820) return "split";
    return "expanded";
  }, [baseLayoutMode, containerWidth, sidebar]);

  const effectiveViewport = useMemo<AppPortViewport>(() => {
    if (viewport !== "desktop" && viewport !== "modal") return viewport;
    switch (layoutMode) {
      case "stacked":
        return "phone";
      case "split":
        return "tablet";
      default:
        return viewport;
    }
  }, [layoutMode, viewport]);

  useEffect(() => {
    if (!containerNode) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setContainerWidth(width);
    });
    observer.observe(containerNode);
    return () => observer.disconnect();
  }, [containerNode]);

  useEffect(() => {
    if (layoutMode !== "stacked") {
      setMobilePane(sidebar ? "list" : "detail");
    }
  }, [layoutMode, sidebar]);

  if (sidebar) {
    return (
      <WorkspaceWindowShell>
        <div ref={setContainerNode} className={styles.adaptiveRoot}>
          {layoutMode === "stacked" ? (
            <div className={styles.stackedNative}>
              <header className={styles.stackedHeader} data-pane={mobilePane}>
                {mobilePane === "detail" ? (
                  <>
                    <IconButton
                      icon="chevron-left"
                      label="Back to sidebar"
                      onClick={() => setMobilePane("list")}
                      className={styles.stackedBack}
                    />
                    <h2 className={styles.stackedHeaderTitle}>{title}</h2>
                  </>
                ) : (
                  <>
                    <span className={styles.stackedTitle}>{title}</span>
                    <span className={styles.stackedSection}>{title}</span>
                  </>
                )}
              </header>
              <div className={styles.stackedMain}>
                {mobilePane === "list" ? (
                  <div
                    className={styles.stackedSidebar}
                    onClick={() => setMobilePane("detail")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") setMobilePane("detail");
                    }}
                  >
                    {sidebar}
                  </div>
                ) : (
                  <div className={styles.mainPane}>{main}</div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.nativeLayout}>
              <SidebarPane
                defaultWidth={layoutMode === "split" ? 240 : 260}
                minWidth={layoutMode === "split" ? 200 : 220}
                maxWidth={layoutMode === "split" ? 300 : 360}
                handleLabel="Resize sidebar"
                className={styles.sidebarResizable}
              >
                {sidebar}
              </SidebarPane>
              <div className={styles.mainPane}>{main}</div>
            </div>
          )}
        </div>
      </WorkspaceWindowShell>
    );
  }

  if (layoutMode === "stacked" || layoutMode === "watch") {
    return (
      <WorkspaceWindowShell>
        <div ref={setContainerNode} className={styles.measure}>
          {main}
        </div>
      </WorkspaceWindowShell>
    );
  }

  if (layoutMode === "expanded" && effectiveViewport === "desktop") {
    return (
      <WorkspaceWindowShell>
        <div ref={setContainerNode} className={styles.measure}>
          {main}
        </div>
      </WorkspaceWindowShell>
    );
  }

  const list = (
    <p className={styles.emptyList}>Open sections appear here when this app exposes a sidebar.</p>
  );

  return (
    <WorkspaceWindowShell>
      <div ref={setContainerNode} className={styles.adaptiveRoot}>
        <AdaptiveAppLayout
          viewport={effectiveViewport}
          title={title}
          navItems={navItems}
          activeNavId="main"
          onNavChange={() => setMobilePane("list")}
          listTitle={title}
          list={list}
          detailTitle={title}
          detail={main}
          mobilePane="detail"
          onMobilePaneChange={setMobilePane}
          className={styles.layout}
        />
      </div>
    </WorkspaceWindowShell>
  );
}
