import { AppWindowSurface } from "longformer-ui";
import { generatedSchema } from "./generated";

/** Shared generated UI shown inside every desktop app window. */
export function createAppWindowContent() {
  return <AppWindowSurface schema={generatedSchema} />;
}
