/** Tailwind class map — converted from WeekGrid.module.css */
const styles: Record<string, string> = {
  body: "flex-1 min-h-0 flex overflow-auto",
  dayColumn: "relative border-r border-lf-divider last:[border-right:none]",
  dayColumns: "relative flex-1 grid grid-cols-[repeat(6,_minmax(0,_1fr))] min-w-0",
  dayHeader: "flex flex-col items-center gap-[2px] p-[var(--lf-space-2)_var(--lf-space-1)] border-r border-lf-divider last:[border-right:none]",
  dayHeaderToday: "bg-lf-accent rounded-[var(--lf-radius-md)_var(--lf-radius-md)_0_0]",
  dayHeaderToday_dayLabel: "text-lf-text-on-accent",
  dayHeaderToday_dayNumber: "text-lf-text-on-accent",
  dayLabel: "text-[10px] font-medium text-lf-text-tertiary uppercase [letter-spacing:0.04em]",
  dayNumber: "text-lf-sm font-semibold text-lf-text-primary",
  grid: "flex flex-col h-full min-h-0",
  headerRow: "grid grid-cols-[56px_repeat(6,_minmax(0,_1fr))] [flex-shrink:0] border-b border-lf-divider",
  hourCell: "h-[56px] border-b border-lf-divider",
  itemSlot: "absolute left-[4px] right-[4px] z-[1] min-h-[28px]",
  nowBadge: "absolute left-[-52px] top-[-10px] p-[2px_6px] rounded-lf-sm bg-lf-accent text-lf-text-on-accent text-[10px] font-semibold",
  nowLine: "absolute left-0 right-0 z-[2] h-[2px] bg-lf-accent pointer-events-none before:before:[content:\"\"] before:before:absolute before:before:left-[-4px] before:before:top-[-4px] before:before:w-[10px] before:before:h-[10px] before:before:rounded-full before:before:bg-lf-accent",
  timeColumn: "[flex-shrink:0] w-[56px] border-r border-lf-divider",
  timeGutter: "border-right border-lf-divider",
  timeLabel: "h-[56px] p-[0_var(--lf-space-1)] text-[10px] text-lf-text-tertiary text-right [transform:translateY(-8px)]",
};
export default styles;
