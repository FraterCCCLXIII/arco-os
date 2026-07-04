/** Tailwind class map — converted from SpentThisMonthCard.module.css */
const styles: Record<string, string> = {
  amount: "text-lf-xl font-[800] leading-[var(--lf-line-height-tight)] text-lf-text-primary",
  barCap: "absolute top-0 left-0 right-0 h-[2px] bg-[rgba(255,_255,_255,_0.92)]",
  barCol: "flex flex-1 flex-col items-center gap-lf-2 h-full min-w-0",
  barFill: "relative w-full rounded-lf-md bg-[repeating-linear-gradient(_-45deg,_var(--spent-fill),_var(--spent-fill)_4px,_var(--spent-fill-stripe)_4px,_var(--spent-fill-stripe)_8px_)]",
  barLabel: "text-lf-xs text-lf-text-tertiary",
  barTrack: "flex flex-col justify-end w-full max-w-[28px] h-full rounded-lf-md bg-[var(--spent-track)] overflow-hidden",
  card: "[--spent-fill:var(--lf-success)] [--spent-fill-stripe:#5aad48] [--spent-track:var(--lf-surface-3)] flex flex-col gap-lf-5",
  chart: "flex items-end gap-lf-2 h-[132px]",
  header: "flex items-start justify-between gap-lf-4",
  headline: "flex flex-wrap items-baseline gap-lf-2 min-w-0",
  label: "text-lf-sm text-lf-text-tertiary",
  trend: "inline-flex items-center gap-[6px] [flex-shrink:0] text-lf-success",
  trendDown: "text-lf-danger",
  trendIcon: "inline-flex items-center justify-center w-[22px] h-[22px] [border:1.5px_solid_currentColor] rounded-full",
  trendValue: "text-lf-sm font-bold",
};
export default styles;
