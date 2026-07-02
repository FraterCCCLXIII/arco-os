import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "../../../utils/cx";
import { ScrollArea } from "../ScrollArea";
import { DashboardWidgetCard } from "./DashboardWidgetCard";
import type { CardCollectionItem, CardCollectionLayout, CardCollectionProps, CardCollectionSpan } from "./types";
import styles from "./CardCollection.module.css";

const LAYOUT_CLASS: Record<CardCollectionLayout, string> = {
  grid: styles.layoutGrid,
  denseGrid: styles.layoutDenseGrid,
  wideGrid: styles.layoutWideGrid,
  carousel: styles.layoutCarousel,
  snapCarousel: styles.layoutSnapCarousel,
  featured: styles.layoutFeatured,
  bento: styles.layoutBento,
  strip: styles.layoutStrip,
};

const SPAN_CLASS: Record<CardCollectionSpan, string | undefined> = {
  normal: undefined,
  wide: styles.itemWide,
  tall: styles.itemTall,
  hero: styles.itemHero,
};

function CollectionItem({
  item,
  height,
}: {
  item: CardCollectionItem;
  height?: number;
}) {
  return (
    <div
      className={cx(styles.item, item.span && SPAN_CLASS[item.span])}
      style={height ? ({ "--collection-item-height": `${height}px` } as CSSProperties) : undefined}
    >
      <DashboardWidgetCard item={item} bleed={false} />
    </div>
  );
}

function HorizontalCollection({
  layout,
  items,
  height,
}: {
  layout: "carousel" | "snapCarousel" | "strip";
  items: CardCollectionItem[];
  height?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);

  const updateFades = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    setFadeLeft(node.scrollLeft > 4);
    setFadeRight(node.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateFades();
    const node = scrollRef.current;
    if (!node) return;
    node.addEventListener("scroll", updateFades, { passive: true });
    const observer = new ResizeObserver(updateFades);
    observer.observe(node);
    return () => {
      node.removeEventListener("scroll", updateFades);
      observer.disconnect();
    };
  }, [updateFades, items.length]);

  return (
    <div className={styles.carouselWrap}>
      <ScrollArea
        ref={scrollRef}
        direction="horizontal"
        className={cx(styles.carouselScroller, layout === "snapCarousel" && styles.snapScroller)}
      >
        <div className={cx(LAYOUT_CLASS[layout], layout === "strip" && styles.layoutStripInner)}>
          {items.map((item) => (
            <CollectionItem key={item.id} item={item} height={height ?? (layout === "strip" ? 168 : 240)} />
          ))}
        </div>
      </ScrollArea>
      <div className={cx(styles.fade, styles.fadeLeft, fadeLeft && styles.fadeVisible)} aria-hidden="true" />
      <div className={cx(styles.fade, styles.fadeRight, fadeRight && styles.fadeVisible)} aria-hidden="true" />
    </div>
  );
}

/** Responsive grids and horizontal carousels for dashboard widget cards. */
export function CardCollection({ layout, items, itemHeight = 240, className }: CardCollectionProps) {
  if (layout === "carousel" || layout === "snapCarousel" || layout === "strip") {
    return (
      <div className={className}>
        <HorizontalCollection layout={layout} items={items} height={itemHeight} />
      </div>
    );
  }

  return (
    <div className={cx(LAYOUT_CLASS[layout], className)}>
      {items.map((item) => (
        <CollectionItem key={item.id} item={item} height={itemHeight} />
      ))}
    </div>
  );
}
