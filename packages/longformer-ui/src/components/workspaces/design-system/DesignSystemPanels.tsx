import { useState } from "react";
import { Icon } from "../../../icons";
import {
  Avatar,
  Badge,
  Button,
  CalculatorPad,
  OmronCalculatorPad,
  Card,
  Chip,
  CountBadge,
  Divider,
  EmptyState,
  IconButton,
  Input,
  ListItem,
  Tabs,
} from "../../primitives";
import { GeneratedSurface } from "../generated-ui/GeneratedSurface";
import type { GeneratedSurfaceSchema } from "../generated-ui/types";
import { DesignSystemSection, OntologyGrid, SwatchGrid, TokenTable } from "./DesignSystemSection";
import { MasonryGalleryPanel } from "./MasonryGalleryPanel";
import {
  CARD_FAMILIES,
  COMPONENT_CATEGORIES,
  DESIGN_SYSTEM_REALMS,
  DESIGN_SYSTEM_TABS,
  WIDGET_FAMILIES,
  tabsForRealm,
  type CardFamilyId,
  type DesignSystemTabId,
} from "./ontology";
import { blocksForCardFamily, WIDGET_SAMPLES } from "./samples";
import {
  COLOR_GROUPS,
  MOTION_TOKENS,
  RADIUS_SCALE,
  SHADOW_SCALE,
  SPACING_SCALE,
  TYPOGRAPHY_TOKENS,
} from "./token-data";
import styles from "./DesignSystemWorkspace.module.css";

export function OverviewPanel() {
  return (
    <>
      {(["foundations", "library", "reference"] as const).map((realm) => (
        <DesignSystemSection
          key={realm}
          title={DESIGN_SYSTEM_REALMS[realm].label}
          description={DESIGN_SYSTEM_REALMS[realm].description}
        >
          <OntologyGrid
            items={tabsForRealm(realm).map((tab) => ({
              label: tab.label,
              description: tab.description,
              meta: tab.id,
            }))}
          />
        </DesignSystemSection>
      ))}

      <DesignSystemSection title="Card ontology" description="Nine families group every generated card block type.">
        <OntologyGrid
          items={CARD_FAMILIES.map((family) => ({
            label: family.label,
            description: family.description,
            meta: `${family.blockTypes.length} block types`,
          }))}
        />
      </DesignSystemSection>
    </>
  );
}

export function TypographyPanel() {
  return (
    <>
      <DesignSystemSection title="Font families" description="Semantic families for product, code, and specialty widgets.">
        <div className={styles.typeSamples}>
          {TYPOGRAPHY_TOKENS.families.map((family) => (
            <div key={family.variable} className={styles.typeSample}>
              <div className={styles.typeSampleMeta}>
                <span className={styles.typeSampleName}>{family.name}</span>
                <code className={styles.tokenVariable}>{family.variable}</code>
              </div>
              <p className={styles.typeSampleText} style={{ fontFamily: `var(${family.variable})` }}>
                {family.sample}
              </p>
            </div>
          ))}
        </div>
      </DesignSystemSection>

      <DesignSystemSection title="Type scale">
        <div className={styles.typeScale}>
          {TYPOGRAPHY_TOKENS.sizes.map((size) => (
            <div key={size.variable} className={styles.typeScaleRow}>
              <code className={styles.tokenVariable}>{size.variable}</code>
              <span className={styles.typeScaleSample} style={{ fontSize: `var(${size.variable})` }}>
                {size.sample}
              </span>
            </div>
          ))}
        </div>
      </DesignSystemSection>

      <DesignSystemSection title="Line height">
        <TokenTable
          rows={TYPOGRAPHY_TOKENS.lineHeights.map((item) => ({
            name: item.name,
            variable: item.variable,
            meta: item.value,
          }))}
        />
      </DesignSystemSection>
    </>
  );
}

