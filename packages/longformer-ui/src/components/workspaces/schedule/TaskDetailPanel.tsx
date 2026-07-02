import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { Button } from "../../primitives/Button";
import { IconButton } from "../../primitives/IconButton";
import { Badge } from "../../primitives/Badge";
import { formatTimeRange, type ScheduleItem } from "./types";
import styles from "./TaskDetailPanel.module.css";

export interface TaskDetailPanelProps {
  item: ScheduleItem | null;
  open: boolean;
  onClose: () => void;
  onConfirmAttending?: (id: string) => void;
  onDeclineAttending?: (id: string) => void;
}

function formatDateLabel(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function TaskDetailPanel({
  item,
  open,
  onClose,
  onConfirmAttending,
  onDeclineAttending,
}: TaskDetailPanelProps) {
  if (!open || !item) return null;

  const timeRange = formatTimeRange(item.startMinutes, item.endMinutes);
  const visibleAttendees = item.assignees?.slice(0, 4) ?? [];
  const overflowCount = Math.max(0, (item.assignees?.length ?? 0) - visibleAttendees.length);

  return (
    <div className={styles.scrim} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-label={item.title}>
        <div className={styles.header}>
          <h2 className={styles.title}>{item.title}</h2>
          <IconButton icon="close" label="Close" onClick={onClose} />
        </div>

        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <Icon name="calendar" size={14} />
            <span>{formatDateLabel(item.date)}</span>
          </div>
          {timeRange && (
            <div className={styles.metaRow}>
              <Icon name="grid" size={14} />
              <span>{timeRange}</span>
            </div>
          )}
          {item.location && (
            <div className={styles.metaRow}>
              <Icon name="external-link" size={14} />
              <span>{item.location}</span>
            </div>
          )}
        </div>

        {item.description && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Description</div>
            <p className={styles.description}>{item.description}</p>
          </div>
        )}

        {item.assignees && item.assignees.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Attendees</div>
            <div className={styles.attendees}>
              {visibleAttendees.map((person) => (
                <Avatar key={person.name} name={person.name} src={person.avatarSrc} size="md" />
              ))}
              {overflowCount > 0 && <Badge tone="neutral">+{overflowCount} more</Badge>}
            </div>
          </div>
        )}

        {item.requiresRsvp && (
          <div className={styles.footer}>
            <div className={styles.rsvpPrompt}>Confirm attending?</div>
            <div className={styles.rsvpActions}>
              <Button variant="primary" size="sm" onClick={() => onConfirmAttending?.(item.id)}>
                <Icon name="check" size={14} />
                Confirm
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onDeclineAttending?.(item.id)}>
                <Icon name="close" size={14} />
                Can&apos;t attend
              </Button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
