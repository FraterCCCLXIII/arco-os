import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { Button } from "../../primitives/Button";
import { NavSidebar } from "../../shell/NavSidebar";
import type { OrchestratorView, OrchestratorWorkspaceData } from "./types";
import styles from "./OrchestratorSidebar.tailwind";

export interface OrchestratorSidebarProps {
  data: OrchestratorWorkspaceData;
  view: OrchestratorView;
  onViewChange: (view: OrchestratorView) => void;
}

/** Agent orchestration portal nav — dashboard, agents, jobs, traces, and ops views. */
export function OrchestratorSidebar({ data, view, onViewChange }: OrchestratorSidebarProps) {
  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <Icon name="grid" size={16} />
          </span>
          <span>{data.productName}</span>
        </div>
      }
      sections={[
        {
          id: "main",
          items: data.navItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
          })),
        },
      ]}
      footer={
        <div className={styles.footer}>
          <div className={styles.profile}>
            <Avatar name={data.userName} size="sm" />
            <div className={styles.profileBody}>
              <span className={styles.profileName}>{data.userName}</span>
              <span className={styles.profileEmail}>{data.userEmail}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              iconOnly
              className={styles.logoutBtn}
              aria-label="Sign out"
            >
              <Icon name="arrow-up-right" size={14} />
            </Button>
          </div>
        </div>
      }
    />
  );
}
