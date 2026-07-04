import type { FormFactor, WindowLayer } from "../../../surface-manager";
import type { AppPortViewport } from "../app-port/types";

/** Map simulated device form factor (and optional window layer) to App Port layout rules. */
export function formFactorToAppPortViewport(
  formFactor: FormFactor,
  layer: WindowLayer = "base",
): AppPortViewport {
  if (layer === "modal" || layer === "sheet") return "modal";
  switch (formFactor) {
    case "tablet":
      return "tablet";
    case "phone":
      return "phone";
    case "watch":
      return "watch";
    case "widget":
    case "desktop":
    default:
      return "desktop";
  }
}
