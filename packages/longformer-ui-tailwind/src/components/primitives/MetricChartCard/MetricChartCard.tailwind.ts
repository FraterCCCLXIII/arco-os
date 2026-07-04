/** Tailwind class map — converted from MetricChartCard.module.css */
const styles: Record<string, string> = {
  card: "flex flex-col gap-lf-3",
  change: "inline-flex items-center gap-lf-1 text-lf-sm font-medium text-lf-success",
  changeCaption: "text-lf-text-tertiary font-normal",
  changeDown: "text-lf-danger",
  label: "text-lf-sm text-lf-text-tertiary",
  sparkline: "w-full h-[48px] rounded-lf-md",
  sparklineArea: "[fill:var(--chart-fill)]",
  sparklineDown: "[--chart-stroke:var(--lf-danger)] [--chart-fill:var(--lf-danger-muted)]",
  sparklineLine: "[stroke:var(--chart-stroke)] [stroke-width:2] [vector-effect:non-scaling-stroke]",
  sparklineUp: "[--chart-stroke:var(--lf-success)] [--chart-fill:var(--lf-success-muted)]",
  timeframes: "flex flex-wrap gap-lf-2",
  value: "text-lf-2xl font-bold text-lf-text-primary leading-[var(--lf-line-height-tight)]",
};
export default styles;
