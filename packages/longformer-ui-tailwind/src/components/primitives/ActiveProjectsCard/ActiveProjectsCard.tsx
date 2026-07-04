import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Card } from "../Card";
import { DashboardCardHeader } from "../DashboardCardHeader";
import styles from "./ActiveProjectsCard.tailwind";

export type ProjectProgressTone = "purple" | "teal" | "green" | "orange" | "accent";

export interface ProjectProgressItem {
  name: string;
  category?: string;
  icon?: IconName;
  progress: number;
  tone?: ProjectProgressTone;
}

export interface ActiveProjectsCardProps {
  title?: string;
  subtitle?: string;
  items: ProjectProgressItem[];
  menu?: boolean;
  className?: string;
}

/** Project list card — brand row, category label, and colored progress bar per item. */
export function ActiveProjectsCard({
  title = "Active Projects",
  subtitle = "Average 72% completed",
  items,
  menu = true,
  className,
}: ActiveProjectsCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <DashboardCardHeader title={title} subtitle={subtitle} menu={menu} />
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.name} className={styles.item}>
            <div className={styles.row}>
              <span className={cx(styles.icon, item.tone && styles[`tone-${item.tone}`])}>
                <Icon name={item.icon ?? "grid"} size={14} />
              </span>
              <div className={styles.meta}>
                <div className={styles.name}>{item.name}</div>
                {item.category && <div className={styles.category}>{item.category}</div>}
              </div>
              <span className={styles.percent}>{item.progress}%</span>
            </div>
            <div className={styles.track}>
              <span
                className={cx(styles.fill, item.tone && styles[`fill-${item.tone}`])}
                style={{ width: `${Math.max(0, Math.min(100, item.progress))}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
