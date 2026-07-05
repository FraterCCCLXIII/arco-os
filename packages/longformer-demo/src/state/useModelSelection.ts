/**
 * Model/engine state shared by every composer surface (chat workspace,
 * assistant panel, floating chat).
 *
 * The composer's model chip now reflects the real generation engine: the
 * connected API model when one is configured, otherwise the offline local
 * composer. The menu's "Connect model API…" entry opens the ConnectApiModal;
 * saving there updates the chip and the next prompt immediately.
 */
import { useCallback, useMemo, useState } from "react";
import { getStoredConnection, type LlmConnection } from "../agent/connection";

const LOCAL_ENGINE_LABEL = "Local engine";

export function useModelSelection() {
  const [llmConnection, setLlmConnection] = useState<LlmConnection | null>(() => getStoredConnection());
  const [connectApiOpen, setConnectApiOpen] = useState(false);

  const handleConnectionChange = useCallback((connection: LlmConnection | null) => {
    setLlmConnection(connection);
  }, []);

  // The chip label is truthful: it names whatever engine will actually
  // handle the next prompt.
  const model = llmConnection ? llmConnection.model : LOCAL_ENGINE_LABEL;

  const modelMenuItems = useMemo(
    () => [
      ...(llmConnection
        ? [
            {
              id: "connected-model",
              label: `${llmConnection.model} · connected`,
            },
          ]
        : [
            {
              id: "local-engine",
              label: `${LOCAL_ENGINE_LABEL} · offline composer`,
            },
          ]),
      {
        id: "connect-api",
        label: llmConnection ? "Manage API connection…" : "Connect model API…",
        onSelect: () => setConnectApiOpen(true),
      },
    ],
    [llmConnection],
  );

  return useMemo(
    () => ({
      model,
      modelMenuItems,
      llmConnection,
      connectApiOpen,
      setConnectApiOpen,
      handleConnectionChange,
    }),
    [model, modelMenuItems, llmConnection, connectApiOpen, handleConnectionChange],
  );
}

export type ModelSelectionSlice = ReturnType<typeof useModelSelection>;
