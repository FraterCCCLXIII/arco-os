import { CalendarScheduleCard } from "../../../primitives/CalendarScheduleCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function CalendarScheduleCardsBlock({
  block,
}: {
  block: Extract<GeneratedBlock, { type: "calendarScheduleCards" }>;
}) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <CalendarScheduleCard
            key={card.id}
            monthLabel={card.monthLabel}
            weekdays={card.weekdays}
            days={card.days}
            events={card.events}
          />
        ))}
      </div>
    </div>
  );
}
