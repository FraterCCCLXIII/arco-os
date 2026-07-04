import { cx } from "../../../utils/cx";
import { Avatar } from "../../primitives/Avatar";
import { formatTimeRange, type ScheduleItem } from "./types";
import styles from "./ScheduleTaskCard.tailwind";

export interface ScheduleTaskCardProps {
  item: ScheduleItem;
  compact?: boolean;
  onClick?: () => void;
}

export function ScheduleTaskCard({ item, compact = false, onClick }: ScheduleTaskCardProps) {
  const tone = item.tone ?? "accent";
  const timeLabel = formatTimeRange(item.startMinutes, item.endMinutes);

  return (
    <button
      type="button"
      className={cx(styles.card, styles[tone], compact && styles.compact)}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
    >
      <div className={styles.title}>{item.title}</div>
      {timeLabel && <div className={styles.time}>{timeLabel}</div>}
      {!compact && item.assignees && item.assignees.length > 0 && (
        <div className={styles.assignees}>
          {item.assignees.slice(0, 3).map((person) => (
            <Avatar key={person.name} name={person.name} src={person.avatarSrc} size="sm" />
          ))}
        </div>
      )}
    </button>
  );
}
