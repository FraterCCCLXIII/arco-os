import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "lf-chat-formatting-toolbar-visible";

function readStoredVisibility(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === null) return true;
  return stored === "true";
}

/** Shared show/hide state for composer rich-text toolbars across chat surfaces. */
export function useComposerFormattingToolbar() {
  const [visible, setVisible] = useState(readStoredVisibility);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(visible));
  }, [visible]);

  const toggle = useCallback(() => {
    setVisible((current) => !current);
  }, []);

  return { visible, setVisible, toggle };
}
