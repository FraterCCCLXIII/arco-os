/**
 * PromptChips — horizontal quick-start suggestions with edge fades that appear
 * when the row overflows, giving a subtle cue that more chips are off-screen.
 */
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { cx } from "../../../utils/cx";
import { Chip } from "../../primitives/Chip";
import { ScrollArea } from "../../primitives/ScrollArea";
import type { PromptChipItem } from "./types";
import styles from "./PromptChips.module.css";

export interface PromptChipsProps {
  items: PromptChipItem[];
  onSelect: (item: PromptChipItem) => void;
}

/** Horizontally-scrolling row of quick-start prompt suggestions. */
export function PromptChips({ items, onSelect }: PromptChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const overflow = el.scrollWidth > el.clientWidth + 1;
    setShowLeftFade(overflow && el.scrollLeft > 4);
    setShowRightFade(overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateFades();

    el.addEventListener("scroll", updateFades, { passive: true });
    const observer = new ResizeObserver(updateFades);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);

    return () => {
      el.removeEventListener("scroll", updateFades);
      observer.disconnect();
    };
  }, [items, updateFades]);

  return (
    <div className={styles.wrapper}>
      <span className={cx(styles.fade, styles.fadeLeft, showLeftFade && styles.fadeVisible)} aria-hidden="true" />
      <span className={cx(styles.fade, styles.fadeRight, showRightFade && styles.fadeVisible)} aria-hidden="true" />
      <ScrollArea ref={scrollRef} direction="horizontal" className={styles.scroller}>
        <div className={styles.row}>
          {items.map((item) => (
            <Chip key={item.id} icon={item.icon} onClick={() => onSelect(item)}>
              {item.label}
            </Chip>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
