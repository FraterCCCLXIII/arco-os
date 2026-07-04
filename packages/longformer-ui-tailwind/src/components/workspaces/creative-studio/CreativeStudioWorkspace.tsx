import { useMemo, useState } from "react";
import { cx } from "../../../utils/cx";
import { Button } from "../../primitives/Button";
import { IconButton } from "../../primitives/IconButton";
import { Input } from "../../primitives/Input";
import { Label } from "../../primitives/Label";
import { ScrollArea } from "../../primitives/ScrollArea";
import { TabPanel, Tabs } from "../../primitives/Tabs";
import { CanvasRulers, designShellStyles as shell } from "../design-shell";
import { STUDIO_MODES, STUDIO_TOOLS } from "./tools";
import type { StudioBottomPanel, StudioMode, StudioToolId } from "./types";
import styles from "./CreativeStudioWorkspace.tailwind";

export interface CreativeStudioWorkspaceProps {
  className?: string;
}

const H_RULER_MM = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const V_RULER_MM = [0, 20, 40, 60, 80, 100, 120, 140, 160];

const MODE_TABS = STUDIO_MODES.map((mode) => ({ id: mode.id, label: mode.label }));

const COLOR_TABS = [
  { id: "swatches", label: "Swatches" },
  { id: "stroke", label: "Stroke" },
  { id: "appearance", label: "Appearance" },
];

const BOTTOM_TABS = [
  { id: "transform", label: "Transform" },
  { id: "navigator", label: "Navigator" },
  { id: "history", label: "History" },
];

const MODE_HINTS: Record<StudioMode, string> = {
  vector: "Drag to marquee select",
  raster: "Paint on pixel layers",
  layout: "Place frames and master pages",
};

const HISTORY_ITEMS = [
  "Opened Meridian Launch Kit",
  "Added mobile artboard",
  "Drew hero frame",
  "Applied accent fill",
];

