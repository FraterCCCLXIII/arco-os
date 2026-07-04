import type { ReactNode } from "react";
import { Icon } from "../../../icons";
import { ScrollArea } from "../../primitives/ScrollArea";
import { cx } from "../../../utils/cx";
import type { AdaptiveListItem, AdaptiveNavItem, AdaptiveWatchPane } from "./types";
import styles from "./WatchAppChrome.tailwind";

export interface WatchAppChromeProps {
  appTitle: string;
  navItems: AdaptiveNavItem[];
  activeNavId: string;
  onNavChange: (id: string) => void;
  listItems: AdaptiveListItem[];
  activeItemId: string | null;
  onItemSelect: (id: string) => void;
  detailTitle?: string;
  detail: ReactNode;
  pane: AdaptiveWatchPane;
  onPaneChange: (pane: AdaptiveWatchPane) => void;
  sectionCounts?: Record<string, number>;
}

function wrapIndex(index: number, length: number) {
  if (length === 0) return 0;
  return (index + length) % length;
}

/** watchOS-style stack navigation — sections hub, scrollable list, and detail screens. */
export function WatchAppChrome({
  appTitle,
  navItems,
  activeNavId,
  onNavChange,
  listItems,
  activeItemId,
  onItemSelect,
  detailTitle,
  detail,
  pane,
  onPaneChange,
  sectionCounts = {},
}: WatchAppChromeProps) {
  const activeNav = navItems.find((item) => item.id === activeNavId) ?? navItems[0];
  const activeNavIndex = Math.max(0, navItems.findIndex((item) => item.id === activeNavId));
  const activeItemIndex = Math.max(0, listItems.findIndex((item) => item.id === activeItemId));
  const activeItem = listItems[activeItemIndex];

  function openSection(navId: string) {
    onNavChange(navId);
    onPaneChange("list");
  }

  function openDetail(itemId: string) {
    onItemSelect(itemId);
    onPaneChange("detail");
  }

  function goBack() {
    if (pane === "detail") {
      onPaneChange("list");
      return;
    }
    if (pane === "list") {
      onPaneChange("sections");
    }
  }

  function stepSection(delta: number) {
    const next = navItems[wrapIndex(activeNavIndex + delta, navItems.length)];
    if (!next) return;
    onNavChange(next.id);
    onPaneChange("list");
  }

  function stepItem(delta: number) {
    const next = listItems[wrapIndex(activeItemIndex + delta, listItems.length)];
    if (!next) return;
    onItemSelect(next.id);
  }

  const headerTitle =
    pane === "sections" ? appTitle : pane === "list" ? activeNav?.label ?? "Items" : detailTitle ?? "Details";

  return (
    <div className={styles.root} data-watch-pane={pane}>
      <header className={styles.header}>
        {pane !== "sections" ? (
          <button type="button" className={styles.backButton} aria-label="Go back" onClick={goBack}>
            <Icon name="chevron-left" size={12} />
          </button>
        ) : (
          <span className={styles.appMark} aria-hidden="true">
            <Icon name="layers" size={12} />
          </span>
        )}
        <div className={styles.headerText}>
          <span className={styles.headerTitle}>{headerTitle}</span>
          {pane === "sections" && <span className={styles.headerMeta}>{navItems.length} views</span>}
          {pane === "list" && (
            <span className={styles.headerMeta}>
              {listItems.length} item{listItems.length === 1 ? "" : "s"}
            </span>
          )}
          {pane === "detail" && activeItem?.meta && <span className={styles.headerMeta}>{activeItem.meta}</span>}
        </div>
      </header>

      <ScrollArea className={styles.body}>
        {pane === "sections" && (
          <div className={styles.sectionList} role="list">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.sectionRow}
                onClick={() => openSection(item.id)}
              >
                <span className={styles.sectionIcon}>
                  <Icon name={item.icon} size={14} />
                </span>
                <span className={styles.sectionCopy}>
                  <span className={styles.sectionLabel}>{item.label}</span>
                  <span className={styles.sectionCount}>{sectionCounts[item.id] ?? 0} items</span>
                </span>
                <Icon name="chevron-right" size={12} />
              </button>
            ))}
          </div>
        )}

        {pane === "list" && (
          <div className={styles.itemList} role="list">
            {listItems.length === 0 ? (
              <p className={styles.emptyState}>No items in this view.</p>
            ) : (
              listItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cx(styles.itemRow, item.id === activeItemId && styles.itemRowActive)}
                  onClick={() => openDetail(item.id)}
                >
                  <span className={styles.itemCopy}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    {item.subtitle && <span className={styles.itemSubtitle}>{item.subtitle}</span>}
                  </span>
                  {item.meta && <span className={styles.itemMeta}>{item.meta}</span>}
                </button>
              ))
            )}
          </div>
        )}

        {pane === "detail" && <div className={styles.detailBody}>{detail}</div>}
      </ScrollArea>

      <footer className={styles.footer}>
        {pane === "sections" && (
          <div className={styles.footerDots} role="tablist" aria-label="App views">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className={cx(styles.footerDot, item.id === activeNavId && styles.footerDotActive)}
                aria-selected={item.id === activeNavId}
                aria-label={item.label}
                onClick={() => openSection(item.id)}
              />
            ))}
          </div>
        )}

        {pane === "list" && (
          <div className={styles.footerNav}>
            <button type="button" className={styles.footerNavButton} aria-label="Previous section" onClick={() => stepSection(-1)}>
              <Icon name="chevron-left" size={12} />
            </button>
            <span className={styles.footerNavLabel}>{activeNav?.label}</span>
            <button type="button" className={styles.footerNavButton} aria-label="Next section" onClick={() => stepSection(1)}>
              <Icon name="chevron-right" size={12} />
            </button>
          </div>
        )}

        {pane === "detail" && listItems.length > 1 && (
          <>
            <div className={styles.footerNav}>
              <button type="button" className={styles.footerNavButton} aria-label="Previous item" onClick={() => stepItem(-1)}>
                <Icon name="chevron-left" size={12} />
              </button>
              <span className={styles.footerNavLabel}>
                {activeItemIndex + 1} / {listItems.length}
              </span>
              <button type="button" className={styles.footerNavButton} aria-label="Next item" onClick={() => stepItem(1)}>
                <Icon name="chevron-right" size={12} />
              </button>
            </div>
            <button type="button" className={styles.footerHomeButton} onClick={() => onPaneChange("list")}>
              Back to list
            </button>
          </>
        )}

        {pane === "detail" && listItems.length <= 1 && (
          <button type="button" className={styles.footerHomeButton} onClick={() => onPaneChange("list")}>
            Back to list
          </button>
        )}
      </footer>
    </div>
  );
}
