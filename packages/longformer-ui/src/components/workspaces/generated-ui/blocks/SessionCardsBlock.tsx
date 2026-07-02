import { SessionCard } from "../../../primitives/SessionCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

function noop() {}

export function SessionCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "sessionCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.sessionCardGrid}>
        {block.cards.map((card) => (
          <SessionCard
            key={card.id}
            headline={card.headline}
            avatarName={card.avatarName}
            title={card.title}
            subtitle={card.subtitle}
            tags={card.tags}
            onAction={noop}
          />
        ))}
      </div>
    </div>
  );
}
