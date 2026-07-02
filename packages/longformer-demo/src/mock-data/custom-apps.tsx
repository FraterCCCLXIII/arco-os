/**
 * Custom app factory — turns a create-app template choice into launcher metadata
 * and a first-run desktop window with the shared generated UI surface.
 */
import type { AppListing, AppTemplate, AppTemplateId, CreateAppPayload, DesktopApp, OpenWindowInput } from "longformer-ui";
import { APP_TEMPLATES } from "longformer-ui";
import { createAppWindowContent } from "./app-window-content";

export interface CustomApp extends AppListing {
  templateId: AppTemplateId;
}

export function createCustomApp(payload: CreateAppPayload): CustomApp {
  const template = APP_TEMPLATES.find((item) => item.id === payload.templateId) as AppTemplate;
  const id = `custom-${payload.templateId}-${Date.now()}`;

  return {
    id,
    label: payload.name.trim() || template.label,
    icon: template.icon,
    tone: template.tone,
    description: template.description,
    category: "featured",
    templateId: payload.templateId,
  };
}

export function toDesktopApp(app: CustomApp): DesktopApp {
  return {
    id: app.id,
    label: app.label,
    icon: app.icon,
    tone: app.tone,
    description: app.description,
    pinned: true,
  };
}

export function createCustomAppWindow(app: CustomApp, _index: number): OpenWindowInput {
  return {
    id: `win-${app.id}-${Date.now()}`,
    appId: app.id,
    title: app.label,
    icon: app.icon,
    content: createAppWindowContent(),
  };
}
