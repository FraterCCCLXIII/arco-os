import { ExpenseCard } from "../../../primitives/ExpenseCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function ExpenseCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "expenseCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.expenseCardList}>
        {block.cards.map((card) => (
          <ExpenseCard
            key={card.id}
            tone={card.tone}
            category={card.category}
            merchant={card.merchant}
            amount={card.amount}
            avatarName={card.avatarName}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}
