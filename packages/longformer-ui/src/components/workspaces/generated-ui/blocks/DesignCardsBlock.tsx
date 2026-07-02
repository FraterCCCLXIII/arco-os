import { DesignCard, type DesignCardProps } from "../../../primitives/DesignCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function DesignCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "designCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.designCardGrid}>
        {block.cards.map((card) => {
          const { id, ...props } = card;
          return <DesignCard key={id} {...(props as DesignCardProps)} />;
        })}
      </div>
    </div>
  );
}
