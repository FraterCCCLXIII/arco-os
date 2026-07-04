/// <reference types="vite/client" />

/**
 * Optional LLM engine configuration for the generative-UI prototype.
 * All values come from a local `.env` file and are absent by default,
 * in which case the offline surface composer is used.
 */
interface ImportMetaEnv {
  readonly VITE_LLM_API_KEY?: string;
  readonly VITE_LLM_BASE_URL?: string;
  readonly VITE_LLM_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
