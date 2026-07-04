import { useState } from "react";
import { Icon } from "../../../icons";
import { ScrollArea } from "../../primitives/ScrollArea";
import { Tabs } from "../../primitives/Tabs";
import type { GeneratedSurfaceSchema } from "../generated-ui/types";
import { designSystemTabMeta, renderDesignSystemPanel } from "./DesignSystemPanels";
import { DESIGN_SYSTEM_TABS, type DesignSystemTabId } from "./ontology";
import styles from "./DesignSystemWorkspace.tailwind";

export interface DesignSystemWorkspaceProps {
  title?: string;
  /** Agent-generated schema shown on the Generated UI tab. */
  generatedSchema?: GeneratedSurfaceSchema;
  defaultTab?: DesignSystemTabId;
}

/** Tabbed catalog of Longformer tokens, components, cards, and patterns. */
export function DesignSystemWorkspace({
  title = "Design System",
  generatedSchema,
  defaultTab = "overview",
}: DesignSystemWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<DesignSystemTabId>(defaultTab);
  const tabMeta = designSystemTabMeta(activeTab);

  return (
    <div className={styles.workspace}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrow}>Longformer UI kit</div>
            <div className={styles.titleRow}>
              <span className={styles.titleIcon}>
                <Icon name="layers" size={18} />
              </span>
              <h1 className={styles.title}>{title}</h1>
            </div>
            {tabMeta && <p className={styles.subtitle}>{tabMeta.description}</p>}
          </div>
        </header>

        <div className={styles.tabBar}>
          <Tabs
            variant="underline"
            items={DESIGN_SYSTEM_TABS.map((tab) => ({ id: tab.id, label: tab.label }))}
            value={activeTab}
            onChange={(id) => setActiveTab(id as DesignSystemTabId)}
            aria-label="Design system sections"
          />
        </div>

        <ScrollArea className={styles.scroll}>
          <div className={styles.content}>{renderDesignSystemPanel(activeTab, generatedSchema)}</div>
        </ScrollArea>
      </div>
    </div>
  );
}
