import { MeetingCountdownCard } from "../../../primitives/MeetingCountdownCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

function noop() {}

export function MeetingCountdownCardsBlock({
  block,
}: {
  block: Extract<GeneratedBlock, { type: "meetingCountdownCards" }>;
}) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.meetingCountdownGrid}>
        {block.cards.map((card) => (
          <MeetingCountdownCard
            key={card.id}
            memberNames={card.memberNames}
            memberCount={card.memberCount}
            countdown={card.countdown}
            actionLabel={card.actionLabel}
            onAction={card.actionLabel ? noop : undefined}
          />
        ))}
      </div>
    </div>
  );
}
