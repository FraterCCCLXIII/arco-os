import { Icon } from "../../../icons";
import { NavSidebar } from "../../shell/NavSidebar";
import type { LifePlanningView, LifePlanningWorkspaceData } from "./types";
import styles from "./LifePlanningSidebar.tailwind";

export interface LifePlanningSidebarProps {
  data: LifePlanningWorkspaceData;
  view: LifePlanningView;
  onViewChange: (view: LifePlanningView) => void;
}

/** Life planning nav — overview, life modules, AI coach, and goal tracking. */
export function LifePlanningSidebar({ data, view, onViewChange }: LifePlanningSidebarProps) {
  const overviewItems = data.navItems.filter((item) => item.section === "overview");
  const moduleItems = data.navItems.filter((item) => item.section === "modules");
  const toolItems = data.navItems.filter((item) => item.section === "tools");

  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <div className={styles.brand}>
          <div className={styles.brandRow}>
            <span className={styles.brandIcon}>
              <Icon name="target" size={16} />
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
          })),
        },
        {
          id: "modules",
          title: "Life Modules",
          items: moduleItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
          })),
        },
        {
          id: "tools",
          title: "Tools",
          items: toolItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            trailing:
              item.view === "ai-coach" ? (
                <span className={styles.aiBadge}>
                  <Icon name="sparkles" size={10} />
                  AI
                </span>
              ) : undefined,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
          })),
        },
      ]}
      footer={
        <div className={styles.footer}>
          <div className={styles.weeklyFocus}>
            <div className={styles.weeklyFocusLabel}>
              <Icon name="sparkles" size={12} />
              Weekly Focus
            </div>
            <p className={styles.weeklyFocusText}>{data.aiCoach.weeklyFocus}</p>
          </div>
        </div>
      }
    />
  );
}
