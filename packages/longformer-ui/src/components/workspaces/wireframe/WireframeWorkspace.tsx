import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { Avatar } from "../../primitives/Avatar";
import { Button } from "../../primitives/Button";
import { Checkbox } from "../../primitives/Checkbox";
import { IconButton } from "../../primitives/IconButton";
import { ScrollArea } from "../../primitives/ScrollArea";
import { TabPanel, Tabs } from "../../primitives/Tabs";
import {
  CanvasRulers,
  SideList,
  ToolDock,
  designShellStyles as shell,
} from "../design-shell";
import { WIREFRAME_SAMPLE_DATA } from "./sample-data";
import type { WireframeToolId, WireframeWorkspaceData } from "./types";
import styles from "./WireframeWorkspace.module.css";

export interface WireframeWorkspaceProps {
  data?: WireframeWorkspaceData;
  className?: string;
}

const RAIL_ITEMS = [
  { id: "file", label: "File", icon: "file" as const },
  { id: "agents", label: "Agents", icon: "sparkles" as const },
  { id: "assets", label: "Assets", icon: "image" as const },
  { id: "tools", label: "Tools", icon: "settings" as const },
  { id: "variables", label: "Variables", icon: "grid" as const },
];

const INSPECTOR_TABS = [
  { id: "design", label: "Design" },
  { id: "prototype", label: "Prototype" },
];

const TOOLS: { id: WireframeToolId; label: string; icon: import("../../../icons").IconName }[] = [
  { id: "select", label: "Move", icon: "arrow-up-right" },
  { id: "frame", label: "Frame", icon: "hash" },
  { id: "rectangle", label: "Rectangle", icon: "square" },
  { id: "pen", label: "Pen", icon: "edit" },
  { id: "text", label: "Text", icon: "paragraph" },
  { id: "component", label: "Component", icon: "layers" },
  { id: "hand", label: "Hand", icon: "globe" },
  { id: "comment", label: "Comment", icon: "message-square" },
  { id: "code", label: "Dev mode", icon: "code" },
];

const H_RULER = [-25000, -20000, -15000, -10000, -5000, 0, 5000, 8000];
const V_RULER = [-25000, -20000, -15000, -10000, -5000, 0, 5000, 8000];

