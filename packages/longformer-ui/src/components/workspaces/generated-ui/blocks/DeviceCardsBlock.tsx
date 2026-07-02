import { useMemo, useState } from "react";
import { DeviceCard } from "../../../primitives/DeviceCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock, GeneratedDeviceCard } from "../types";

function initialProgressById(cards: GeneratedDeviceCard[]) {
  return Object.fromEntries(cards.map((card) => [card.id, card.progress ?? 0]));
}

function formatStatus(card: GeneratedDeviceCard, progress: number) {
  if (typeof card.status === "string" && card.status.endsWith("%")) {
    return `${Math.round(progress)}%`;
  }
  return card.status;
}

export function DeviceCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "deviceCards" }> }) {
  const [progressById, setProgressById] = useState(() => initialProgressById(block.cards));
  const cards = useMemo(
    () =>
      block.cards.map((card) => ({
        ...card,
        progress: progressById[card.id] ?? card.progress ?? 0,
      })),
    [block.cards, progressById],
  );

  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.deviceCardGrid}>
        {cards.map((card) => (
          <DeviceCard
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            status={formatStatus(card, card.progress)}
            statusTone={card.statusTone}
            icon={card.icon}
            iconTone={card.iconTone}
            progress={card.progress}
            progressSide={card.progressSide}
            onProgressChange={(next) => setProgressById((prev) => ({ ...prev, [card.id]: next }))}
          />
        ))}
      </div>
    </div>
  );
}
