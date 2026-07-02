import { TimezoneCard } from "../../../primitives/TimezoneCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function TimezoneCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "timezoneCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.timezoneCardGrid}>
        {block.cards.map((card) => (
          <TimezoneCard key={card.id} rows={card.rows} />
        ))}
      </div>
    </div>
  );
}
