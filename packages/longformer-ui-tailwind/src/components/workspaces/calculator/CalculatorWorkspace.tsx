import { useState } from "react";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { CalculatorPad, OmronCalculatorPad } from "../../primitives/CalculatorPad";
import { Chip } from "../../primitives/Chip";
import type { CalculatorVariant } from "./types";
import styles from "./CalculatorWorkspace.tailwind";

export interface CalculatorWorkspaceProps {
  variant?: CalculatorVariant;
  defaultVariant?: CalculatorVariant;
  onVariantChange?: (variant: CalculatorVariant) => void;
  className?: string;
}

const VARIANTS: { id: CalculatorVariant; label: string }[] = [
  { id: "datamath", label: "Datamath" },
  { id: "omron", label: "Omron 86" },
];

/** Calculator app with switchable retro keypad skins. */
export function CalculatorWorkspace({
  variant: controlledVariant,
  defaultVariant = "datamath",
  onVariantChange,
  className,
}: CalculatorWorkspaceProps) {
  const [internalVariant, setInternalVariant] = useState<CalculatorVariant>(defaultVariant);
  const variant = controlledVariant ?? internalVariant;

  function handleVariantChange(next: CalculatorVariant) {
    if (onVariantChange) onVariantChange(next);
    else setInternalVariant(next);
  }

  return (
    <div className={cx(styles.workspace, className)} aria-label="Calculator">
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <Icon name="grid" size={20} />
          <div>
            <div className={styles.title}>Calculator</div>
            <div className={styles.subtitle}>
              {variant === "datamath" ? "TI Datamath · LED display" : "Omron 86 · VFD display"}
            </div>
          </div>
        </div>

        <div className={styles.variantChips}>
          {VARIANTS.map((item) => (
            <Chip
              key={item.id}
              active={variant === item.id}
              onClick={() => handleVariantChange(item.id)}
            >
              {item.label}
            </Chip>
          ))}
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.calculatorWrap}>
          {variant === "datamath" ? <CalculatorPad /> : <OmronCalculatorPad />}
        </div>
      </div>
    </div>
  );
}

export type { CalculatorVariant } from "./types";
