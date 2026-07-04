/** Tailwind class map — converted from OmronCalculatorPad.module.css */
const styles: Record<string, string> = {
  body: "flex flex-col gap-lf-4 p-lf-5 bg-[var(--omron-body)]",
  brand: "absolute right-[var(--lf-space-5)] bottom-[var(--lf-space-4)] p-[3px_var(--lf-space-3)] rounded-lf-pill bg-[var(--omron-brand-pill-bg)] text-[12px] font-bold [letter-spacing:0.04em] text-[var(--omron-brand-text)]",
  display: "min-h-[48px] font-sans text-[32px] [font-variant-numeric:tabular-nums] [letter-spacing:0.1em] text-right text-[var(--omron-display-text)] [text-shadow:0_0_10px_var(--omron-display-glow)] overflow-hidden text-ellipsis whitespace-nowrap",
  displayLabelActive: "text-[var(--omron-display-text)] [text-shadow:0_0_6px_var(--omron-display-glow)]",
  displayLabels: "flex items-center justify-between text-[10px] font-semibold [letter-spacing:0.06em] uppercase text-[var(--omron-display-label)]",
  displayWrap: "flex flex-col gap-lf-2 p-[var(--lf-space-3)_var(--lf-space-4)] rounded-lf-sm bg-[var(--omron-display-recess)] shadow-[inset_0_2px_8px_rgba(0,_0,_0,_0.65)]",
  grid: "grid grid-cols-[repeat(5,_1fr)] gap-lf-3",
  header: "relative [flex-shrink:0] min-h-[110px] p-lf-5 bg-[var(--omron-orange)]",
  key: "appearance-none inline-flex items-center justify-center aspect-[1] w-full min-h-0 p-lf-2 border-none rounded-full font-sans text-lf-base font-semibold leading-none cursor-pointer transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] shadow-[0_3px_0_rgba(0,_0,_0,_0.35),_inset_0_1px_0_rgba(255,_255,_255,_0.18)] active:[transform:translateY(2px)] active:shadow-[0_1px_0_rgba(0,_0,_0,_0.35),_inset_0_1px_0_rgba(255,_255,_255,_0.1)]",
  keyFunction: "bg-[var(--omron-key-function-bg)] text-[var(--omron-key-function-text)] shadow-[0_3px_0_rgba(0,_0,_0,_0.2),_inset_0_1px_0_rgba(255,_255,_255,_0.65)] active:shadow-[0_1px_0_rgba(0,_0,_0,_0.2),_inset_0_1px_0_rgba(255,_255,_255,_0.35)]",
  keyNumeric: "bg-[var(--omron-key-numeric-bg)] text-[var(--omron-key-numeric-text)] border border-solid border-[rgba(255,_255,_255,_0.08)]",
  pad: "flex flex-col w-[min(100%,_340px)] rounded-[24px] overflow-hidden bg-[var(--omron-body)] shadow-[0_10px_28px_rgba(0,_0,_0,_0.35)]",
};
export default styles;