export function ColorPanel() {
  return (
    <>
      {COLOR_GROUPS.map((group) => (
        <DesignSystemSection key={group.title} title={group.title}>
          <SwatchGrid tokens={group.tokens} />
        </DesignSystemSection>
      ))}
    </>
  );
}

export function SpacingPanel() {
  return (
    <>
      <DesignSystemSection title="Spacing scale" description="4px base grid used across padding and gaps.">
        <div className={styles.spacingGrid}>
          {SPACING_SCALE.map((token) => (
            <div key={token.variable} className={styles.spacingItem}>
              <div className={styles.spacingBar} style={{ width: `var(${token.variable})` }} />
              <code className={styles.tokenVariable}>{token.variable}</code>
              <span className={styles.tokenMeta}>{token.value}</span>
            </div>
          ))}
        </div>
      </DesignSystemSection>

      <DesignSystemSection title="Radius">
        <TokenTable rows={RADIUS_SCALE.map((t) => ({ name: t.name, variable: t.variable, meta: t.value }))} />
        <div className={styles.radiusPreview}>
          {RADIUS_SCALE.map((token) => (
            <div key={token.variable} className={styles.radiusTile} style={{ borderRadius: `var(${token.variable})` }}>
              {token.name}
            </div>
          ))}
        </div>
      </DesignSystemSection>

      <DesignSystemSection title="Elevation">
        <div className={styles.shadowGrid}>
          {SHADOW_SCALE.map((token) => (
            <div key={token.variable} className={styles.shadowTile} style={{ boxShadow: `var(${token.variable})` }}>
              <code className={styles.tokenVariable}>{token.variable}</code>
              <span>{token.value}</span>
            </div>
          ))}
        </div>
      </DesignSystemSection>

      <DesignSystemSection title="Motion">
        <TokenTable rows={MOTION_TOKENS.map((t) => ({ name: t.name, variable: t.variable, meta: t.value }))} />
      </DesignSystemSection>
    </>
  );
}

export function ComponentsPanel() {
  return (
    <>
      {COMPONENT_CATEGORIES.map((category) => (
        <DesignSystemSection
          key={category.id}
          title={category.label}
          description={`${category.description} Includes ${category.examples.join(", ")}.`}
        >
          {category.id === "actions" && (
            <div className={styles.componentRow}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <IconButton icon="plus" label="Add" />
            </div>
          )}
          {category.id === "forms" && (
            <div className={styles.componentColumn}>
              <Input placeholder="Search the design system" startSlot={<Icon name="search" size={14} />} />
              <div className={styles.componentRow}>
                <Chip active>Selected</Chip>
                <Chip>Default</Chip>
              </div>
              <div className={styles.calculatorPreviewRow}>
                <CalculatorPad />
                <OmronCalculatorPad />
              </div>
            </div>
          )}
          {category.id === "feedback" && (
            <div className={styles.componentRow}>
              <Badge tone="accent">Accent</Badge>
              <Badge tone="success" dot>
                Online
              </Badge>
              <CountBadge count={12} />
            </div>
          )}
          {category.id === "data-display" && (
            <Card padding="md" className={styles.patternCard}>
              <div className={styles.componentRow}>
                <Avatar name="Alex Morgan" status="online" />
                <ListItem leading={<Icon name="folder" size={15} />} label="List item" description="Secondary line" />
              </div>
              <Divider />
            </Card>
          )}
          {category.id === "navigation" && (
            <Tabs
              items={[
                { id: "a", label: "Overview" },
                { id: "b", label: "Tokens" },
                { id: "c", label: "Components" },
              ]}
              value="a"
              onChange={() => undefined}
            />
          )}
        </DesignSystemSection>
      ))}
    </>
  );
}

