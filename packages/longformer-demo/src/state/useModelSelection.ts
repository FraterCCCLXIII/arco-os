/**
 * Model picker state shared by every composer surface (chat workspace,
 * assistant panel, floating chat). Kept outside the chat hook so all
 * surfaces reflect the same active model without prop threading.
 */
import { useMemo, useState } from "react";

const MODEL_OPTIONS = [
  { id: "gpt-5.5", label: "GPT-5.5 Medium" },
  { id: "claude-4.6", label: "Claude 4.6 Sonnet" },
  { id: "sonnet-5", label: "Sonnet 5" },
  { id: "composer-2.5", label: "Composer 2.5 Fast" },
];

export function useModelSelection() {
  const [model, setModel] = useState("Sonnet 5");

  // Menu items are stable for the app lifetime; each item closes over setModel only.
  const modelMenuItems = useMemo(
    () =>
      MODEL_OPTIONS.map((option) => ({
        id: option.id,
        label: option.label,
        onSelect: () => setModel(option.label),
      })),
    [],
  );

  return useMemo(() => ({ model, modelMenuItems }), [model, modelMenuItems]);
}

export type ModelSelectionSlice = ReturnType<typeof useModelSelection>;
