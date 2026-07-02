import { ColorPaletteCard } from "../../../primitives/ColorPaletteCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function ColorPaletteCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "colorPaletteCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <ColorPaletteCard key={card.id} swatches={card.swatches} />
        ))}
      </div>
    </div>
  );
}
