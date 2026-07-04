import { CardCollection } from "../../../primitives/CardCollection";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function CardCollectionBlock({ block }: { block: Extract<GeneratedBlock, { type: "cardCollection" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      {block.subtitle && <div className={styles.blockSubtitle}>{block.subtitle}</div>}
      <CardCollection layout={block.layout} items={block.items} itemHeight={block.itemHeight} />
    </div>
  );
}
