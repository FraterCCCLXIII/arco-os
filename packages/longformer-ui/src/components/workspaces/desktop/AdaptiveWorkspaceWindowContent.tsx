import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AdaptiveAppLayout } from "../app-port/AdaptiveAppLayout";
import {
  layoutModeForViewport,
  type AdaptiveMobilePane,
  type AdaptiveNavItem,
  type AppPortLayoutMode,
  type AppPortViewport,
} from "../app-port/types";
import { WorkspaceWindowShell } from "./WorkspaceWindowShell";
import type { IconName } from "../../../icons";
import styles from "./AdaptiveWorkspaceWindowContent.module.css";

export interface AdaptiveWorkspaceWindowContentProps {
  viewport: AppPortViewport;
  title: string;
  icon: IconName;
  sidebar?: ReactNode;
  main: ReactNode;
}

/**
 * Wraps a workspace view for desktop window rendering using App Port collapse rules:
 * expanded sidebar + list + detail on desktop, icon-rail split on tablet, stacked push on phone.
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

  if (!sidebar && (layoutMode === "stacked" || layoutMode === "watch")) {
    return (
      <WorkspaceWindowShell>
        <div ref={setContainerNode} className={styles.measure}>
          {main}
        </div>
      </WorkspaceWindowShell>
    );
  }

  if (!sidebar && layoutMode === "expanded" && effectiveViewport === "desktop") {
    return (
      <WorkspaceWindowShell>
        <div ref={setContainerNode} className={styles.measure}>
          {main}
        </div>
      </WorkspaceWindowShell>
    );
  }

  const list = sidebar ?? (
    <p className={styles.emptyList}>Open sections appear here when this app exposes a sidebar.</p>
  );

  const interactiveList =
    sidebar && layoutMode === "stacked" ? (
      <div
        className={styles.listInteractive}
        onClick={() => setMobilePane("detail")}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setMobilePane("detail");
        }}
      >
        {list}
      </div>
    ) : (
      list
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
          list={interactiveList}
          detailTitle={title}
          detail={main}
          mobilePane={sidebar ? mobilePane : "detail"}
          onMobilePaneChange={setMobilePane}
          className={styles.layout}
        />
      </div>
    </WorkspaceWindowShell>
  );
}
