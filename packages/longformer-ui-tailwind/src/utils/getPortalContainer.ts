export const LF_PORTAL_ROOT_ID = "lf-portal-root";

/** Portal target for overlays that must escape overflow clipping but stay in theme scope. */
export function getPortalContainer(): HTMLElement {
  return document.getElementById(LF_PORTAL_ROOT_ID) ?? document.body;
}
