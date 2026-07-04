/** Tailwind class map — converted from CalculatorPad.module.css */
const styles: Record<string, string> = {
  brand: "flex items-center justify-between p-[0_var(--lf-space-1)] min-h-[22px]",
  brandMark: "text-[11px] font-bold [letter-spacing:0.06em] text-[var(--calculator-brand-gold)]",
  brandName: "text-[13px] font-semibold [letter-spacing:0.14em] uppercase text-[var(--calculator-brand-gold)]",
  display: "[flex-shrink:0] min-h-[56px] p-[var(--lf-space-3)_var(--lf-space-4)] rounded-lf-sm bg-[var(--calculator-display-bg)] [border:2px_inset_rgba(0,_0,_0,_0.45)] font-sans text-[32px] [font-variant-numeric:tabular-nums] [letter-spacing:0.08em] text-right text-[var(--calculator-display-text)] [text-shadow:0_0_10px_var(--calculator-display-glow)] overflow-hidden text-ellipsis whitespace-nowrap",
  grid: "grid grid-cols-[repeat(4,_1fr)] gap-lf-3",
  key: "appearance-none inline-flex items-center justify-center w-full aspect-[1] min-h-0 p-lf-3 border-none rounded-[4px] font-sans text-lf-base font-medium leading-none text-[var(--calculator-key-text)] cursor-pointer transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] shadow-[0_4px_0_rgba(0,_0,_0,_0.28),_inset_0_1px_0_rgba(255,_255,_255,_0.45)] active:[transform:translateY(2px)] active:shadow-[0_2px_0_rgba(0,_0,_0,_0.28),_inset_0_1px_0_rgba(255,_255,_255,_0.25)]",
  keyEquals: "bg-[var(--calculator-key-equals)] text-[var(--calculator-key-equals-text)] shadow-[0_4px_0_rgba(0,_0,_0,_0.35),_inset_0_1px_0_rgba(255,_255,_255,_0.28)] active:shadow-[0_2px_0_rgba(0,_0,_0,_0.35),_inset_0_1px_0_rgba(255,_255,_255,_0.18)]",
  keyFunction: "bg-[var(--calculator-key-function)]",
  keyNumeric: "bg-[var(--calculator-key-numeric)]",
  keyOperator: "bg-[var(--calculator-key-function)]",
  keypad: "flex flex-col gap-lf-3 p-lf-4 rounded-lf-md bg-[var(--calculator-keypad-bg)] shadow-[inset_0_2px_8px_rgba(0,_0,_0,_0.55)]",
  keyRowSpan: "row-[span_2]",
  keySpacer: "block w-full aspect-[1]",
  pad: "flex flex-col gap-lf-4 w-[min(100%,_340px)] p-lf-5 rounded-lf-xl bg-[var(--calculator-case)] shadow-[inset_0_1px_0_rgba(255,_255,_255,_0.35),_0_10px_28px_rgba(0,_0,_0,_0.28)]",
};
export default styles;
