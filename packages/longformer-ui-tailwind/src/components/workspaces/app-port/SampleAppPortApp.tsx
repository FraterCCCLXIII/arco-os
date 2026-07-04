import { useEffect, useMemo, useState } from "react";
import { Badge } from "../../primitives/Badge";
import { AdaptiveAppLayout, AdaptiveListRow } from "./AdaptiveAppLayout";
import {
  SAMPLE_APP_DETAILS,
  SAMPLE_APP_ITEMS,
  SAMPLE_APP_NAV,
  SAMPLE_APP_OVERFLOW_NAV,
} from "./sample-data";
import type { AdaptiveMobilePane, AdaptiveWatchPane, AppPortViewport } from "./types";
import styles from "./SampleAppPortApp.tailwind";

export interface SampleAppPortAppProps {
  viewport: AppPortViewport;
}

const WATCH_SECTION_COUNTS = Object.fromEntries(
  Object.entries(SAMPLE_APP_ITEMS).map(([sectionId, items]) => [sectionId, items.length]),
);

/** Reference app that demonstrates adaptive navigation, list, and detail panes. */
export function SampleAppPortApp({ viewport }: SampleAppPortAppProps) {
  const navItems = viewport === "phone" ? SAMPLE_APP_OVERFLOW_NAV : SAMPLE_APP_NAV;
  const [activeNavId, setActiveNavId] = useState(navItems[0]?.id ?? "inbox");
  const [activeItemId, setActiveItemId] = useState<string | null>(
    SAMPLE_APP_ITEMS[navItems[0]?.id ?? "inbox"]?.[0]?.id ?? null,
  );
  const [mobilePane, setMobilePane] = useState<AdaptiveMobilePane>("list");
  const [watchPane, setWatchPane] = useState<AdaptiveWatchPane>("sections");

  const listItems = SAMPLE_APP_ITEMS[activeNavId] ?? [];
  const activeItem = useMemo(
    () => listItems.find((item) => item.id === activeItemId) ?? listItems[0],
    [activeItemId, listItems],
  );
  const activeDetail = activeItem ? SAMPLE_APP_DETAILS[activeItem.id] : undefined;

  useEffect(() => {
    if (viewport === "watch") {
      setWatchPane("sections");
    }
  }, [viewport]);

  useEffect(() => {
    if (navItems.some((item) => item.id === activeNavId)) return;
    const nextNavId = navItems[0]?.id ?? "inbox";
    setActiveNavId(nextNavId);
    const nextItems = SAMPLE_APP_ITEMS[nextNavId] ?? [];
    setActiveItemId(nextItems[0]?.id ?? null);
    setMobilePane("list");
  }, [navItems, activeNavId]);

  function handleNavChange(id: string) {
    setActiveNavId(id);
    const nextItems = SAMPLE_APP_ITEMS[id] ?? [];
    setActiveItemId(nextItems[0]?.id ?? null);
    setMobilePane("list");
  }

  function handleSelectItem(id: string) {
    setActiveItemId(id);
    if (viewport === "phone") {
      setMobilePane("detail");
    }
  }

  const list = listItems.map((item) => (
    <AdaptiveListRow
      key={item.id}
      title={item.title}
      subtitle={item.subtitle}
      meta={item.meta}
      active={item.id === activeItem?.id}
      onClick={() => handleSelectItem(item.id)}
    />
  ));

  const detail = activeDetail ? (
    <div className={styles.detailBody}>
      <Badge tone="neutral">{activeDetail.status}</Badge>
      <p className={styles.detailCopy}>{activeDetail.body}</p>
    </div>
  ) : (
    <p className={styles.detailEmpty}>Select an item to preview its detail pane.</p>
  );

  const watchDetail = activeDetail ? (
    <div className={styles.watchDetailBody}>
      <span className={styles.watchDetailStatus}>{activeDetail.status}</span>
      <p className={styles.watchDetailCopy}>{activeDetail.body}</p>
    </div>
  ) : (
    <p className={styles.watchDetailEmpty}>No item selected.</p>
  );

  return (
    <AdaptiveAppLayout
      viewport={viewport}
      title="Projects"
      navItems={navItems}
      activeNavId={activeNavId}
      onNavChange={handleNavChange}
      listTitle={navItems.find((item) => item.id === activeNavId)?.label ?? "Items"}
      list={list}
      detailTitle={activeDetail?.title}
      detail={viewport === "watch" ? watchDetail : detail}
      mobilePane={mobilePane}
      onMobilePaneChange={setMobilePane}
      watchPane={watchPane}
      onWatchPaneChange={setWatchPane}
      watchListItems={listItems}
      activeWatchItemId={activeItemId}
      onWatchItemSelect={setActiveItemId}
      watchSectionCounts={WATCH_SECTION_COUNTS}
    />
  );
}
