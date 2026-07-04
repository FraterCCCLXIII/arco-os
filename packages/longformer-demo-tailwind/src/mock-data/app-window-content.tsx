import { AppWindowSurface } from "longformer-ui-tailwind";
import { generatedSchema } from "./generated";

/** Shared generated UI shown inside every desktop app window. */
export function createAppWindowContent() {
  return <AppWindowSurface schema={generatedSchema} />;
}
