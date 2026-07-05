import { MediaCard } from "../../../primitives/MediaCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function MediaCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "mediaCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.mediaCardGrid}>
        {block.cards.map((card) => (
          <MediaCard
            key={card.id}
            image={card.image}
            imageAlt={card.imageAlt ?? card.title}
            tone={card.tone}
            title={card.title}
            description={card.description}
            badges={card.badges}
            actionLabel={card.actionLabel ?? (card.href ? "Open" : undefined)}
            onAction={card.href ? () => window.open(card.href, "_blank", "noreferrer") : undefined}
          />
        ))}
      </div>
    </div>
  );
}
