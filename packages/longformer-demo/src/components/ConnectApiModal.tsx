/**
 * ConnectApiModal — runtime configuration for the generative-UI engine.
 *
 * Lets a user point the prototype at any OpenAI-compatible endpoint (OpenAI,
 * OpenRouter, local Ollama, or a custom URL) without editing `.env`. Saving
 * persists to localStorage via the connection store; the next prompt sent in
 * chat immediately uses the new connection. "Test connection" hits the
 * endpoint's `/models` route so a designer gets a pass/fail before saving.
 */
import { useEffect, useState } from "react";
import { Button, Icon, Input, Modal, cx } from "longformer-ui";
import {
  LLM_PRESETS,
  clearConnection,
  presetById,
  saveConnection,
  testConnection,
  type ConnectionTestResult,
  type LlmConnection,
} from "../agent/connection";
import styles from "./ConnectApiModal.module.css";

export interface ConnectApiModalProps {
  open: boolean;
  onClose: () => void;
  /** The currently saved connection, if any — seeds the form. */
  connection: LlmConnection | null;
  /** Called after save/disconnect so the parent can refresh derived state. */
  onConnectionChange: (connection: LlmConnection | null) => void;
}

export function ConnectApiModal({ open, onClose, connection, onConnectionChange }: ConnectApiModalProps) {
  const [presetId, setPresetId] = useState("openai");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [testing, setTesting] = useState(false);

  // Re-seed the form from the saved connection each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setTestResult(null);
    setTesting(false);
    if (connection) {
      setPresetId(connection.presetId);
      setBaseUrl(connection.baseUrl);
      setApiKey(connection.apiKey);
      setModel(connection.model);
    } else {
      const preset = presetById("openai");
      setPresetId(preset.id);
      setBaseUrl(preset.baseUrl);
      setApiKey("");
      setModel(preset.suggestedModel);
    }
  }, [open, connection]);

  const preset = presetById(presetId);
  const canSave = Boolean(baseUrl.trim() && model.trim() && (apiKey.trim() || !preset.requiresKey));

  /** Choosing a preset pre-fills URL and model but never clobbers a typed key. */
  function handlePresetSelect(id: string) {
    const next = presetById(id);
    setPresetId(id);
    setBaseUrl(next.baseUrl);
    setModel(next.suggestedModel);
    setTestResult(null);
  }

  function currentFormConnection(): LlmConnection {
    return { presetId, baseUrl: baseUrl.trim(), apiKey: apiKey.trim(), model: model.trim() };
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    const result = await testConnection(currentFormConnection());
    setTesting(false);
    setTestResult(result);
    // If the server advertises models and the current one isn't among them,
    // adopt the first advertised model — saves a copy/paste for local servers.
    if (result.ok && result.models?.length && !result.models.includes(model.trim())) {
      setModel(result.models[0]);
    }
  }

  function handleSave() {
    const next = currentFormConnection();
    saveConnection(next);
    onConnectionChange(next);
    onClose();
  }

  function handleDisconnect() {
    clearConnection();
    onConnectionChange(null);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connect a model API"
      className={styles.panel}
      footer={
        <>
          {connection && (
            <Button variant="ghost" className={styles.footerLeft} onClick={handleDisconnect}>
              Disconnect
            </Button>
          )}
          <Button variant="secondary" onClick={handleTest} disabled={testing || !baseUrl.trim()}>
            {testing ? "Testing…" : "Test connection"}
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!canSave}>
            <Icon name="zap" size={14} />
            Save & use
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <div className={styles.field}>
          <span className={styles.label}>Provider</span>
          <div className={styles.presetRow} role="listbox" aria-label="API providers">
            {LLM_PRESETS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={option.id === presetId}
                className={cx(
                  "lf-focusable",
                  styles.presetChip,
                  option.id === presetId && styles.presetChipSelected,
                )}
                onClick={() => handlePresetSelect(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className={styles.hint}>{preset.hint}</p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="connect-api-base-url">
            Base URL
          </label>
          <Input
            id="connect-api-base-url"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            placeholder="https://api.openai.com/v1"
            spellCheck={false}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="connect-api-key">
            API key{preset.requiresKey ? "" : " (optional)"}
          </label>
          <Input
            id="connect-api-key"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder={preset.requiresKey ? "sk-…" : "Leave blank for keyless local servers"}
            autoComplete="off"
            spellCheck={false}
          />
          <p className={styles.hint}>Stored only in this browser (localStorage). Never sent anywhere except your chosen endpoint.</p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="connect-api-model">
            Model
          </label>
          <Input
            id="connect-api-model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder={preset.suggestedModel || "model-id"}
            spellCheck={false}
          />
        </div>

        {testResult && (
          <p
            className={cx(styles.status, testResult.ok ? styles.statusOk : styles.statusError)}
            role="status"
          >
            <Icon name={testResult.ok ? "check" : "close"} size={14} />
            {testResult.message}
          </p>
        )}
      </div>
    </Modal>
  );
}
