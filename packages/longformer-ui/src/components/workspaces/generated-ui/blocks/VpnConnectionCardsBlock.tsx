import { VpnConnectionCard } from "../../../primitives/VpnConnectionCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function VpnConnectionCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "vpnConnectionCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <VpnConnectionCard
            key={card.id}
            active={card.active}
            statusLabel={card.statusLabel}
            location={card.location}
            ipAddress={card.ipAddress}
            timeConnected={card.timeConnected}
            download={card.download}
            upload={card.upload}
          />
        ))}
      </div>
    </div>
  );
}
