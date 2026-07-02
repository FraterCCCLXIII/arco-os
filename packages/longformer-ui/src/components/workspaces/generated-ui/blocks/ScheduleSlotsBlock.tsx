import { Card } from "../../../primitives/Card";
import { ScheduleSlotCard } from "../../../primitives/ScheduleSlotCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function ScheduleSlotsBlock({ block }: { block: Extract<GeneratedBlock, { type: "scheduleSlots" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <Card padding="lg" className={styles.scheduleSlotsCard}>
        <div className={styles.scheduleSlotsGrid}>
          {block.slots.map((slot) => (
            <ScheduleSlotCard
              key={slot.id}
              name={slot.name}
              mode={slot.mode}
              timeRange={slot.timeRange}
              tone={slot.tone}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
