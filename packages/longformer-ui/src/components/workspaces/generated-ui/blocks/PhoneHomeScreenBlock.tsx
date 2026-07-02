import { PhoneHomeScreen } from "../../../interactions/PhoneHomeScreen";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function PhoneHomeScreenBlock({
  block,
}: {
  block: Extract<GeneratedBlock, { type: "phoneHomeScreen" }>;
}) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.phoneHomeScreenWrap}>
        <PhoneHomeScreen
          pageCount={block.pageCount}
          carrier={block.carrier}
          wallpaperUrl={block.wallpaperUrl}
        />
      </div>
    </div>
  );
}
