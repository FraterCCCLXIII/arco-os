/** Tailwind class map — converted from MiniCalendar.module.css */
const styles: Record<string, string> = {
  calendar: "flex flex-col gap-lf-2",
  day: "relative appearance-none border-none bg-transparent flex items-center justify-center w-full aspect-[1] rounded-lf-pill text-lf-text-secondary text-lf-sm cursor-pointer hover:bg-lf-surface-3",
  dayNumber: "leading-none",
  dayOutside: "text-lf-text-disabled",
  days: "grid grid-cols-[repeat(7,_1fr)] gap-y-[2px]",
  daySelected: "bg-lf-accent-muted text-lf-text-primary font-semibold",
  dayToday: "bg-lf-accent text-lf-text-on-accent font-semibold hover:bg-lf-accent-hover",
  dayToday_dot: "opacity-[0.85]",
  dot: "absolute bottom-[3px] left-[50%] w-[3px] h-[3px] rounded-full bg-current opacity-[0.6] [transform:translateX(-50%)]",
  header: "flex items-center justify-between gap-lf-2",
  nav: "flex items-center gap-[2px]",
  titleButton: "appearance-none border-none bg-transparent p-0 text-lf-sm font-semibold text-lf-text-primary cursor-pointer rounded-lf-sm disabled:cursor-default enabled:hover:text-lf-accent",
  weekdayCell: "text-center text-[11px] font-semibold text-lf-text-tertiary",
  weekdayRow: "grid grid-cols-[repeat(7,_1fr)]",
};
export default styles;
