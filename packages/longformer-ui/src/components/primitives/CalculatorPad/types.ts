export type CalculatorKeyVariant = "numeric" | "function" | "operator" | "equals";

export interface CalculatorKeyDef {
  label: string;
  value: string;
  variant: CalculatorKeyVariant;
  rowSpan?: number;
}

/** Datamath-style 4×5 keypad — column 4 stacks C, −, +, and =. */
export const CALCULATOR_KEYS: (CalculatorKeyDef | null)[][] = [
  [
    { label: "CE", value: "ce", variant: "function" },
    { label: "÷", value: "/", variant: "operator" },
    { label: "×", value: "*", variant: "operator" },
    { label: "C", value: "c", variant: "function" },
  ],
  [
    { label: "7", value: "7", variant: "numeric" },
    { label: "8", value: "8", variant: "numeric" },
    { label: "9", value: "9", variant: "numeric" },
    { label: "−", value: "-", variant: "operator" },
  ],
  [
    { label: "4", value: "4", variant: "numeric" },
    { label: "5", value: "5", variant: "numeric" },
    { label: "6", value: "6", variant: "numeric" },
    { label: "+", value: "+", variant: "operator" },
  ],
  [
    { label: "1", value: "1", variant: "numeric" },
    { label: "2", value: "2", variant: "numeric" },
    { label: "3", value: "3", variant: "numeric" },
    { label: "+", value: "+", variant: "operator" },
  ],
  [
    { label: "0", value: "0", variant: "numeric" },
    { label: ".", value: ".", variant: "numeric" },
    null,
    { label: "=", value: "=", variant: "equals" },
  ],
];

/** Omron 86-style 5×4 keypad — circular keys, operators in the right column. */
export const OMRON_CALCULATOR_KEYS: CalculatorKeyDef[][] = [
  [
    { label: "M±", value: "sign", variant: "function" },
    { label: "7", value: "7", variant: "numeric" },
    { label: "8", value: "8", variant: "numeric" },
    { label: "9", value: "9", variant: "numeric" },
    { label: "÷", value: "/", variant: "function" },
  ],
  [
    { label: "%", value: "%", variant: "function" },
    { label: "4", value: "4", variant: "numeric" },
    { label: "5", value: "5", variant: "numeric" },
    { label: "6", value: "6", variant: "numeric" },
    { label: "×", value: "*", variant: "function" },
  ],
  [
    { label: "CE", value: "ce", variant: "function" },
    { label: "1", value: "1", variant: "numeric" },
    { label: "2", value: "2", variant: "numeric" },
    { label: "3", value: "3", variant: "numeric" },
    { label: "−", value: "-", variant: "function" },
  ],
  [
    { label: "C", value: "c", variant: "function" },
    { label: "0", value: "0", variant: "numeric" },
    { label: ".", value: ".", variant: "numeric" },
    { label: "=", value: "=", variant: "function" },
    { label: "+", value: "+", variant: "function" },
  ],
];
