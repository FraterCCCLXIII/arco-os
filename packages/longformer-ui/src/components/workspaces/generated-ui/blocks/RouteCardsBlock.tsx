import { RouteCard } from "../../../primitives/RouteCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function RouteCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "routeCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.routeCardGrid}>
        {block.cards.map((card) => (
          <RouteCard key={card.id} pickup={card.pickup} dropoff={card.dropoff} />
        ))}
      </div>
    </div>
  );
}
