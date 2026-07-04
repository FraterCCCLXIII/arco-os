/** Tailwind class map — converted from YearGrid.module.css */
const styles: Record<string, string> = {
  day: "appearance-none border-none bg-transparent flex items-center justify-center w-full aspect-[1] rounded-lf-pill text-lf-text-secondary text-lf-xs cursor-pointer hover:bg-lf-surface-3",
  dayHasEvents: "font-semibold text-lf-text-primary",
  dayOutside: "text-lf-text-disabled",
  days: "grid grid-cols-[repeat(7,_1fr)] gap-y-[2px]",
  daySelected: "bg-lf-accent-muted text-lf-text-primary font-semibold",
  dayToday: "bg-lf-accent text-lf-text-on-accent font-semibold hover:bg-lf-accent-hover",
  grid: "h-full min-h-0 overflow-auto p-[var(--lf-space-4)_var(--lf-space-5)_var(--lf-space-5)]",
  month: "flex flex-col gap-lf-2 min-w-0",
  months: "grid grid-cols-[repeat(4,_minmax(0,_1fr))] gap-[var(--lf-space-6)_var(--lf-space-5)] grid-cols-[repeat(3,_minmax(0,_1fr))] grid-cols-[repeat(2,_minmax(0,_1fr))]",
  monthTitle: "appearance-none border-none bg-transparent p-0 text-lf-sm font-semibold text-lf-accent text-left cursor-pointer rounded-lf-sm hover:text-lf-accent-hover",
  weekdayCell: "text-center text-[10px] font-semibold text-lf-text-tertiary",
  weekdayRow: "grid grid-cols-[repeat(7,_1fr)]",
};
export default styles;
