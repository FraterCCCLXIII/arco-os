/**
 * Showcase workspace layouts — display-driven workspaces whose props come
 * straight from static fixtures (media, travel, weather, data dashboards)
 * plus the self-contained demo workspaces that take no props at all.
 */
import {
  AppPortWorkspace,
  BankCryptoWorkspace,
  BentoWorkspace,
  BrowserWorkspace,
  CalculatorWorkspace,
  CameraWorkspace,
  ComposerWorkspace,
  CreativeStudioWorkspace,
  DesignSystemWorkspace,
  ExtensionsWorkspace,
  GeneratorWorkspace,
  LifePlanningWorkspace,
  MapsWorkspace,
  MusicWorkspace,
  NodalWorkspace,
  OrchestratorWorkspace,
  PassportWorkspace,
  PsycheWorkspace,
  ReaderWorkspace,
  ServerWorkspace,
  SheetsWorkspace,
  TicketsWorkspace,
  TranscribeWorkspace,
  VisionWorkspace,
  WalletWorkspace,
  WeatherWorkspace,
  WireframeWorkspace,
} from "longformer-ui";
import type { WorkspaceLayoutBuilder } from "./types";

export const buildWalletLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <WalletWorkspace expenses={vm.walletExpenses} />,
});

export const buildBankCryptoLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <BankCryptoWorkspace bank={vm.bankDashboardData} crypto={vm.cryptoWalletData} />,
});

export const buildMusicLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <MusicWorkspace
      user={vm.musicUser}
      libraryItems={vm.musicLibraryItems}
      quickAccess={vm.musicQuickAccess}
      featured={vm.musicFeatured}
      mixes={vm.musicMixes}
      nowPlaying={vm.musicNowPlaying}
    />
  ),
});

export const buildVisionLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <VisionWorkspace
      user={vm.visionUser}
      featured={vm.visionFeatured}
      rows={vm.visionRows}
      nowPlaying={vm.visionNowPlaying}
    />
  ),
});

export const buildReaderLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <ReaderWorkspace books={vm.readerBooks} />,
});

export const buildMapsLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <MapsWorkspace
      savedPlaces={vm.mapsSavedPlaces}
      destinations={vm.mapsDestinations}
      route={vm.mapsRoute}
    />
  ),
});

export const buildCameraLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <CameraWorkspace gallery={vm.cameraGallery} />,
});

export const buildWeatherLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <WeatherWorkspace
      locations={vm.weatherLocations}
      current={vm.weatherCurrent}
      forecast={vm.weatherForecast}
    />
  ),
});

export const buildServerLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <ServerWorkspace data={vm.serverWorkspaceData} />,
});

export const buildOrchestratorLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <OrchestratorWorkspace data={vm.orchestratorWorkspaceData} />,
});

export const buildTicketsLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <TicketsWorkspace data={vm.ticketsWorkspaceData} />,
});

export const buildTranscribeLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <TranscribeWorkspace data={vm.transcribeWorkspaceData} />,
});

export const buildLifePlanningLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <LifePlanningWorkspace data={vm.lifePlanningWorkspaceData} />,
});

export const buildPsycheLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <PsycheWorkspace data={vm.psycheWorkspaceData} />,
});

export const buildSheetsLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <SheetsWorkspace data={vm.sheetsWorkspaceData} />,
});

export const buildExtensionsLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <ExtensionsWorkspace data={vm.extensionsWorkspaceData} />,
});

export const buildPassportLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <PassportWorkspace data={vm.passportWorkspaceData} />,
});

export const buildDesignSystemLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: <DesignSystemWorkspace generatedSchema={vm.generatedSchema} />,
});

// --- Self-contained demos (no view-model props) --------------------------

export const buildCalculatorLayout: WorkspaceLayoutBuilder = () => ({
  main: <CalculatorWorkspace />,
});

export const buildBrowserLayout: WorkspaceLayoutBuilder = () => ({
  main: <BrowserWorkspace />,
});

export const buildBentoLayout: WorkspaceLayoutBuilder = () => ({
  main: <BentoWorkspace />,
});

export const buildAppPortLayout: WorkspaceLayoutBuilder = () => ({
  main: <AppPortWorkspace />,
});

export const buildComposerLayout: WorkspaceLayoutBuilder = () => ({
  main: <ComposerWorkspace />,
});

export const buildGeneratorLayout: WorkspaceLayoutBuilder = () => ({
  main: <GeneratorWorkspace />,
});

export const buildWireframeLayout: WorkspaceLayoutBuilder = () => ({
  main: <WireframeWorkspace />,
});

export const buildNodalLayout: WorkspaceLayoutBuilder = () => ({
  main: <NodalWorkspace />,
});

export const buildCreativeStudioLayout: WorkspaceLayoutBuilder = () => ({
  main: <CreativeStudioWorkspace />,
});
