import type { GeneratedBlock } from "../generated-ui/types";

/** Top-level realms that organize the design system catalog. */
export type DesignSystemRealm = "foundations" | "library" | "reference";

/** Primary tabs across the Design System workspace. */
export type DesignSystemTabId =
  | "overview"
  | "typography"
  | "color"
  | "spacing"
  | "components"
  | "cards"
  | "widgets"
  | "patterns"
  | "gallery"
  | "generated";

export interface DesignSystemTab {
  id: DesignSystemTabId;
  label: string;
  description: string;
  realm: DesignSystemRealm;
}

export const DESIGN_SYSTEM_REALMS: Record<
  DesignSystemRealm,
  { label: string; description: string }
> = {
  foundations: {
    label: "Foundations",
    description: "Tokens and primitives that every surface inherits.",
  },
  library: {
    label: "Library",
    description: "Composed components, cards, and widgets ready to ship.",
  },
  reference: {
    label: "Reference",
    description: "Agent-generated surfaces and schema-driven rendering.",
  },
};

export const DESIGN_SYSTEM_TABS: DesignSystemTab[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Ontology map and how the kit is organized.",
    realm: "foundations",
  },
  {
    id: "typography",
    label: "Typography",
    description: "Font families, sizes, and hierarchy.",
    realm: "foundations",
  },
  {
    id: "color",
    label: "Color",
    description: "Surfaces, text, brand, and semantic palettes.",
    realm: "foundations",
  },
  {
    id: "spacing",
    label: "Spacing",
    description: "Space scale, radius, elevation, and motion.",
    realm: "foundations",
  },
  {
    id: "components",
    label: "Components",
    description: "Interactive primitives — buttons, inputs, badges, and more.",
    realm: "library",
  },
  {
    id: "cards",
    label: "Cards",
    description: "Data-dense card families grouped by domain.",
    realm: "library",
  },
  {
    id: "widgets",
    label: "Widgets",
    description: "Dashboard tiles, glass widgets, and creator layouts.",
    realm: "library",
  },
  {
    id: "patterns",
    label: "Patterns",
    description: "Shell layouts, lists, tabs, and empty states.",
    realm: "library",
  },
  {
    id: "gallery",
    label: "Gallery",
    description: "Masonry grid of every component, card, and widget in the kit.",
    realm: "library",
  },
  {
    id: "generated",
    label: "Generated UI",
    description: "JSON schema blocks rendered inline by agents.",
    realm: "reference",
  },
];

/** Card families — the ontology for generated card block types. */
export type CardFamilyId =
  | "metrics"
  | "commerce"
  | "finance"
  | "productivity"
  | "social"
  | "device"
  | "dashboard"
  | "design-media"
  | "collections";

export interface CardFamily {
  id: CardFamilyId;
  label: string;
  description: string;
  blockTypes: GeneratedBlock["type"][];
}

