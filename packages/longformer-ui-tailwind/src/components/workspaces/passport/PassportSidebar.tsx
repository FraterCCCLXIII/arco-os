import { Icon } from "../../../icons";
import { NavSidebar } from "../../shell/NavSidebar";
import type { PassportView, PassportWorkspaceData } from "./types";
import styles from "./PassportSidebar.tailwind";

export interface PassportSidebarProps {
  data: PassportWorkspaceData;
  view: PassportView;
  onViewChange: (view: PassportView) => void;
}

/** Passport nav — vault, env sets, agent grants, and audit trail. */
export function PassportSidebar({ data, view, onViewChange }: PassportSidebarProps) {
  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <>
          <div className={styles.brand}>
            <span className={styles.brandIcon} aria-hidden="true">
              <Icon name="lock" size={16} />
            </span>
            <div className={styles.brandBody}>
              <span className={styles.brandName}>{data.workspaceName}</span>
              <span className={styles.brandMeta}>{data.userName}</span>
            </div>
          </div>
          <p className={styles.tagline}>{data.tagline}</p>
        </>
      }
      sections={[
        {
          id: "vault",
          title: "Secure Store",
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
          <div className={styles.lockBanner}>
            <Icon name="lock" size={14} aria-hidden="true" />
            <div>
              <strong>Encrypted at rest</strong>
              Secrets are decrypted only when an agent has an active grant.
            </div>
          </div>
        </div>
      }
    />
  );
}
