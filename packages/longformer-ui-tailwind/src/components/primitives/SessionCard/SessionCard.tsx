import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { type IconName } from "../../../icons";
import { Avatar } from "../Avatar";
import { Card } from "../Card";
import { IconButton } from "../IconButton";
import styles from "./SessionCard.tailwind";

export interface SessionCardProps {
  headline: ReactNode;
  avatarName: string;
  avatarSrc?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  tags?: string[];
  actionIcon?: IconName;
  onAction?: () => void;
  className?: string;
}

/** A therapy-style "next session" card with profile, tags, and a call action. */
export function SessionCard({
  headline,
  avatarName,
  avatarSrc,
  title,
  subtitle,
  tags,
  actionIcon = "phone-call",
  onAction,
  className,
}: SessionCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.head}>
        <div className={styles.headline}>{headline}</div>
        {onAction && <IconButton icon={actionIcon} label="Start session" variant="primary" onClick={onAction} />}
      </div>

      <div className={styles.profile}>
        <Avatar name={avatarName} src={avatarSrc} size="lg" />
        <div className={styles.profileBody}>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
