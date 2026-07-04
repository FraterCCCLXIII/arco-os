/** Tailwind class map — converted from TaskChecklistCard.module.css */
const styles: Record<string, string> = {
  card: "flex flex-col gap-lf-3",
  check: "inline-flex items-center justify-center w-[18px] h-[18px] rounded-lf-sm [border:1.5px_solid_var(--lf-border-default)] [flex-shrink:0]",
  checkCompleted: "border-lf-accent bg-lf-accent-muted text-lf-accent",
  item: "flex items-center gap-lf-2 text-lf-sm text-lf-text-primary",
  itemCompleted: "text-lf-text-tertiary [text-decoration:line-through]",
  list: "flex flex-col gap-lf-2 m-0 p-0 list-none",
  members: "flex items-center gap-[calc(var(--lf-space-1)_*_-1)]",
  progressBlock: "flex flex-col gap-lf-1",
  progressFill: "block h-full rounded-[inherit] bg-lf-accent",
  progressMeta: "text-lf-xs font-semibold text-lf-accent",
  progressTrack: "h-[6px] rounded-lf-pill bg-lf-surface-3 overflow-hidden",
  title: "text-lf-md font-bold text-lf-text-primary",
};
export default styles;
