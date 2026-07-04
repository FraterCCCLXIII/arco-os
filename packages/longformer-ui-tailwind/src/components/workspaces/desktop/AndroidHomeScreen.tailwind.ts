/** Tailwind class map — converted from AndroidHomeScreen.module.css */
const styles: Record<string, string> = {
  appsPage: "flex flex-col p-[var(--lf-space-4)_var(--lf-space-3)_var(--lf-space-3)] overflow-auto",
  carousel: "flex-1 flex w-full min-h-0 [transform:translateX(calc(var(--active-page,_0)_*_-100%))] transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] [touch-action:pan-y]",
  grid: "grid grid-cols-[repeat(4,_minmax(0,_1fr))] gap-[var(--lf-space-3)_var(--lf-space-2)] list-none m-0 p-0",
  icon: "rounded-[18px]",
  label: "text-[0.6875rem] text-center leading-[1.2]",
  page: "[flex-shrink:0] w-full h-full min-h-0",
  pageDot: "inline-flex items-center justify-center w-[24px] h-[16px] p-0 border-none bg-transparent cursor-pointer",
  "pageDot span": "inline-block w-[6px] h-[6px] rounded-full bg-[rgba(255,_255,_255,_0.35)] transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  "pageDotActive span": "bg-[#fff] [transform:scale(1.15)]",
  pagination: "flex justify-center gap-[2px] p-[var(--lf-space-2)_0_var(--lf-space-3)] [flex-shrink:0]",
  screen: "absolute inset-0 z-[2] flex flex-col overflow-hidden bg-[linear-gradient(180deg,_#1b1b1f_0%,_#121214_100%)] text-[#f5f5f7]",
  searchRow: "flex items-center gap-lf-2 p-[var(--lf-space-2)_var(--lf-space-3)] mb-lf-4 rounded-[999px] bg-[rgba(255,_255,_255,_0.08)] text-[0.875rem] text-[rgba(255,_255,_255,_0.62)] [flex-shrink:0]",
  tile: "flex flex-col items-center gap-lf-2 w-full border-none bg-transparent text-[inherit] cursor-pointer",
  widgetColumn: "pt-0",
  widgetPage: "flex flex-col p-[var(--lf-space-4)_var(--lf-space-2)_var(--lf-space-2)]",
};
export default styles;
