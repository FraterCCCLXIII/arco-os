import { Card } from "../../../primitives/Card";
import { Badge } from "../../../primitives/Badge";
import { Icon } from "../../../../icons";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function CardGridBlock({ block }: { block: Extract<GeneratedBlock, { type: "cardGrid" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.cardGrid}>
        {block.cards.map((card) => (
          <Card key={card.id} interactive className={styles.card}>
            <div className={styles.cardHead}>
              {card.icon && (
                <span className={styles.cardIcon}>
                  <Icon name={card.icon} size={15} />
                </span>
              )}
              {card.badge && <Badge tone="accent">{card.badge}</Badge>}
            </div>
            <div className={styles.cardTitle}>{card.title}</div>
            {card.description && <div className={styles.cardDescription}>{card.description}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}
