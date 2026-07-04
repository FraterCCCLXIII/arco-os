import type { ReactNode } from "react";
import { Icon } from "../../../icons";
import { TopBar } from "../../shell/TopBar";
import { Input } from "../../primitives/Input";
import { ScrollArea } from "../../primitives/ScrollArea";
import { EmptyState } from "../../primitives/EmptyState";
import { AppGrid } from "./AppGrid";
import { MarketplaceView } from "./MarketplaceView";
import type { AppListing, AppsSubpage, MarketplaceApp, MarketplaceCategoryId } from "./types";
import styles from "./AppsWorkspace.tailwind";

export interface AppsWorkspaceProps {
  subpage: AppsSubpage;
  marketplaceCategory: MarketplaceCategoryId;
  installedApps: AppListing[];
  marketplaceApps: MarketplaceApp[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  runningAppIds?: Set<string>;
  onLaunchApp: (appId: string) => void;
  onInstallApp: (appId: string) => void;
  onNavigateSubpage?: (subpage: AppsSubpage) => void;
  actions?: ReactNode;
}

/** Apps launcher with an installed grid and a marketplace for discovering new apps. */
export function AppsWorkspace({
  subpage,
  marketplaceCategory,
  installedApps,
  marketplaceApps,
  searchQuery = "",
  onSearchChange,
  runningAppIds,
  onLaunchApp,
  onInstallApp,
  onNavigateSubpage,
  actions,
}: AppsWorkspaceProps) {
  const filteredInstalled = installedApps.filter((app) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return app.label.toLowerCase().includes(query) || app.description?.toLowerCase().includes(query);
  });

  const breadcrumb =
    subpage === "installed"
      ? [{ label: "Apps" }]
      : [
          { label: "Apps", onClick: () => onNavigateSubpage?.("installed") },
          { label: "Marketplace" },
        ];

  return (
    <div className={styles.workspace}>
      <TopBar breadcrumb={breadcrumb} actions={actions} />
      <div className={styles.toolbar}>
        {onSearchChange && (
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={subpage === "installed" ? "Search apps" : "Search marketplace"}
            aria-label={subpage === "installed" ? "Search apps" : "Search marketplace"}
          />
        )}
      </div>
      <ScrollArea className={styles.scroll}>
        {subpage === "installed" ? (
          filteredInstalled.length === 0 ? (
            <EmptyState
              icon={<Icon name="grid" size={22} />}
              title="No apps found"
              description="Install apps from the marketplace to see them here."
            />
          ) : (
            <AppGrid apps={filteredInstalled} runningAppIds={runningAppIds} onLaunchApp={onLaunchApp} />
          )
        ) : (
          <MarketplaceView
            apps={marketplaceApps}
            category={marketplaceCategory}
            searchQuery={searchQuery}
            onInstallApp={onInstallApp}
          />
        )}
      </ScrollArea>
    </div>
  );
}
