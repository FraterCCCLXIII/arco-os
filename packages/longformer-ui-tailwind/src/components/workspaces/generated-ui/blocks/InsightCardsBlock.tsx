import { InsightCard } from "../../../primitives/InsightCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function InsightCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "insightCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.insightCardGrid}>
        {block.cards.map((card) => (
          <InsightCard key={card.id} label={card.label} title={card.title} description={card.description} />
        ))}
      </div>
    </div>
  );
}