/** Affinity-style creative studio with vector, raster, and layout tool modes. */
export function CreativeStudioWorkspace({ className }: CreativeStudioWorkspaceProps) {
  const [mode, setMode] = useState<StudioMode>("vector");
  const [activeTool, setActiveTool] = useState<StudioToolId>("select");
  const [colorTab, setColorTab] = useState("swatches");
  const [bottomPanel, setBottomPanel] = useState<StudioBottomPanel>("transform");
  const [zoom] = useState(53.5);

  const visibleTools = useMemo(
    () => STUDIO_TOOLS.filter((tool) => tool.modes.includes(mode)),
    [mode],
  );

  function handleModeChange(nextMode: StudioMode) {
    setMode(nextMode);
    const stillValid = STUDIO_TOOLS.some((tool) => tool.id === activeTool && tool.modes.includes(nextMode));
    if (!stillValid) setActiveTool("select");
  }

  return (
    <div className={cx(shell.workspace, className)} aria-label="Creative Studio">
      <header className={shell.topBar}>
        <Tabs
          variant="pill"
          items={MODE_TABS}
          value={mode}
          onChange={(id) => handleModeChange(id as StudioMode)}
          aria-label="Studio mode"
        />

        <span className={shell.topBarDivider} />

        <Button variant="ghost" size="sm">
          Document Setup…
        </Button>
        <Button variant="ghost" size="sm">
          App Settings…
        </Button>

        <span className={shell.topBarSpacer} />

        <div className={shell.topBarGroup}>
          <IconButton icon="target" label="Snap settings" size="sm" />
          <IconButton icon="align-center" label="Align" size="sm" />
          <Button variant="secondary" size="sm">
            Export SVG
          </Button>
        </div>
      </header>

      <div className={shell.body}>
        <aside className={shell.toolRail} aria-label={`${mode} tools`}>
          {visibleTools.map((tool) => (
            <IconButton
              key={tool.id}
              icon={tool.icon}
              label={tool.label}
              size="sm"
              variant={activeTool === tool.id ? "secondary" : "ghost"}
              aria-pressed={activeTool === tool.id}
              onClick={() => setActiveTool(tool.id)}
            />
          ))}
          <button
            type="button"
            className={cx(shell.fillSwatch, styles.fillSwatchSuccess)}
            aria-label="Active fill color"
          />
        </aside>

        <CanvasRulers
          horizontalTicks={H_RULER_MM}
          verticalTicks={V_RULER_MM}
          canvasClassName={shell.canvasCentered}
        >
          <div className={styles.artboard} role="img" aria-label="Artboard" />
        </CanvasRulers>

        <aside className={cx(shell.sidePanel, shell.sidePanelRight)} aria-label="Properties">
          <ScrollArea className={styles.panelScroll}>
            <section className={shell.panelHeader}>
              <h2 className={shell.sectionTitle}>Color</h2>
              <div className={styles.colorWheel} aria-hidden>
                <div className={styles.colorWheelInner} />
              </div>
              <Tabs
                variant="underline"
                items={COLOR_TABS}
                value={colorTab}
                onChange={setColorTab}
                aria-label="Color panel"
              />
              <TabPanel id="swatches" active={colorTab === "swatches"}>
                <div className={styles.colorRow}>
                  <span className={styles.colorSwatch} />
                  <Input defaultValue="#04C418" aria-label="Hex color" />
                </div>
              </TabPanel>
              <TabPanel id="stroke" active={colorTab === "stroke"}>
                <div className={styles.colorRow}>
                  <span className={styles.colorSwatch} style={{ background: "transparent" }} />
                  <Input defaultValue="None" aria-label="Stroke color" />
                </div>
              </TabPanel>
              <TabPanel id="appearance" active={colorTab === "appearance"}>
                <div className={styles.fieldRow}>
                  <Label className={styles.fieldLabel}>Opacity</Label>
                  <Input defaultValue="100%" aria-label="Opacity" />
                </div>
              </TabPanel>
            </section>

            <section className={shell.propertyGroup}>
              <h2 className={shell.propertyLabel}>Character</h2>
              <div className={styles.fieldRow}>
                <Label className={styles.fieldLabel}>Font</Label>
                <select className={styles.exportSelect} defaultValue="arial" aria-label="Font family">
                  <option value="arial">Arial</option>
                  <option value="helvetica">Helvetica</option>
                  <option value="inter">Inter</option>
                </select>
              </div>
              <div className={styles.fieldRow}>
                <Label className={styles.fieldLabel}>Size</Label>
                <Input defaultValue="12 pt" aria-label="Font size" />
              </div>
              <div className={styles.fieldRow}>
                <Label className={styles.fieldLabel}>Weight</Label>
                <select className={styles.exportSelect} defaultValue="regular" aria-label="Font weight">
                  <option value="regular">Regular</option>
                  <option value="medium">Medium</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
              <div className={styles.textDecorRow}>
                <Button variant="ghost" size="sm">
                  U
                </Button>
                <Button variant="ghost" size="sm">
                  S
                </Button>
                <Button variant="secondary" size="sm">
                  B
                </Button>
                <Button variant="ghost" size="sm">
                  I
                </Button>
              </div>
            </section>

            <section className={shell.propertyGroup}>
              <h2 className={shell.propertyLabel}>Position &amp; Transform</h2>
              <div className={styles.fieldRow}>
                <Label className={styles.fieldLabel}>VA</Label>
                <Input defaultValue="0" aria-label="Tracking" />
              </div>
              <div className={styles.fieldRow}>
                <Label className={styles.fieldLabel}>Leading</Label>
                <Input defaultValue="Auto" aria-label="Leading" />
              </div>
            </section>
          </ScrollArea>

          <div className={styles.bottomPanel}>
            <div className={shell.panelTabBar}>
              <Tabs
                variant="underline"
                items={BOTTOM_TABS}
                value={bottomPanel}
                onChange={(id) => setBottomPanel(id as StudioBottomPanel)}
                aria-label="Bottom panel"
              />
            </div>
            <div className={styles.bottomBody}>
              <TabPanel id="transform" active={bottomPanel === "transform"}>
                <div className={styles.transformGrid}>
                  {[
                    { label: "X", value: "0 mm" },
                    { label: "Y", value: "0 mm" },
                    { label: "W", value: "210 mm" },
                    { label: "H", value: "297 mm" },
                    { label: "R", value: "0°" },
                    { label: "S", value: "0°" },
                  ].map((field) => (
                    <label key={field.label} className={styles.transformField}>
                      <span className={styles.transformLabel}>{field.label}</span>
                      <Input defaultValue={field.value} readOnly aria-label={field.label} />
                    </label>
                  ))}
                </div>
              </TabPanel>
              <TabPanel id="navigator" active={bottomPanel === "navigator"}>
                <div className={styles.navigatorPreview} aria-label="Navigator preview" />
              </TabPanel>
              <TabPanel id="history" active={bottomPanel === "history"}>
                <ul className={styles.historyList}>
                  {HISTORY_ITEMS.map((item, index) => (
                    <li
                      key={item}
                      className={cx(styles.historyItem, index === HISTORY_ITEMS.length - 1 && styles.historyItemActive)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </TabPanel>
            </div>
          </div>
        </aside>
      </div>

      <footer className={shell.statusBar}>
        <span>{MODE_HINTS[mode]}</span>
        <span>{zoom}%</span>
      </footer>
    </div>
  );
}
