import { WebinarCtaCard } from "../../../primitives/WebinarCtaCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function WebinarCtaCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "webinarCtaCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <WebinarCtaCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
