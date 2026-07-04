import { NewsFeedCard } from "../../../primitives/NewsFeedCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function NewsFeedCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "newsFeedCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <NewsFeedCard
            key={card.id}
            source={card.source}
            headline={card.headline}
            excerpt={card.excerpt}
            imageTone={card.imageTone}
            stats={card.stats}
          />
        ))}
      </div>
    </div>
  );
}
