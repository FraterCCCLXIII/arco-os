import { GlobalRankingCard } from "../../../primitives/GlobalRankingCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function GlobalRankingCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "globalRankingCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <GlobalRankingCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
