import { useState } from "react";
import { Input } from "../../primitives/Input";
import { Chip } from "../../primitives/Chip";
import { Icon, type IconName } from "../../../icons";
import { TabStrip, type TabStripItem } from "./TabStrip";
import { BrowserToolbar } from "./BrowserToolbar";
import styles from "./BrowserApp.module.css";

export interface BrowserTab {
  id: string;
  label: string;
  url: string;
  icon?: IconName;
  swatch?: string;
}

export interface BrowserQuickLink {
  label: string;
  icon?: IconName;
}

export interface BrowserAppProps {
  initialTabs?: BrowserTab[];
  quickLinks?: BrowserQuickLink[];
}

const DEFAULT_TABS: BrowserTab[] = [{ id: "new-tab", label: "New Tab", url: "", swatch: "var(--lf-accent)" }];

const DEFAULT_QUICK_LINKS: BrowserQuickLink[] = [
  { label: "Longformer docs", icon: "notebook" },
  { label: "Design tokens", icon: "layers" },
  { label: "Component gallery", icon: "grid" },
  { label: "Changelog", icon: "sparkles" },
];

/**
 * Real browser-window content: a tab strip + address bar (both self-managed)
 * over a search-style new-tab page, so a desktop "Browser" window behaves
 * like an actual browser instead of static placeholder text.
 */
export function BrowserApp({ initialTabs = DEFAULT_TABS, quickLinks = DEFAULT_QUICK_LINKS }: BrowserAppProps) {
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
    <div className={styles.app}>
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
      <div className={styles.page}>
        <div className={styles.searchBlock}>
          <div className={styles.logo}>
            <Icon name="sparkles" size={28} />
          </div>
          <Input
            wrapperClassName={styles.search}
            startSlot={<Icon name="search" size={15} />}
            placeholder="Search or enter address"
            value={activeTab.url}
            onChange={(event) => updateActiveTab({ url: event.target.value, label: event.target.value || "New Tab" })}
          />
          <div className={styles.quickLinks}>
            {quickLinks.map((link) => (
              <Chip key={link.label} icon={link.icon} onClick={() => updateActiveTab({ url: link.label, label: link.label })}>
                {link.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
