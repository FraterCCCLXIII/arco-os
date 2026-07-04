/** Tailwind class map — converted from CalendarScheduleCard.module.css */
const styles: Record<string, string> = {
  card: "flex flex-col gap-lf-3",
  day: "inline-flex items-center justify-center aspect-[1] rounded-lf-md text-lf-sm text-lf-text-primary",
  dayGrid: "grid grid-cols-[repeat(7,_minmax(0,_1fr))] gap-lf-1",
  dayMuted: "text-lf-text-tertiary",
  daySelected: "bg-lf-text-primary text-lf-surface-1 font-bold",
  event: "p-lf-3 rounded-lf-md bg-lf-surface-2",
  "event-accent": "bg-lf-accent-muted",
  "event-success": "bg-lf-success-muted",
  "event-warning": "bg-lf-warning-muted",
  events: "grid grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))] gap-lf-2 mt-lf-1",
  eventTime: "mt-lf-1 text-lf-xs text-lf-text-tertiary",
  eventTitle: "text-lf-sm font-semibold text-lf-text-primary",
  month: "text-lf-md font-bold text-lf-text-primary",
  weekday: "text-center text-lf-xs font-semibold text-lf-text-tertiary",
  weekdays: "grid grid-cols-[repeat(7,_minmax(0,_1fr))] gap-lf-1",
};
export default styles;
