/**
 * Read-only workspace fixtures — mock data that flows straight into workspace
 * props with no interaction state behind it. Collected here as one frozen
 * object so the shell spreads a single import instead of re-listing ~40
 * mock modules, and so it's obvious which workspaces are display-only.
 */
import { settingsData } from "../mock-data/settings";
import { walletExpenses } from "../mock-data/wallet";
import { bankDashboardData, cryptoWalletData } from "../mock-data/bank-crypto";
import { serverWorkspaceData } from "../mock-data/server";
import { orchestratorWorkspaceData } from "../mock-data/orchestrator";
import { ticketsWorkspaceData } from "../mock-data/tickets";
import { transcribeWorkspaceData } from "../mock-data/transcribe";
import { lifePlanningWorkspaceData } from "../mock-data/life-planning";
import { psycheWorkspaceData } from "../mock-data/psyche";
import { sheetsWorkspaceData } from "../mock-data/sheets";
import { extensionsWorkspaceData } from "../mock-data/extensions";
import { passportWorkspaceData } from "../mock-data/passport";
import { generatedSchema } from "../mock-data/generated";
import {
  musicFeatured,
  musicLibraryItems,
  musicMixes,
  musicNowPlaying,
  musicQuickAccess,
  musicUser,
} from "../mock-data/music";
import { visionFeatured, visionNowPlaying, visionRows, visionUser } from "../mock-data/vision";
import { readerBooks } from "../mock-data/reader";
import { mapsDestinations, mapsRoute, mapsSavedPlaces } from "../mock-data/maps";
import { cameraGallery } from "../mock-data/camera";
import { weatherCurrent, weatherForecast, weatherLocations } from "../mock-data/weather";
import { bankingWidgetTiles } from "../mock-data/banking-widgets";
import { financeWidgetTiles } from "../mock-data/finance-widgets";
import { fitnessWidgetTiles } from "../mock-data/fitness-widgets";
import { widgetDashboardTiles } from "../mock-data/widget-dashboard";

/** Spread into the workspace view model; keys match WorkspaceLayoutViewModel. */
export const staticWorkspaceData = {
  settingsData,
  walletExpenses,
  bankDashboardData,
  cryptoWalletData,
  musicUser,
  musicLibraryItems,
  musicQuickAccess,
  musicFeatured,
  musicMixes,
  musicNowPlaying,
  visionUser,
  visionFeatured,
  visionRows,
  visionNowPlaying,
  readerBooks,
  mapsSavedPlaces,
  mapsDestinations,
  mapsRoute,
  cameraGallery,
  weatherLocations,
  weatherCurrent,
  weatherForecast,
  serverWorkspaceData,
  orchestratorWorkspaceData,
  ticketsWorkspaceData,
  transcribeWorkspaceData,
  lifePlanningWorkspaceData,
  psycheWorkspaceData,
  sheetsWorkspaceData,
  extensionsWorkspaceData,
  passportWorkspaceData,
  generatedSchema,
} as const;

/** All desktop widget tiles, merged for the desktop workspace's widget layer. */
export const allWidgetTiles = [
  ...bankingWidgetTiles,
  ...financeWidgetTiles,
  ...fitnessWidgetTiles,
  ...widgetDashboardTiles,
];