export function CardsPanel() {
  const [familyId, setFamilyId] = useState<CardFamilyId>("metrics");
  const family = CARD_FAMILIES.find((item) => item.id === familyId)!;
  const blocks = blocksForCardFamily(familyId);

  return (
    <>
      <DesignSystemSection title="Card families" description="Browse live samples by ontology category.">
        <Tabs
          className={styles.familyTabs}
          variant="underline"
          items={CARD_FAMILIES.map((item) => ({ id: item.id, label: item.label }))}
          value={familyId}
          onChange={(id) => setFamilyId(id as CardFamilyId)}
          aria-label="Card families"
        />
        <p className={styles.familyDescription}>{family.description}</p>
        <div className={styles.blockTypeList}>
          {family.blockTypes.map((type) => (
            <Chip key={type}>{type}</Chip>
          ))}
        </div>
      </DesignSystemSection>

      <DesignSystemSection title={`${family.label} samples`}>
        <div className={styles.previewSurface}>
          <GeneratedSurface schema={{ id: `ds-${familyId}`, blocks }} />
        </div>
      </DesignSystemSection>
    </>
  );
}

export function WidgetsPanel() {
  return (
    <>
      <DesignSystemSection title="Widget families">
        <OntologyGrid
          items={WIDGET_FAMILIES.map((family) => ({
            label: family.label,
            description: family.description,
            meta: family.blockTypes.join(", "),
          }))}
        />
      </DesignSystemSection>

      <DesignSystemSection title="Live samples">
        <div className={styles.previewSurface}>
          <GeneratedSurface schema={{ id: "ds-widgets", blocks: WIDGET_SAMPLES }} />
        </div>
      </DesignSystemSection>
    </>
  );
}

export function PatternsPanel() {
  return (
    <>
      <DesignSystemSection title="Shell patterns" description="Recurring layout primitives across workspaces.">
        <OntologyGrid
          items={[
            { label: "AppShell", description: "Rail, sidebar, main, and optional context panel.", meta: "shell" },
            { label: "NavRail", description: "Far-left workspace switcher with overflow.", meta: "shell" },
            { label: "NavSidebar", description: "Grouped navigation with profile footer.", meta: "shell" },
            { label: "ListPane", description: "Master-detail list column for messages and email.", meta: "shell" },
          ]}
        />
      </DesignSystemSection>

      <DesignSystemSection title="Empty states">
        <EmptyState
          icon={<Icon name="sparkles" size={22} />}
          title="Nothing selected"
          description="Use empty states when a pane has no active selection."
        />
      </DesignSystemSection>
    </>
  );
}

export function GeneratedPanel({ schema }: { schema?: GeneratedSurfaceSchema }) {
  if (!schema) {
    return (
      <DesignSystemSection title="Generated UI" description="Pass a GeneratedSurfaceSchema to preview agent output.">
        <EmptyState
          icon={<Icon name="code" size={22} />}
          title="No schema provided"
          description="Agent-generated blocks render here when a schema is supplied."
        />
      </DesignSystemSection>
    );
  }

  return (
    <DesignSystemSection
      title="Agent surface preview"
      description="Plain JSON blocks rendered by GeneratedSurface — the reference path for inline agent UI."
    >
      <div className={styles.previewSurfaceWide}>
        <GeneratedSurface schema={schema} />
      </div>
    </DesignSystemSection>
  );
}

export function renderDesignSystemPanel(tab: DesignSystemTabId, generatedSchema?: GeneratedSurfaceSchema) {
  switch (tab) {
    case "overview":
      return <OverviewPanel />;
    case "typography":
      return <TypographyPanel />;
    case "color":
      return <ColorPanel />;
    case "spacing":
      return <SpacingPanel />;
    case "components":
      return <ComponentsPanel />;
    case "cards":
      return <CardsPanel />;
    case "widgets":
      return <WidgetsPanel />;
    case "patterns":
      return <PatternsPanel />;
    case "gallery":
      return <MasonryGalleryPanel generatedSchema={generatedSchema} />;
    case "generated":
      return <GeneratedPanel schema={generatedSchema} />;
    default:
      return null;
  }
}

export function designSystemTabMeta(tabId: DesignSystemTabId) {
  return DESIGN_SYSTEM_TABS.find((tab) => tab.id === tabId);
}
