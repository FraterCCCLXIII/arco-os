import { ActivityCard } from "../../../primitives/ActivityCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function ActivityCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "activityCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.activityCardList}>
        {block.cards.map((card) => (
          <ActivityCard
            key={card.id}
            icon={card.icon}
            avatarName={card.avatarName}
            title={card.title}
            status={card.status}
            category={card.category}
            amount={card.amount}
            time={card.time}
          />
        ))}
      </div>
    </div>
  );
}
