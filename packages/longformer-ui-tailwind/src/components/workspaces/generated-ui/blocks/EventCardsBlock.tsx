import { EventCard } from "../../../primitives/EventCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function EventCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "eventCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.eventCardGrid}>
        {block.cards.map((card) => (
          <EventCard
            key={card.id}
            label={card.label}
            title={card.title}
            startTime={card.startTime}
            endTime={card.endTime}
            timeLeft={card.timeLeft}
          />
        ))}
      </div>
    </div>
  );
}
