import { BatteryStatusCard } from "../../../primitives/BatteryStatusCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function BatteryStatusCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "batteryStatusCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <BatteryStatusCard
            key={card.id}
            percent={card.percent}
            powerMode={card.powerMode}
            timeRemaining={card.timeRemaining}
            tone={card.tone}
          />
        ))}
      </div>
    </div>
  );
}
