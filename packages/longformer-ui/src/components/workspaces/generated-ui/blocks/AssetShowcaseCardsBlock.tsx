import { AssetShowcaseCard } from "../../../primitives/AssetShowcaseCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function AssetShowcaseCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "assetShowcaseCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <AssetShowcaseCard
            key={card.id}
            title={card.title}
            description={card.description}
            imageTone={card.imageTone}
            stats={card.stats}
            creatorName={card.creatorName}
            creatorMeta={card.creatorMeta}
            actionLabel={card.actionLabel}
          />
        ))}
      </div>
    </div>
  );
}
