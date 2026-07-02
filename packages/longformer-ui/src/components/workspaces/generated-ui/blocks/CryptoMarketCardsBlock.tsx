import { CryptoMarketCard } from "../../../primitives/CryptoMarketCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function CryptoMarketCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "cryptoMarketCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <CryptoMarketCard key={card.id} rows={card.rows} />
        ))}
      </div>
    </div>
  );
}
