import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import styles from "./MeetingCountdownCard.tailwind";

export interface MeetingCountdownCardProps {
  memberNames?: string[];
  memberCount?: ReactNode;
  countdown: ReactNode;
  actionLabel?: ReactNode;
  actionIcon?: IconName;
  onAction?: () => void;
  className?: string;
}

/** A meeting countdown card with member avatars and a primary action pill. */
export function MeetingCountdownCard({
  memberNames = [],
  memberCount,
  countdown,
  actionLabel,
  actionIcon = "mic",
  onAction,
  className,
}: MeetingCountdownCardProps) {
  const visibleMembers = memberNames.slice(0, 4);

  return (
    <div className={cx(styles.card, className)}>
      <div className={styles.top}>
        <div className={styles.avatars}>
          {visibleMembers.map((name) => (
            <Avatar key={name} name={name} size="sm" className={styles.avatar} />
          ))}
        </div>
        {memberCount && <span className={styles.memberCount}>{memberCount}</span>}
        <Icon name="grid" size={16} className={styles.menu} />
      </div>

      <div className={styles.countdown}>{countdown}</div>

      {actionLabel && (
        <Button variant="secondary" fullWidth className={styles.action} onClick={onAction}>
          {actionIcon && <Icon name={actionIcon} size={14} />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
