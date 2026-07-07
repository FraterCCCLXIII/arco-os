export interface LongformerDesktopBridge {
  isDesktop: true;
  platform: string;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
}

declare global {
  interface Window {
    longformerDesktop?: LongformerDesktopBridge;
  }
}

export function isLongformerDesktop(): boolean {
  return typeof window !== "undefined" && window.longformerDesktop?.isDesktop === true;
}

export function getLongformerDesktop(): LongformerDesktopBridge | undefined {
  return window.longformerDesktop;
}
