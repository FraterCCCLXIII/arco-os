import { ProfileGridCard } from "../../../primitives/ProfileGridCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function ProfileGridCardsBlock({
  block,
}: {
  block: Extract<GeneratedBlock, { type: "profileGridCards" }>;
}) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <ProfileGridCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
