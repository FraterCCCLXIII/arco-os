/** Tailwind class map — converted from MonthGrid.module.css */
const styles: Record<string, string> = {
  day: "flex flex-col gap-[3px] min-w-0 min-h-[90px] p-[var(--lf-space-1)_var(--lf-space-1)_var(--lf-space-2)] border-r border-lf-divider border-b border-lf-divider bg-transparent cursor-pointer",
  dayEvents: "flex flex-col gap-[2px] min-w-0",
  dayNumberButton: "inline-flex items-center justify-center self-start w-[22px] h-[22px] [flex-shrink:0] border-none rounded-lf-pill bg-transparent text-lf-text-secondary text-lf-sm cursor-pointer hover:bg-lf-surface-3",
  dayNumberToday: "bg-lf-accent text-lf-text-on-accent font-semibold hover:bg-lf-accent-hover",
  dayOutside: "bg-lf-surface-sunken",
  dayOutside_dayNumberButton: "text-lf-text-disabled",
  dayOverflow: "p-[0_var(--lf-space-2)] text-lf-xs text-lf-text-tertiary",
  days: "flex-1 min-h-0 grid grid-cols-[repeat(7,_1fr)] [grid-auto-rows:1fr] overflow-y-auto",
  daySelected: "bg-lf-accent-muted",
  grid: "flex flex-col h-full min-h-0",
  weekdayCell: "p-[var(--lf-space-2)_var(--lf-space-2)] text-lf-xs font-semibold text-lf-text-tertiary uppercase [letter-spacing:0.03em] text-center",
  weekdayRow: "[flex-shrink:0] grid grid-cols-[repeat(7,_1fr)] border-b border-lf-divider",
};
export default styles;
