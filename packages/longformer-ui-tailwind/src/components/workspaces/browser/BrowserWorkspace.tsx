import { useState } from "react";
import { cx } from "../../../utils/cx";
import { TabStrip, type TabStripItem } from "../desktop/TabStrip";
import { BrowserToolbar } from "../desktop/BrowserToolbar";
import type { BrowserTab } from "../desktop/BrowserApp";
import styles from "./BrowserWorkspace.tailwind";

export interface BrowserWorkspaceProps {
  initialTabs?: BrowserTab[];
  className?: string;
}

const DEFAULT_TABS: BrowserTab[] = [
  { id: "new-tab", label: "New Tab", url: "", swatch: "var(--lf-accent)" },
];

/** Browser workspace with tab strip, address bar, and a blank page content area. */
export function BrowserWorkspace({
  initialTabs = DEFAULT_TABS,
  className,
}: BrowserWorkspaceProps) {
  const [tabs, setTabs] = useState<BrowserTab[]>(initialTabs.length > 0 ? initialTabs : DEFAULT_TABS);
  const [activeId, setActiveId] = useState<string>(initialTabs[0]?.id ?? DEFAULT_TABS[0].id);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  function updateActiveTab(patch: Partial<BrowserTab>) {
    setTabs((prev) => prev.map((tab) => (tab.id === activeTab.id ? { ...tab, ...patch } : tab)));
  }

  function openNewTab() {
    const id = `tab-${Date.now()}`;
    const tab: BrowserTab = { id, label: "New Tab", url: "" };
    setTabs((prev) => [...prev, tab]);
    setActiveId(id);
  }

  function closeTab(id: string) {
    setTabs((prev) => {
      const next = prev.filter((tab) => tab.id !== id);
      if (next.length === 0) {
        const fresh: BrowserTab = { id: `tab-${Date.now()}`, label: "New Tab", url: "" };
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[next.length - 1].id);
      return next;
    });
  }

  const tabItems: TabStripItem[] = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
    swatch: tab.swatch,
    closable: tabs.length > 1,
  }));

  return (
    <div className={cx(styles.workspace, className)} aria-label="Browser">
      <TabStrip
        tabs={[...tabItems, { id: "__new__", label: "", icon: "plus" }]}
        activeId={activeId}
        onSelect={(id) => (id === "__new__" ? openNewTab() : setActiveId(id))}
        onClose={closeTab}
      />
      <BrowserToolbar
        url={activeTab.url}
        onUrlChange={(url) => updateActiveTab({ url, label: url || "New Tab" })}
        canGoBack={Boolean(activeTab.url)}
        bookmarked={bookmarked.has(activeTab.id)}
        onToggleBookmark={() =>
          setBookmarked((prev) => {
            const next = new Set(prev);
            if (next.has(activeTab.id)) next.delete(activeTab.id);
            else next.add(activeTab.id);
            return next;
          })
        }
        secure={activeTab.url.length === 0 || activeTab.url.startsWith("https://")}
      />
      <div className={styles.content} role="tabpanel" aria-label={activeTab.label} />
    </div>
  );
}
