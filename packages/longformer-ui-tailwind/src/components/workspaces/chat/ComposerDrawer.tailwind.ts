/** Tailwind class map — converted from ComposerDrawer.module.css */
const styles: Record<string, string> = {
  body: "grid grid-rows-[0fr] transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  bodyClip: "overflow-hidden min-h-0",
  bodyContent: "p-[0_var(--lf-space-3)_var(--lf-space-3)]",
  bodyOpen: "grid-rows-[1fr]",
  bodyScroll: "overflow-y-auto",
  chevron: "inline-flex text-lf-text-tertiary transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  chevronClosed: "[transform:rotate(-90deg)]",
  drawer: "flex flex-col min-w-0 bg-lf-surface-1 border border-solid border-lf-border-default [border-bottom:none] rounded-[var(--lf-radius-lg)_var(--lf-radius-lg)_0_0] pb-[var(--lf-radius-lg)]",
  drawerDanger: "border-[color-mix(in_srgb,_var(--lf-danger)_35%,_var(--lf-border-default))]",
  drawerDanger_trigger: "text-lf-danger",
  drawerStackFollows: "relative mt-[calc(-1_*_var(--lf-radius-lg))]",
  header: "flex items-center min-w-0",
  headerActions: "inline-flex items-center gap-lf-1 [flex-shrink:0] pr-lf-2",
  title: "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap",
  trigger: "flex items-center gap-lf-2 flex-1 min-w-0 h-[36px] p-[0_var(--lf-space-3)] bg-transparent border-none rounded-[calc(var(--lf-radius-lg)_-_1px)_calc(var(--lf-radius-lg)_-_1px)_var(--lf-radius-sm)_var(--lf-radius-sm)] text-lf-text-primary text-lf-md font-medium text-left cursor-pointer hover:bg-lf-surface-2",
};
export default styles;
