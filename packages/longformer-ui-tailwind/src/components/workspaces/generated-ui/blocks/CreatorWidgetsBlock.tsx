import { CreatorWidget, type CreatorWidgetProps } from "../../../primitives/CreatorWidget";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function CreatorWidgetsBlock({ block }: { block: Extract<GeneratedBlock, { type: "creatorWidgets" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.creatorWidgetGrid}>
        {block.widgets.map((widget) => {
          const { id, ...props } = widget;
          return <CreatorWidget key={id} {...(props as CreatorWidgetProps)} />;
        })}
      </div>
    </div>
  );
}
