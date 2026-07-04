/** Tailwind class map — converted from ContextDiffPane.module.css */
const styles: Record<string, string> = {
  content: "whitespace-pre [overflow-x:auto]",
  diff: "m-0 font-mono text-[11px] leading-[1.55]",
  empty: "h-full flex flex-col items-center justify-center gap-lf-1 p-lf-4 text-center text-lf-text-secondary",
  "empty p": "m-0 font-semibold text-lf-text-primary",
  "empty span": "text-lf-sm text-lf-text-tertiary",
  fileHeader: "[flex-shrink:0] p-[var(--lf-space-2)_var(--lf-space-3)] text-lf-xs font-mono text-lf-text-secondary border-b border-lf-divider whitespace-nowrap overflow-hidden text-ellipsis",
  gutterNew: "text-right text-lf-text-tertiary select-none",
  gutterOld: "text-right text-lf-text-tertiary select-none",
  line: "grid grid-cols-[2.5ch_2.5ch_1.5ch_1fr] gap-lf-1 [padding-inline:var(--lf-space-2)] text-lf-text-secondary",
  lineAdd: "bg-[color-mix(in_srgb,_var(--lf-success)_12%,_transparent)] text-lf-text-primary",
  lineHeader: "text-lf-text-tertiary [padding-block:var(--lf-space-1)]",
  lineRemove: "bg-[color-mix(in_srgb,_var(--lf-danger)_12%,_transparent)] text-lf-text-primary",
  marker: "select-none",
  pane: "h-full flex flex-col min-h-0 min-w-0 bg-lf-surface-1",
  scroll: "flex-1 min-h-0",
};
export default styles;
