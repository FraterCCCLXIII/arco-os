/** Tailwind class map — converted from RichTextEditor.module.css */
const styles: Record<string, string> = {
  editor: "min-h-[120px] max-h-[280px] overflow-y-auto p-[var(--lf-space-3)_var(--lf-space-4)] text-lf-text-primary font-sans text-lf-base leading-[var(--lf-line-height-normal)] outline-none before:before:[content:attr(data-placeholder)] before:before:text-lf-text-tertiary before:before:pointer-events-none",
  "editor a": "text-lf-accent [text-decoration:underline]",
  "editor blockquote": "m-[0_0_var(--lf-space-2)] last:mb-0 pl-lf-3 [border-left:3px_solid_var(--lf-divider)] text-lf-text-secondary",
  "editor code": "p-[1px_4px] rounded-lf-sm bg-lf-surface-3 font-mono text-[0.92em]",
  "editor h1": "m-[0_0_var(--lf-space-2)] last:mb-0 text-lf-xl font-bold",
  "editor h2": "m-[0_0_var(--lf-space-2)] last:mb-0 text-lf-lg font-bold",
  "editor h3": "m-[0_0_var(--lf-space-2)] last:mb-0 text-lf-base font-semibold",
  "editor ol": "m-[0_0_var(--lf-space-2)] last:mb-0 pl-lf-5",
  "editor p": "m-[0_0_var(--lf-space-2)] last:mb-0",
  "editor ul": "m-[0_0_var(--lf-space-2)] last:mb-0 pl-lf-5",
  footer: "flex items-center justify-between gap-lf-2 p-[var(--lf-space-2)_var(--lf-space-3)] border-t border-lf-divider bg-lf-surface-2",
  footerActions: "flex items-center gap-lf-1",
  shell: "flex flex-col border border-solid border-lf-border-default rounded-lf-md bg-lf-surface-1 overflow-hidden",
};
export default styles;
