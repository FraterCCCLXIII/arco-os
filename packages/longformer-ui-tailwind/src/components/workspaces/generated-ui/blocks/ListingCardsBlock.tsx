import { ListingCard } from "../../../primitives/ListingCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

// Generated schemas are plain data with no functions attached, but the save
// toggle only renders when a handler is present — this keeps that affordance
// visible for cards that define a `saved` state.
function noop() {}

export function ListingCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "listingCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.listingCardGrid}>
        {block.cards.map((card) => (
          <ListingCard
            key={card.id}
            icon={card.icon}
            avatarName={card.avatarName}
            title={card.title}
            subtitle={card.subtitle}
            tags={card.tags}
            price={card.price}
            priceMeta={card.priceMeta}
            actionLabel={card.actionLabel}
            saved={card.saved}
            onToggleSave={card.saved !== undefined ? noop : undefined}
          />
        ))}
      </div>
    </div>
  );
}
