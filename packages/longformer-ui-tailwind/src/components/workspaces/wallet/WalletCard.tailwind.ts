/** Tailwind class map — converted from WalletCard.module.css */
const styles: Record<string, string> = {
  amount: "[flex-shrink:0] ml-auto text-[clamp(1.0625rem,_3.2vw,_1.25rem)] font-bold text-[#111] [letter-spacing:-0.02em] [font-variant-numeric:tabular-nums]",
  avatar: "[flex-shrink:0] shadow-[0_2px_8px_rgba(0,_0,_0,_0.12)]",
  card: "[--wallet-card-height:168px] [--wallet-card-step:88px] [--wallet-card-expanded-height:236px] relative w-full h-[var(--wallet-card-height)] min-h-[var(--wallet-card-height)] mt-[calc(var(--wallet-card-step)_-_var(--wallet-card-height))] rounded-[32px] overflow-hidden bg-[var(--wallet-card-color,_var(--lf-surface-2))] shadow-[0_1px_2px_rgba(0,_0,_0,_0.04),_0_8px_24px_rgba(0,_0,_0,_0.08)] transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] first:mt-0 focus-visible:[outline:2px_solid_rgba(0,_0,_0,_0.35)] focus-visible:[outline-offset:-4px]",
  cardBody: "flex flex-col h-full min-h-0 bg-[inherit]",
  cardDimmed: "[filter:saturate(0.82)_brightness(0.96)]",
  cardSelect: "flex flex-1 flex-col items-stretch gap-lf-2 w-full min-h-0 p-[var(--lf-space-4)_var(--lf-space-5)] pr-[calc(var(--lf-space-5)_+_36px)] border-none rounded-[inherit] bg-transparent text-left cursor-pointer text-[inherit] focus-visible:outline-none",
  cardSelected: "h-[var(--wallet-card-expanded-height)] min-h-[var(--wallet-card-expanded-height)] shadow-[0_4px_8px_rgba(0,_0,_0,_0.08),_0_20px_40px_rgba(0,_0,_0,_0.16)]",
  category: "inline-flex items-center p-[2px_8px] rounded-lf-pill text-[10px] font-bold [letter-spacing:0.06em] uppercase text-[rgba(0,_0,_0,_0.5)] bg-[rgba(255,_255,_255,_0.32)]",
  date: "min-w-0 text-lf-xs font-medium text-[rgba(0,_0,_0,_0.42)] overflow-hidden text-ellipsis whitespace-nowrap",
  expanded: "flex flex-col gap-lf-3 p-[var(--lf-space-3)_var(--lf-space-5)_var(--lf-space-4)] border-t border-lf-divider bg-[rgba(255,_255,_255,_0.12)]",
  footer: "flex items-baseline justify-between gap-lf-3 mt-auto pt-lf-1",
  merchant: "m-0 min-w-0 text-[clamp(1.0625rem,_3.5vw,_1.3125rem)] font-bold leading-[1.15] text-[#111] [letter-spacing:-0.02em] overflow-hidden text-ellipsis whitespace-nowrap",
  meta: "flex items-center gap-lf-2 min-w-0",
  note: "m-0 text-lf-sm leading-[1.45] text-[rgba(0,_0,_0,_0.58)]",
  quickAction: "inline-flex items-center justify-center gap-[6px] min-w-0 p-[8px_10px] border-none rounded-lf-md font-sans text-lf-xs font-semibold text-[rgba(0,_0,_0,_0.72)] bg-[rgba(255,_255,_255,_0.42)] cursor-pointer hover:bg-[rgba(255,_255,_255,_0.68)]",
  quickActions: "grid grid-cols-[repeat(3,_minmax(0,_1fr))] gap-lf-2",
  settingsButton: "w-[32px] h-[32px] min-h-[32px] rounded-lf-pill bg-[rgba(255,_255,_255,_0.55)] text-[rgba(0,_0,_0,_0.72)] hover:enabled:bg-[rgba(255,_255,_255,_0.72)] hover:enabled:text-[#111]",
  settingsWrap: "absolute top-[var(--lf-space-3)] right-[var(--lf-space-3)] z-[2]",
};
export default styles;
