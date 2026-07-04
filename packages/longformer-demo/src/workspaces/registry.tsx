/**
 * Workspace registry — the single map from WorkspaceId to layout builder,
 * replacing the old 43-case switch in workspace-layout.tsx.
 *
 * `satisfies Record<WorkspaceId, …>` makes the map total: adding a
 * WorkspaceId to workspace-config.ts without registering a builder here is a
 * compile error, and so is registering an unknown id. This is the demo-scale
 * precursor of the spec's Generation Registry (D5): one declarative catalog
 * that routing, rendering, and future manifests all read.
 */
import { AdaptiveWorkspaceWindowContent, type AppPortViewport } from "longformer-ui";
import { workspaceNavItem, type WorkspaceId } from "../workspace-config";
import type {
  WorkspaceLayout,
  WorkspaceLayoutBuilder,
  WorkspaceLayoutInput,
  WorkspaceLayoutOptions,
  WorkspaceViewModel,
} from "./types";
import { buildChatLayout } from "./chat";
import {
  buildContactsLayout,
  buildMessagesLayout,
  buildPhoneLayout,
  buildSlackLayout,
  buildSocialLayout,
} from "./comms";
import { buildEmailLayout, buildFilesLayout, buildNotesLayout } from "./content";
import {
  buildCalendarLayout,
  buildNotificationsLayout,
  buildScheduleLayout,
  buildTasksLayout,
} from "./planner";
import { buildAppsLayout, buildDesktopLayout, buildSettingsLayout } from "./platform";
import {
  buildAppPortLayout,
  buildBankCryptoLayout,
  buildBentoLayout,
  buildBrowserLayout,
  buildCalculatorLayout,
  buildCameraLayout,
  buildComposerLayout,
  buildCreativeStudioLayout,
  buildDesignSystemLayout,
  buildExtensionsLayout,
  buildGeneratorLayout,
  buildLifePlanningLayout,
  buildMapsLayout,
  buildMusicLayout,
  buildNodalLayout,
  buildOrchestratorLayout,
  buildPassportLayout,
  buildPsycheLayout,
  buildReaderLayout,
  buildServerLayout,
  buildSheetsLayout,
  buildTicketsLayout,
  buildTranscribeLayout,
  buildVisionLayout,
  buildWalletLayout,
  buildWeatherLayout,
  buildWireframeLayout,
} from "./showcase";

export const WORKSPACE_LAYOUTS = {
  chat: buildChatLayout,
  messages: buildMessagesLayout,
  slack: buildSlackLayout,
  social: buildSocialLayout,
  contacts: buildContactsLayout,
  phone: buildPhoneLayout,
  email: buildEmailLayout,
  notes: buildNotesLayout,
  files: buildFilesLayout,
  calendar: buildCalendarLayout,
  schedule: buildScheduleLayout,
  tasks: buildTasksLayout,
  notifications: buildNotificationsLayout,
  apps: buildAppsLayout,
  settings: buildSettingsLayout,
  desktop: buildDesktopLayout,
  wallet: buildWalletLayout,
  "bank-crypto": buildBankCryptoLayout,
  music: buildMusicLayout,
  vision: buildVisionLayout,
  reader: buildReaderLayout,
  maps: buildMapsLayout,
  camera: buildCameraLayout,
  weather: buildWeatherLayout,
  calculator: buildCalculatorLayout,
  browser: buildBrowserLayout,
  server: buildServerLayout,
  orchestrator: buildOrchestratorLayout,
  tickets: buildTicketsLayout,
  transcribe: buildTranscribeLayout,
  "life-planning": buildLifePlanningLayout,
  psyche: buildPsycheLayout,
  sheets: buildSheetsLayout,
  extensions: buildExtensionsLayout,
  passport: buildPassportLayout,
  bento: buildBentoLayout,
  "app-port": buildAppPortLayout,
  composer: buildComposerLayout,
  generator: buildGeneratorLayout,
  generated: buildDesignSystemLayout,
  wireframe: buildWireframeLayout,
  nodal: buildNodalLayout,
  "creative-studio": buildCreativeStudioLayout,
} satisfies Record<WorkspaceId, WorkspaceLayoutBuilder>;

/** Resolve a workspace's sidebar/main layout through the registry. */
export function buildWorkspaceLayout(
  vm: WorkspaceLayoutInput,
  options: WorkspaceLayoutOptions = { includeSidebar: true },
): WorkspaceLayout {
  const builder = WORKSPACE_LAYOUTS[vm.workspaceId];
  return builder(vm, options);
}

/**
 * Build a workspace as desktop-window content: same registry, wrapped in the
 * adaptive window frame so it reflows for phone/tablet/watch viewports.
 */
export function buildWorkspaceWindowContent(
  appId: string,
  vm: WorkspaceViewModel,
  viewport: AppPortViewport = "desktop",
): React.ReactNode | null {
  if (appId === "desktop") return null;
  const nav = workspaceNavItem(appId as WorkspaceId);
  if (!nav) return null;

  const { sidebar, main } = buildWorkspaceLayout(
    { ...vm, workspaceId: nav.id },
    { includeSidebar: true },
  );

  return (
    <AdaptiveWorkspaceWindowContent
      viewport={viewport}
      title={nav.label}
      icon={nav.icon}
      sidebar={sidebar}
      main={main}
    />
  );
}
