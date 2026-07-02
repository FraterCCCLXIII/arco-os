import { useMemo } from "react";
import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { EmptyState } from "../../primitives/EmptyState";
import { MARKETPLACE_CATEGORIES, type MarketplaceApp, type MarketplaceCategoryId } from "./types";
import styles from "./MarketplaceView.module.css";

export interface MarketplaceViewProps {
  apps: MarketplaceApp[];
  category: MarketplaceCategoryId;
  searchQuery?: string;
  onInstallApp: (appId: string) => void;
}

/** Browse and install apps from the marketplace, filtered by category and search. */
export function MarketplaceView({ apps, category, searchQuery = "", onInstallApp }: MarketplaceViewProps) {
  const categoryLabel = MARKETPLACE_CATEGORIES.find((item) => item.id === category)?.label ?? "Marketplace";

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return apps.filter((app) => {
      const matchesCategory = category === "featured" || app.category === category;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        app.label.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query) ||
        app.author?.toLowerCase().includes(query)
      );
    });
  }, [apps, category, searchQuery]);

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <h2 className={styles.title}>{categoryLabel}</h2>
        <p className={styles.subtitle}>
          {category === "featured"
            ? "Popular apps and editor's picks for your workspace."
            : `Discover ${categoryLabel.toLowerCase()} apps to add to your launcher.`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Icon name="sparkles" size={22} />}
          title="No apps found"
          description="Try a different category or search term."
        />
      ) : (
        <div className={styles.cardGrid}>
          {filtered.map((app) => (
            <Card key={app.id} className={styles.card} padding="lg">
              <div className={styles.cardHead}>
                <span className={styles.cardIcon}>
                  <Icon name={app.icon} size={18} />
                </span>
                {app.badge && <Badge tone="accent">{app.badge}</Badge>}
              </div>
              <div className={styles.cardTitle}>{app.label}</div>
              {app.author && <div className={styles.cardAuthor}>{app.author}</div>}
              {app.description && <div className={styles.cardDescription}>{app.description}</div>}
              <div className={styles.cardFooter}>
                {typeof app.rating === "number" && (
                  <span className={styles.rating}>
                    <Icon name="star" size={13} />
                    {app.rating.toFixed(1)}
                  </span>
                )}
                {app.installed ? (
                  <Button size="sm" variant="secondary" disabled>
                    Installed
                  </Button>
                ) : (
                  <Button size="sm" variant="primary" onClick={() => onInstallApp(app.id)}>
                    <Icon name="plus" size={14} />
                    Install
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
