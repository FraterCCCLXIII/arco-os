import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Input } from "../../primitives/Input";
import { NavSidebar } from "../../shell/NavSidebar";
import type { PsycheNavItem, PsycheView, PsycheWorkspaceData } from "./types";
import styles from "./PsycheSidebar.tailwind";

export interface PsycheSidebarProps {
  data: PsycheWorkspaceData;
  view: PsycheView;
  onViewChange: (view: PsycheView) => void;
  onAdd?: () => void;
}

function filterNavItems(items: PsycheNavItem[], query: string): PsycheNavItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) => item.label.toLowerCase().includes(normalized));
}

/** Psyche nav — memory stores, knowledge graph, RAG, vector DB, and identity docs. */
export function PsycheSidebar({ data, view, onViewChange, onAdd }: PsycheSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const overviewItems = useMemo(
    () => filterNavItems(data.navItems.filter((item) => item.section === "overview"), searchQuery),
    [data.navItems, searchQuery],
  );
  const storeItems = useMemo(
    () => filterNavItems(data.navItems.filter((item) => item.section === "stores"), searchQuery),
    [data.navItems, searchQuery],
  );
  const identityItems = useMemo(
    () => filterNavItems(data.navItems.filter((item) => item.section === "identity"), searchQuery),
    [data.navItems, searchQuery],
  );

  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <Input
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search psyche"
          startSlot={<Icon name="search" size={14} />}
          wrapperClassName={styles.searchInput}
        />
      }
      primaryAction={{ label: "Add", icon: "plus", onClick: onAdd }}
      sections={[
        ...(overviewItems.length > 0
          ? [
              {
                id: "overview",
                items: overviewItems.map((item) => ({
                  id: item.id,
                  label: item.label,
                  leading: <Icon name={item.icon} size={16} />,
                  active: view === item.view,
                  onClick: () => onViewChange(item.view),
                })),
              },
            ]
          : []),
        ...(storeItems.length > 0
          ? [
              {
                id: "stores",
                title: "Knowledge Stores",
                items: storeItems.map((item) => ({
                  id: item.id,
                  label: item.label,
                  leading: <Icon name={item.icon} size={16} />,
                  active: view === item.view,
                  onClick: () => onViewChange(item.view),
                })),
              },
            ]
          : []),
        ...(identityItems.length > 0
          ? [
              {
                id: "identity",
                title: "Identity & Ethics",
                items: identityItems.map((item) => ({
                  id: item.id,
                  label: item.label,
                  leading: <Icon name={item.icon} size={16} />,
                  trailing:
                    item.view === "soul-md" || item.view === "ethics-md" ? (
                      <span className={styles.docBadge}>MD</span>
                    ) : undefined,
                  active: view === item.view,
                  onClick: () => onViewChange(item.view),
                })),
              },
            ]
          : []),
      ]}
      footer={
        <div className={styles.footer}>
          <div className={styles.modelChip}>
            <div className={styles.modelChipLabel}>
              <Icon name="zap" size={12} />
              Active Model
            </div>
            <p className={styles.modelChipText}>{data.modelName}</p>
          </div>
        </div>
      }
    />
  );
}
