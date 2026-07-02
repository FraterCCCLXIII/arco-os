import { Icon } from "../../../icons";
import { NavSidebar } from "../../shell/NavSidebar";
import type { PsycheView, PsycheWorkspaceData } from "./types";
import styles from "./PsycheSidebar.module.css";

export interface PsycheSidebarProps {
  data: PsycheWorkspaceData;
  view: PsycheView;
  onViewChange: (view: PsycheView) => void;
}

/** Psyche nav — memory stores, knowledge graph, RAG, vector DB, and identity docs. */
export function PsycheSidebar({ data, view, onViewChange }: PsycheSidebarProps) {
  const overviewItems = data.navItems.filter((item) => item.section === "overview");
  const storeItems = data.navItems.filter((item) => item.section === "stores");
  const identityItems = data.navItems.filter((item) => item.section === "identity");

  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <div className={styles.brand}>
          <div className={styles.brandRow}>
            <span className={styles.brandIcon}>
              <Icon name="sparkles" size={16} />
            </span>
            <span>{data.productName}</span>
          </div>
          <span className={styles.tagline}>{data.tagline}</span>
        </div>
      }
      sections={[
        {
          id: "overview",
          items: overviewItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
            className: styles.navItem,
          })),
        },
        {
          id: "stores",
          title: "Knowledge Stores",
          items: storeItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
            className: styles.navItem,
          })),
        },
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
            className: styles.navItem,
          })),
        },
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
