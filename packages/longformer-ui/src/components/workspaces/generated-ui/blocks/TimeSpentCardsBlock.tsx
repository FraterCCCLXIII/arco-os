import { TimeSpentCard } from "../../../primitives/TimeSpentCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function TimeSpentCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "timeSpentCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <TimeSpentCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
