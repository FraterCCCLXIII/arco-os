import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../../utils/cx";
import styles from "./Card.tailwind";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { interactive = false, padding = "md", className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cx(
        styles.card,
        interactive && styles.interactive,
        padding !== "md" && styles[`padding-${padding}`],
        interactive && "lf-focusable",
        className
      )}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      {...rest}
    />
  );
});
