import { MusicPlayerCard } from "../../../primitives/MusicPlayerCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function MusicPlayerCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "musicPlayerCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <MusicPlayerCard
            key={card.id}
            title={card.title}
            artist={card.artist}
            sourceLabel={card.sourceLabel}
            imageTone={card.imageTone}
            progress={card.progress}
            elapsed={card.elapsed}
            duration={card.duration}
            playing={card.playing}
          />
        ))}
      </div>
    </div>
  );
}
