import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Card } from "../Card";
import styles from "./ColorPaletteCard.tailwind";

export interface ColorSwatch {
  color: string;
  label?: ReactNode;
}

export interface ColorPaletteCardProps {
  swatches: ColorSwatch[];
  className?: string;
}

/** Horizontal palette strip — rounded swatches for theme or brand previews. */
export function ColorPaletteCard({ swatches, className }: ColorPaletteCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.row}>
        {swatches.map((swatch, index) => (
          <div key={index} className={styles.swatchWrap}>
            <span className={styles.swatch} style={{ background: swatch.color }} aria-hidden="true" />
            {swatch.label && <span className={styles.label}>{swatch.label}</span>}
          </div>
        ))}
      </div>
    </Card>
  );
}
