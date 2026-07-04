import { useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { Card } from "../Card";
import { Tabs } from "../Tabs";
import styles from "./TaskChecklistCard.tailwind";

export interface TaskChecklistItem {
  label: ReactNode;
  completed?: boolean;
}

export interface TaskChecklistCardProps {
  tabs?: { id: string; label: string }[];
  activeTab?: string;
  title: ReactNode;
  items: TaskChecklistItem[];
  progress?: number;
  progressLabel?: ReactNode;
  memberNames?: string[];
  actionLabel?: ReactNode;
  className?: string;
}

/** Project task card — tabbed header, checklist, progress bar, team avatars, and CTA. */
export function TaskChecklistCard({
  tabs,
  activeTab,
  title,
  items,
  progress = 0,
  progressLabel,
  memberNames,
  actionLabel = "Add Task",
  className,
}: TaskChecklistCardProps) {
  const [tab, setTab] = useState(activeTab ?? tabs?.[0]?.id ?? "default");
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      {tabs && tabs.length > 0 && (
        <Tabs items={tabs} value={tab} onChange={setTab} variant="underline" aria-label="Task categories" />
      )}
      <div className={styles.title}>{title}</div>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={cx(styles.item, item.completed && styles.itemCompleted)}>
            <span className={cx(styles.check, item.completed && styles.checkCompleted)} aria-hidden="true">
              {item.completed && <Icon name="check" size={12} />}
            </span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <div className={styles.progressBlock}>
        <div className={styles.progressMeta}>
          <span>{progressLabel ?? `${clampedProgress}%`}</span>
        </div>
        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressFill} style={{ width: `${clampedProgress}%` }} />
        </div>
      </div>
      {memberNames && memberNames.length > 0 && (
        <div className={styles.members}>
          {memberNames.slice(0, 4).map((name) => (
            <Avatar key={name} name={name} size="sm" />
          ))}
        </div>
      )}
      {actionLabel && (
        <Button variant="secondary" fullWidth>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
