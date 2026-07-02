import { VideoPlayerCard } from "../../../primitives/VideoPlayerCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function VideoPlayerCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "videoPlayerCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.videoPlayerGrid}>
        {block.cards.map((card) => (
          <VideoPlayerCard
            key={card.id}
            elapsed={card.elapsed}
            duration={card.duration}
            progress={card.progress}
            ended={card.ended}
            imageTone={card.imageTone}
            watchAgainLabel={card.watchAgainLabel}
          />
        ))}
      </div>
    </div>
  );
}
