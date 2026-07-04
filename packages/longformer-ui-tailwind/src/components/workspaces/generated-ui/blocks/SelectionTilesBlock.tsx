import { SelectionTile } from "../../../primitives/SelectionTile";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

function noop() {}

export function SelectionTilesBlock({ block }: { block: Extract<GeneratedBlock, { type: "selectionTiles" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.selectionTileGrid}>
        {block.tiles.map((tile) => (
          <SelectionTile
            key={tile.id}
            label={tile.label}
            selected={tile.selected}
            size={tile.size}
            onClick={noop}
          />
        ))}
      </div>
    </div>
  );
}
