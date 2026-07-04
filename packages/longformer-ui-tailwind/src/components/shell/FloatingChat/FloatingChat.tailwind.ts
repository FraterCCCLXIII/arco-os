/** Tailwind class map — converted from FloatingChat.module.css */
const styles: Record<string, string> = {
  launcher: "inline-flex items-center justify-center w-[56px] h-[56px] border-none rounded-full bg-lf-accent text-lf-text-on-accent shadow-lf-overlay cursor-pointer pointer-events-auto transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] hover:[transform:translateY(-2px)] hover:bg-lf-accent-hover active:[transform:translateY(0)] active:bg-lf-accent-active",
  launcherOpen: "bg-lf-surface-3 text-lf-text-primary shadow-lf-lg hover:bg-[var(--lf-surface-4,_var(--lf-surface-3))]",
  panel: "flex flex-col justify-end w-full h-auto max-h-[min(480px,_calc(100vh_-_120px))] overflow-visible pointer-events-auto [animation:panelIn_var(--lf-duration-normal)_var(--lf-ease)]",
  panelAnchor: "fixed left-[50%] bottom-[var(--lf-space-5)] [transform:translateX(-50%)] w-[min(640px,_calc(100vw_-_var(--lf-space-4)_*_2))] max-h-[min(480px,_calc(100vh_-_120px))] pointer-events-none flex flex-col justify-end transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  panelAnchorRaised: "bottom-[calc(var(--lf-space-5)_+_var(--lf-app-drawer-offset,_84px))]",
  root: "fixed right-[var(--lf-space-5)] bottom-[var(--lf-space-5)] z-lf-overlay flex flex-col items-end gap-lf-3 pointer-events-none transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  rootRaised: "bottom-[calc(var(--lf-space-5)_+_var(--lf-app-drawer-offset,_84px))]",
};
export default styles;
