import { ProfileSummaryCard } from "../../../primitives/ProfileSummaryCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function ProfileSummaryCardsBlock({
  block,
}: {
  block: Extract<GeneratedBlock, { type: "profileSummaryCards" }>;
}) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.profileSummaryCardGrid}>
        {block.cards.map((card) => (
          <ProfileSummaryCard
            key={card.id}
            avatarName={card.avatarName}
            title={card.title}
            subtitle={card.subtitle}
            rating={card.rating}
            rows={card.rows}
          />
        ))}
      </div>
    </div>
  );
}
