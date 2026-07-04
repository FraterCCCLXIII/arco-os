/** Tailwind class map — converted from DayGrid.module.css */
const styles: Record<string, string> = {
  allDayEvents: "flex flex-col gap-[2px] p-[var(--lf-space-2)_var(--lf-space-3)]",
  allDayLabel: "p-[var(--lf-space-2)_var(--lf-space-1)] text-[10px] text-lf-text-tertiary text-right border-r border-lf-divider",
  allDayRow: "[flex-shrink:0] grid grid-cols-[56px_minmax(0,_1fr)] border-b border-lf-divider",
  body: "flex-1 min-h-0 flex items-start overflow-auto",
  dayColumn: "relative flex-1 min-w-0 min-h-[calc(var(--hour-span,_24)_*_56px)]",
  grid: "flex flex-col h-full min-h-0",
  header: "[flex-shrink:0] p-[var(--lf-space-4)_var(--lf-space-5)_var(--lf-space-3)] border-b border-lf-divider",
  hourCell: "[flex-shrink:0] h-[56px] border-b border-lf-divider",
  itemSlot: "absolute z-[1] min-h-[28px]",
  nowBadge: "absolute left-[-52px] top-[-10px] p-[2px_6px] rounded-lf-sm bg-lf-accent text-lf-text-on-accent text-[10px] font-semibold",
  nowLine: "absolute left-0 right-0 z-[2] h-[2px] bg-lf-accent pointer-events-none before:before:[content:\"\"] before:before:absolute before:before:left-[-4px] before:before:top-[-4px] before:before:w-[10px] before:before:h-[10px] before:before:rounded-full before:before:bg-lf-accent",
  timeColumn: "[flex-shrink:0] w-[56px] min-h-[calc(var(--hour-span,_24)_*_56px)] border-r border-lf-divider",
  timeLabel: "[flex-shrink:0] h-[56px] p-[0_var(--lf-space-1)] text-[10px] text-lf-text-tertiary text-right [transform:translateY(-8px)]",
  title: "text-lf-lg font-semibold text-lf-text-primary",
  weekday: "mt-[2px] text-lf-sm text-lf-text-tertiary",
};
export default styles;
