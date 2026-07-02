import { Icon } from "../../../icons";
import { NavSidebar } from "../../shell/NavSidebar";
import type { ExtensionView, ExtensionsWorkspaceData } from "./types";
import styles from "./ExtensionsSidebar.module.css";

export interface ExtensionsSidebarProps {
  data: ExtensionsWorkspaceData;
  view: ExtensionView;
  onViewChange: (view: ExtensionView) => void;
}

/** Extensions nav — browse agent skills, plugins, prompts, and app templates. */
export function ExtensionsSidebar({ data, view, onViewChange }: ExtensionsSidebarProps) {
  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <>
          <div className={styles.brand}>
            <span className={styles.brandIcon} aria-hidden="true">
              <Icon name="package" size={16} />
            </span>
            <div className={styles.brandBody}>
              <span className={styles.brandName}>{data.workspaceName}</span>
              <span className={styles.brandMeta}>{data.userName}</span>
            </div>
          </div>

          <div className={styles.search}>
            <Icon name="search" size={14} />
            <span>Search extensions</span>
            <kbd className={styles.kbd}>⌘K</kbd>
          </div>
        </>
      }
      sections={[
        {
          id: "catalog",
          title: "Catalog",
          items: data.navItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            trailing: item.badge ? <span className={styles.badge}>{item.badge}</span> : undefined,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
          })),
        },
      ]}
      footer={
        <div className={styles.footer}>
          <button type="button" className={styles.footerLink}>
            <Icon name="plus" size={14} />
            Publish extension
          </button>
          <button type="button" className={styles.footerLink}>
            <Icon name="external-link" size={14} />
            Browse marketplace
          </button>
        </div>
      }
    />
  );
}