/** Figma-style design workspace with layers panel, canvas rulers, and property inspector. */
export function WireframeWorkspace({ data = WIREFRAME_SAMPLE_DATA, className }: WireframeWorkspaceProps) {
  const [activeTabId, setActiveTabId] = useState(data.tabs[0]?.id ?? "tab-1");
  const [activePageId, setActivePageId] = useState("page-blog");
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [activeRailId, setActiveRailId] = useState("file");
  const [activeTool, setActiveTool] = useState<WireframeToolId>("select");
  const [rightPanelTab, setRightPanelTab] = useState("design");

  const documentTabs = useMemo(
    () => data.tabs.map((tab) => ({ id: tab.id, label: tab.label })),
    [data.tabs],
  );

  return (
    <div className={cx(shell.workspace, className)} aria-label="Wireframe">
      <header className={shell.topBar}>
        <div className={shell.topBarGroup}>
          <IconButton icon="home" label="Home" size="sm" />
          <span className={shell.appBadge} aria-hidden>
            W
          </span>
        </div>
        <Tabs
          className={shell.topBarTabs}
          variant="pill"
          items={documentTabs}
          value={activeTabId}
          onChange={setActiveTabId}
          aria-label="Open documents"
        />
        <div className={shell.topBarGroup}>
          <IconButton icon="play" label="Play prototype" size="sm" />
          <Avatar name="Alex Morgan" size="sm" />
          <Button variant="primary" size="sm">
            Share
          </Button>
        </div>
      </header>

      <div className={shell.body}>
        <nav className={shell.rail} aria-label="Primary navigation">
          {RAIL_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cx(shell.railButton, activeRailId === item.id && shell.railButtonActive)}
              aria-label={item.label}
              aria-current={activeRailId === item.id ? "page" : undefined}
              onClick={() => setActiveRailId(item.id)}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <aside className={cx(shell.sidePanel, shell.sidePanelLeft)} aria-label="Pages and layers">
          <div className={shell.panelHeader}>
            <h2 className={shell.panelTitle}>{data.projectName}</h2>
            <p className={shell.panelMeta}>{data.workspaceName}</p>
          </div>

          <section className={shell.section}>
            <div className={shell.sectionHeader}>
              <h3 className={shell.sectionTitle}>Pages</h3>
              <div className={shell.topBarGroup}>
                <IconButton icon="search" label="Search pages" size="sm" />
                <IconButton icon="plus" label="Add page" size="sm" />
              </div>
            </div>
            <ScrollArea className={styles.panelScroll}>
              <SideList
                items={data.pages.map((page) => ({ id: page.id, label: page.label }))}
                activeId={activePageId}
                onSelect={setActivePageId}
                aria-label="Pages"
              />
            </ScrollArea>
          </section>

          <section className={shell.section}>
            <div className={shell.sectionHeader}>
              <h3 className={shell.sectionTitle}>Layers</h3>
            </div>
            <ScrollArea className={styles.panelScroll}>
              <SideList
                items={data.layers.map((layer) => ({ id: layer.id, label: layer.label, prefix: "#" }))}
                activeId={activeLayerId}
                onSelect={setActiveLayerId}
                aria-label="Layers"
              />
            </ScrollArea>
          </section>
        </aside>

        <CanvasRulers horizontalTicks={H_RULER} verticalTicks={V_RULER}>
          <ToolDock
            items={TOOLS}
            activeId={activeTool}
            onSelect={(id) => setActiveTool(id as WireframeToolId)}
            dividersBefore={[7]}
            aria-label="Design tools"
          />
        </CanvasRulers>

        <aside className={cx(shell.sidePanel, shell.sidePanelRight)} aria-label="Properties">
          <div className={shell.panelTabBar}>
            <Tabs
              variant="underline"
              items={INSPECTOR_TABS}
              value={rightPanelTab}
              onChange={setRightPanelTab}
              aria-label="Inspector mode"
            />
          </div>
          <div className={styles.zoomLabel}>6%</div>
          <TabPanel id="design" active={rightPanelTab === "design"} className={styles.panelScroll}>
            <ScrollArea className={styles.panelScroll}>
              <div className={shell.propertyGroup}>
                <h4 className={shell.propertyLabel}>Page</h4>
                <div className={styles.colorRow}>
                  <span className={styles.colorSwatch} />
                  <span className={styles.colorValue}>Canvas</span>
                </div>
                <Checkbox label="Show in exports" defaultChecked />
              </div>
              <div className={shell.propertyGroup}>
                <div className={shell.sectionHeader}>
                  <h4 className={shell.propertyLabel}>Styles</h4>
                  <IconButton icon="plus" label="Add style" size="sm" />
                </div>
              </div>
              <div className={shell.propertyGroup}>
                <h4 className={shell.propertyLabel}>Export</h4>
                <div className={styles.exportRow}>
                  <select className={styles.exportSelect} defaultValue="1x" aria-label="Export scale">
                    <option value="1x">1x</option>
                    <option value="2x">2x</option>
                    <option value="3x">3x</option>
                  </select>
                  <select className={styles.exportSelect} defaultValue="png" aria-label="Export format">
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
              </div>
            </ScrollArea>
          </TabPanel>
          <TabPanel id="prototype" active={rightPanelTab === "prototype"} className={styles.panelScroll}>
            <ScrollArea className={styles.panelScroll}>
              <div className={shell.propertyGroup}>
                <h4 className={shell.propertyLabel}>Interaction</h4>
                <p className={shell.panelMeta}>Select a frame on the canvas to add prototype links.</p>
              </div>
            </ScrollArea>
          </TabPanel>
        </aside>
      </div>
    </div>
  );
}
