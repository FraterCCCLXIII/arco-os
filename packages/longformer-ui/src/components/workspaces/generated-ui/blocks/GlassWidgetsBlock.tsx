import { GlassWidget, type GlassWidgetProps } from "../../../primitives/GlassWidget";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function GlassWidgetsBlock({ block }: { block: Extract<GeneratedBlock, { type: "glassWidgets" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.glassWidgetGrid}>
        {block.widgets.map((widget) => {
          const { id, ...props } = widget;
          return <GlassWidget key={id} {...(props as GlassWidgetProps)} />;
        })}
      </div>
    </div>
  );
}
