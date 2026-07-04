import { WidgetRenderer } from "./WidgetRenderer";
import type { WidgetTile } from "./widget-types";
import styles from "./WidgetDesktopView.tailwind";

export type { WidgetContent, WidgetTile } from "./widget-types";

export interface WidgetDesktopViewProps {
  tiles: WidgetTile[];
  className?: string;
}

/** Widget-board desktop — a fixed, non-scrollable grid of single UI components. */
export function WidgetDesktopView({ tiles, className }: WidgetDesktopViewProps) {
  return (
    <div className={className}>
      <div className={styles.grid}>
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={styles.tile}
            style={{
              gridColumn: `span ${tile.colSpan ?? 3}`,
              gridRow: `span ${tile.rowSpan ?? 1}`,
            }}
          >
            <WidgetRenderer content={tile.content} />
          </div>
        ))}
      </div>
    </div>
  );
}
