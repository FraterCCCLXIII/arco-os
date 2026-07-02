import { cx } from "../../../../utils/cx";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function TextBlock({ block }: { block: Extract<GeneratedBlock, { type: "text" }> }) {
  const toneClass =
    block.tone === "heading" ? styles.textHeading : block.tone === "muted" ? styles.textMuted : styles.textDefault;
  return <p className={cx(styles.block, toneClass)}>{block.text}</p>;
}
