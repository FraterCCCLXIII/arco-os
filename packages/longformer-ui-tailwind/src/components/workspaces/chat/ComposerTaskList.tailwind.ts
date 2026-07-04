/** Tailwind class map — converted from ComposerTaskList.module.css */
const styles: Record<string, string> = {
  completedChevron: "inline-flex text-lf-text-tertiary transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  completedChevronOpen: "[transform:rotate(180deg)]",
  completedToggle: "flex items-center gap-lf-2 w-full min-w-0 p-0 bg-transparent border-none rounded-lf-sm text-lf-text-secondary text-lf-md text-left cursor-pointer hover:text-lf-text-primary",
  indicator: "inline-flex items-center justify-center w-[16px] h-[16px] [flex-shrink:0] mt-[1px] text-lf-text-tertiary",
  indicatorActive: "text-lf-text-secondary [animation:composer-task-spin_1s_linear_infinite] [animation:none]",
  indicatorCompleted: "w-[14px] h-[14px] m-[2px_1px_0] rounded-full bg-lf-success-muted text-lf-success",
  indicatorPending: "w-[14px] h-[14px] m-[2px_1px_0] [border:1.5px_dashed_var(--lf-border-strong)] rounded-full",
  items: "flex flex-col gap-lf-2 m-0 p-0 list-none min-w-0",
  list: "flex flex-col gap-lf-2 min-w-0",
  row: "flex items-start gap-lf-2 min-w-0 text-lf-md text-lf-text-primary",
  rowCompleted: "text-lf-text-secondary",
  rowLabel: "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap",
};
export default styles;