export const CARD_FAMILIES: CardFamily[] = [
  {
    id: "metrics",
    label: "Metrics & charts",
    description: "KPIs, trend lines, gauges, and progress readouts.",
    blockTypes: [
      "statCards",
      "metricChartCards",
      "miniStatChartCards",
      "statisticsProgressCards",
      "targetChartCards",
      "quizScoreCards",
      "timeSpentCards",
      "weeklyStreakCards",
      "globalRankingCards",
      "enrollmentChartCards",
    ],
  },
  {
    id: "commerce",
    label: "Commerce & listings",
    description: "Marketplace tiles, media cards, and listing rows.",
    blockTypes: ["cardGrid", "mediaCards", "listingCards", "assetShowcaseCards"],
  },
  {
    id: "finance",
    label: "Finance & markets",
    description: "Expenses, crypto, flow reports, and market sentiment.",
    blockTypes: [
      "expenseCards",
      "cryptoMarketCards",
      "flowReportCards",
      "savedMoneyCards",
      "fearGreedCards",
      "expenseGaugeCards",
      "earningReportsCards",
      "salesOverviewCards",
      "spentThisMonthCards",
    ],
  },
  {
    id: "productivity",
    label: "Productivity",
    description: "Tasks, calendars, events, routes, and schedules.",
    blockTypes: [
      "taskChecklistCards",
      "calendarScheduleCards",
      "eventCards",
      "scheduleSlots",
      "routeCards",
      "meetingCountdownCards",
      "timelineSteps",
      "selectionTiles",
    ],
  },
  {
    id: "social",
    label: "Social & content",
    description: "Sessions, profiles, news, music, and translation.",
    blockTypes: [
      "sessionCards",
      "profileSummaryCards",
      "profileGridCards",
      "newsFeedCards",
      "musicPlayerCards",
      "translationCards",
      "insightCards",
      "courseCards",
    ],
  },
  {
    id: "device",
    label: "Device & system",
    description: "Hardware status, VPN, battery, and timezone utilities.",
    blockTypes: ["deviceCards", "batteryStatusCards", "vpnConnectionCards", "timezoneCards", "activityCards"],
  },
  {
    id: "dashboard",
    label: "Dashboard analytics",
    description: "Executive summaries and operational dashboards.",
    blockTypes: [
      "activeProjectsCards",
      "subscribersChartCards",
      "webinarCtaCards",
      "filterSections",
    ],
  },
  {
    id: "design-media",
    label: "Design & media",
    description: "Palettes, design cards, and visual showcases.",
    blockTypes: ["colorPaletteCards", "designCards"],
  },
  {
    id: "collections",
    label: "Collections",
    description: "Responsive grids and carousels of mixed widget tiles.",
    blockTypes: ["cardCollection"],
  },
];

export type WidgetFamilyId = "glass" | "creator" | "banking-finance";

export interface WidgetFamily {
  id: WidgetFamilyId;
  label: string;
  description: string;
  blockTypes: GeneratedBlock["type"][];
}

export const WIDGET_FAMILIES: WidgetFamily[] = [
  {
    id: "glass",
    label: "Glass widgets",
    description: "Frosted, phone-native tiles for ambient information.",
    blockTypes: ["glassWidgets"],
  },
  {
    id: "creator",
    label: "Creator widgets",
    description: "Courses, streams, newsletters, and coaching slots.",
    blockTypes: ["creatorWidgets"],
  },
  {
    id: "banking-finance",
    label: "Banking & finance tiles",
    description: "Specialized dashboard widgets in card collections.",
    blockTypes: ["cardCollection"],
  },
];

export type ComponentCategoryId =
  | "actions"
  | "forms"
  | "feedback"
  | "data-display"
  | "navigation";

export interface ComponentCategory {
  id: ComponentCategoryId;
  label: string;
  description: string;
  examples: string[];
}

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    id: "actions",
    label: "Actions",
    description: "Triggers and icon affordances.",
    examples: ["Button", "IconButton"],
  },
  {
    id: "forms",
    label: "Forms",
    description: "Text entry and selection controls.",
    examples: ["Input", "Textarea", "Checkbox", "Chip"],
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Status, counts, and inline messaging.",
    examples: ["Badge", "CountBadge", "EmptyState", "Tooltip"],
  },
  {
    id: "data-display",
    label: "Data display",
    description: "Identity and structured rows.",
    examples: ["Avatar", "ListItem", "Card", "Divider"],
  },
  {
    id: "navigation",
    label: "Navigation",
    description: "Tabs, menus, and shell chrome.",
    examples: ["Tabs", "Menu", "NavRail", "NavSidebar"],
  },
];

export function tabsForRealm(realm: DesignSystemRealm): DesignSystemTab[] {
  return DESIGN_SYSTEM_TABS.filter((tab) => tab.realm === realm);
}

export function cardFamilyForBlockType(type: GeneratedBlock["type"]): CardFamily | undefined {
  return CARD_FAMILIES.find((family) => family.blockTypes.includes(type));
}
