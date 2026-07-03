import type { ReactNode } from "react";
import { Icon } from "../../../icons";
import { IconButton } from "../../primitives/IconButton";
import { ListItem } from "../../primitives/ListItem";
import { ResizablePane } from "../../primitives/ResizablePane";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ListPane } from "../../shell/ListPane";
import { NavSidebar, NavSidebarSectionHeader } from "../../shell/NavSidebar/NavSidebar";
import { SidebarPane } from "../../shell/NavSidebar/SidebarPane";
import { cx } from "../../../utils/cx";
import { AdaptiveBottomNav } from "./AdaptiveBottomNav";
import { layoutModeForViewport, type AdaptiveListItem, type AdaptiveMobilePane, type AdaptiveNavItem, type AdaptiveWatchPane, type AppPortViewport } from "./types";
import { WatchAppChrome } from "./WatchAppChrome";
import styles from "./AdaptiveAppLayout.module.css";

export interface AdaptiveAppLayoutProps {
  viewport: AppPortViewport;
  title: string;
  navItems: AdaptiveNavItem[];
  activeNavId: string;
  onNavChange: (id: string) => void;
  listTitle: string;
  list: ReactNode;
  detailTitle?: string;
  detail: ReactNode;
  /** When set on stacked viewports, shows detail instead of list. */
  mobilePane?: AdaptiveMobilePane;
  onMobilePaneChange?: (pane: AdaptiveMobilePane) => void;
  /** Watch stack navigation and structured list data. */
  watchPane?: AdaptiveWatchPane;
  onWatchPaneChange?: (pane: AdaptiveWatchPane) => void;
  watchListItems?: AdaptiveListItem[];
  activeWatchItemId?: string | null;
  onWatchItemSelect?: (id: string) => void;
  watchSectionCounts?: Record<string, number>;
  className?: string;
}

/**
 * Responsive app chrome — sidebar + list + detail on desktop and modal, icon rail split
 * view on tablet, stacked push navigation on phone, and a stacked watch navigation flow.
 */
export function AdaptiveAppLayout({
  viewport,
  title,
  navItems,
  activeNavId,
  onNavChange,
  listTitle,
  list,
  detailTitle,
  detail,
  mobilePane = "list",
  onMobilePaneChange,
  watchPane = "sections",
  onWatchPaneChange,
  watchListItems = [],
  activeWatchItemId = null,
  onWatchItemSelect,
  watchSectionCounts,
  className,
}: AdaptiveAppLayoutProps) {
  const layoutMode = layoutModeForViewport(viewport);
  const activeNav = navItems.find((item) => item.id === activeNavId) ?? navItems[0];
  const isModal = viewport === "modal";

  function showList() {
    onMobilePaneChange?.("list");
  }

  const navSidebar = (
    <NavSidebar
      header={
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarIcon}>
            <Icon name="layers" size={16} />
          </span>
          <span className={styles.sidebarTitle}>{title}</span>
        </div>
      }
      quickLinks={navItems.map((item) => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        active: item.id === activeNavId,
        onClick: () => onNavChange(item.id),
      }))}
      sections={[
        {
          id: "views",
          title: "Views",
          items: navItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={15} />,
            active: item.id === activeNavId,
            onClick: () => onNavChange(item.id),
          })),
        },
      ]}
    />
  );

  const listPane = (
    <ListPane
      className={styles.listPane}
      title={
        <>
          <Icon name={activeNav?.icon ?? "layers"} size={16} />
          {listTitle}
        </>
      }
    >
      <ScrollArea className={styles.listScroll}>{list}</ScrollArea>
    </ListPane>
  );

  const detailPane = (
    <section className={styles.detailPane} aria-label={detailTitle ?? "Detail"}>
      {layoutMode !== "stacked" && detailTitle && (
        <header className={styles.detailHeaderStatic}>
          <h2 className={styles.detailTitle}>{detailTitle}</h2>
        </header>
      )}
      <ScrollArea className={styles.detailScroll}>{detail}</ScrollArea>
    </section>
  );

  if (layoutMode === "watch") {
    return (
      <WatchAppChrome
        appTitle={title}
        navItems={navItems}
        activeNavId={activeNavId}
        onNavChange={onNavChange}
        listItems={watchListItems}
        activeItemId={activeWatchItemId}
        onItemSelect={onWatchItemSelect ?? (() => undefined)}
        detailTitle={detailTitle}
        detail={detail}
        pane={watchPane}
        onPaneChange={onWatchPaneChange ?? (() => undefined)}
        sectionCounts={watchSectionCounts}
      />
    );
  }

  if (layoutMode === "stacked") {
    return (
      <div className={cx(styles.root, styles.stacked, className)} data-viewport={viewport}>
        <header className={styles.stackedHeader} data-pane={mobilePane}>
          {mobilePane === "detail" ? (
            <>
              <IconButton
                icon="chevron-left"
                label="Back to list"
                onClick={showList}
                className={styles.stackedBack}
              />
              <h2 className={styles.stackedHeaderTitle}>{detailTitle ?? "Details"}</h2>
            </>
          ) : (
            <>
              <span className={styles.stackedTitle}>{title}</span>
              <span className={styles.stackedSection}>{activeNav?.label}</span>
            </>
          )}
        </header>

        <div className={styles.stackedMain}>
          {mobilePane === "list" ? <div className={styles.stackedListWrap}>{listPane}</div> : detailPane}
        </div>

        <nav className={styles.bottomNavWrap} aria-label="App sections">
          <AdaptiveBottomNav
            items={navItems}
            activeId={activeNavId}
            onChange={onNavChange}
            onAfterChange={showList}
            variant="phone"
          />
        </nav>
      </div>
    );
  }

  if (layoutMode === "split") {
    return (
      <div className={cx(styles.root, styles.split, className)} data-viewport={viewport}>
        <nav className={styles.splitRail} aria-label="App sections">
          <div className={styles.splitRailTitle} title={title}>
            <Icon name="layers" size={16} />
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cx(styles.splitRailItem, item.id === activeNavId && styles.splitRailItemActive)}
              aria-current={item.id === activeNavId ? "page" : undefined}
              aria-label={item.label}
              title={item.label}
              onClick={() => onNavChange(item.id)}
            >
              <Icon name={item.icon} size={18} />
            </button>
          ))}
        </nav>

        <div className={styles.splitList}>{listPane}</div>
        {detailPane}
      </div>
    );
  }

  if (layoutMode === "expanded") {
    return (
      <div className={cx(styles.root, styles.expanded, isModal && styles.expandedModal, className)} data-viewport={viewport}>
        <SidebarPane
          defaultWidth={isModal ? 220 : 260}
          minWidth={isModal ? 200 : 220}
          maxWidth={isModal ? 280 : 360}
          handleLabel="Resize app navigation"
        >
          {navSidebar}
        </SidebarPane>

        <ResizablePane
          defaultWidth={isModal ? 280 : 320}
          minWidth={isModal ? 220 : 260}
          maxWidth={isModal ? 360 : 420}
          handleSide="right"
          className={styles.listResizable}
          handleLabel="Resize list pane"
        >
          {listPane}
        </ResizablePane>

        {detailPane}
      </div>
    );
  }

  return null;
}

/** Clickable list row helper for sample apps and demos. */
export function AdaptiveListRow({
  title,
  subtitle,
  meta,
  active,
  onClick,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <ListItem
      className={cx(styles.listRow, active && styles.listRowActive)}
      label={title}
      description={subtitle}
      trailing={meta}
      active={active}
      onClick={onClick}
    />
  );
}

export { NavSidebarSectionHeader };
