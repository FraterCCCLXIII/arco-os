/**
 * Platform workspace layouts — the apps marketplace, settings, and the
 * desktop. The desktop's layout comes from the shell via
 * `renderDesktopWorkspace` because it owns live window state that can't be
 * rebuilt from the view model alone.
 */
import {
  AppsWorkspace,
  Icon,
  MARKETPLACE_CATEGORIES,
  NavSidebar,
  SettingsWorkspace,
  SidebarUserFooter,
} from "longformer-ui";
import { primaryUser } from "../demo-personas";
import type { WorkspaceLayoutBuilder } from "./types";

export const buildAppsLayout: WorkspaceLayoutBuilder = (vm, { includeSidebar }) => ({
  sidebar: includeSidebar ? (
    <NavSidebar
      primaryAction={{
        label: "Browse marketplace",
        icon: "sparkles",
        onClick: () => {
          vm.setAppsSubpage("marketplace");
          vm.setMarketplaceCategory("featured");
        },
      }}
      quickLinks={[
        {
          id: "installed",
          label: "My apps",
          icon: "grid",
          active: vm.appsSubpage === "installed",
          onClick: () => vm.setAppsSubpage("installed"),
        },
        {
          id: "marketplace",
          label: "Marketplace",
          icon: "sparkles",
          active: vm.appsSubpage === "marketplace",
          onClick: () => {
            vm.setAppsSubpage("marketplace");
            vm.setMarketplaceCategory("featured");
          },
        },
      ]}
      sections={
        vm.appsSubpage === "marketplace"
          ? [
              {
                id: "categories",
                title: "Categories",
                items: MARKETPLACE_CATEGORIES.map((category) => ({
                  id: category.id,
                  label: category.label,
                  leading: <Icon name="layers" size={14} />,
                  active: vm.marketplaceCategory === category.id,
                  onClick: () => vm.setMarketplaceCategory(category.id),
                })),
              },
            ]
          : [
              {
                id: "collections",
                title: "Collections",
                items: [
                  {
                    id: "recent",
                    label: "Recently used",
                    leading: <Icon name="refresh" size={14} />,
                  },
                  {
                    id: "pinned",
                    label: "Pinned to dock",
                    leading: <Icon name="star" size={14} />,
                  },
                ],
              },
            ]
      }
      footer={<SidebarUserFooter name={primaryUser.name} meta="Longformer · Plus" />}
    />
  ) : undefined,
  main: (
    <AppsWorkspace
      subpage={vm.appsSubpage}
      marketplaceCategory={vm.marketplaceCategory}
      installedApps={vm.installedApps}
      marketplaceApps={vm.marketplaceApps}
      searchQuery={vm.appSearch}
      onSearchChange={vm.setAppSearch}
      runningAppIds={vm.runningAppIds}
      onLaunchApp={vm.handleTrayLaunchApp}
      onInstallApp={vm.handleInstallApp}
      onNavigateSubpage={vm.setAppsSubpage}
    />
  ),
});

export const buildSettingsLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <SettingsWorkspace
      data={vm.settingsData}
      desktopWallpaperUrl={vm.desktopWallpaperUrl}
      onDesktopWallpaperChange={vm.setDesktopWallpaperUrl}
    />
  ),
});

export const buildDesktopLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: vm.renderDesktopWorkspace?.() ?? null,
});
