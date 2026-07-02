import { cx } from "../../../utils/cx";
import { Avatar } from "../../primitives/Avatar";
import { Badge } from "../../primitives/Badge";
import { CountBadge } from "../../primitives/Badge";
import { ScrollArea } from "../../primitives/ScrollArea";
import { SCHEDULE_STATUS_LABEL, formatTimeRange, type ScheduleItem, type ScheduleItemStatus } from "./types";
import styles from "./KanbanBoard.module.css";

export interface KanbanBoardProps {
  items: ScheduleItem[];
  projects?: { id: string; name: string; color: string }[];
  onSelectItem?: (item: ScheduleItem) => void;
}

const COLUMN_ORDER: ScheduleItemStatus[] = ["backlog", "active", "closed"];

export function KanbanBoard({ items, projects = [], onSelectItem }: KanbanBoardProps) {
  const projectMap = new Map(projects.map((project) => [project.id, project]));

  return (
    <div className={styles.board}>
      {COLUMN_ORDER.map((status) => {
        const columnItems = items.filter((item) => item.status === status);
        return (
          <section key={status} className={styles.column}>
            <header className={styles.columnHeader}>
              <span>{SCHEDULE_STATUS_LABEL[status]}</span>
              <CountBadge count={columnItems.length} />
            </header>
            <ScrollArea className={styles.columnScroll}>
              <div className={styles.cards}>
                {columnItems.map((item) => {
                  const project = item.projectId ? projectMap.get(item.projectId) : undefined;
                  const timeLabel = formatTimeRange(item.startMinutes, item.endMinutes);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={cx(styles.card, "lf-focusable")}
                      onClick={() => onSelectItem?.(item)}
                    >
                      {project && (
                        <div className={styles.projectRow}>
                          <span className={styles.projectDot} style={{ background: project.color }} aria-hidden="true" />
                          <span className={styles.projectName}>{project.name}</span>
                        </div>
                      )}
                      <div className={styles.cardTitle}>{item.title}</div>
                      <div className={styles.cardMeta}>
                        {timeLabel && <Badge tone="neutral">{timeLabel}</Badge>}
                        {item.priority && <Badge tone="neutral">{item.priority}</Badge>}
                        {item.assignees?.[0] && (
                          <Avatar name={item.assignees[0].name} src={item.assignees[0].avatarSrc} size="sm" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </section>
        );
      })}
    </div>
  );
}
