import type { GeneratedBlock } from "../generated-ui/types";
import type { CardFamilyId } from "./ontology";

/** Curated live samples keyed by card family for the Design System catalog. */
export const CARD_FAMILY_SAMPLES: Record<CardFamilyId, GeneratedBlock[]> = {
  metrics: [
    {
      id: "ds-stat",
      type: "statCards",
      title: "Stat cards",
      cards: [
        { id: "s1", label: "Active users", value: "12.4k", caption: "+8% this week", icon: "users", tone: "accent" },
        { id: "s2", label: "Avg. session", value: "6m 12s", caption: "Stable", icon: "clock", tone: "success" },
      ],
    },
    {
      id: "ds-metric-chart",
      type: "metricChartCards",
      title: "Metric charts",
      cards: [
        {
          id: "mc1",
          label: "Revenue",
          value: "$48.2k",
          change: { amount: "+$4.1k", percent: "+9.3%", direction: "up" },
          chartValues: [12, 18, 14, 22, 19, 26, 24],
        },
      ],
    },
  ],
  commerce: [
    {
      id: "ds-media",
      type: "mediaCards",
      title: "Media cards",
      cards: [
        {
          id: "m1",
          tone: "accent",
          title: "Santorini Villa",
          description: "Private infinity pool with sunset views.",
          badges: [{ icon: "star", label: "4.8" }],
          actionLabel: "Reserve",
        },
      ],
    },
    {
      id: "ds-listing",
      type: "listingCards",
      title: "Listing cards",
      cards: [
        {
          id: "l1",
          avatarName: "Acme",
          title: "Senior Product Designer",
          subtitle: "Remote · Posted 2 days ago",
          tags: ["Contract"],
          price: "$95",
          priceMeta: "/hr",
          actionLabel: "Apply",
        },
      ],
    },
  ],
  finance: [
    {
      id: "ds-expense",
      type: "expenseCards",
      title: "Expense cards",
      cards: [
        {
          id: "e1",
          tone: "warning",
          category: "Travel",
          merchant: "United Airlines",
          amount: "$428.00",
          icon: "plane",
        },
      ],
    },
    {
      id: "ds-fear-greed",
      type: "fearGreedCards",
      title: "Market sentiment",
      cards: [
        {
          id: "fg1",
          title: "Fear & Greed",
          score: 72,
          label: "Greed",
          leftPercent: 28,
          rightPercent: 72,
        },
      ],
    },
  ],
  productivity: [
    {
      id: "ds-task",
      type: "taskChecklistCards",
      title: "Task checklists",
      cards: [
        {
          id: "t1",
          title: "Launch checklist",
          items: [
            { label: "Finalize copy", completed: true },
            { label: "QA desktop shell", completed: false },
          ],
          progress: 50,
          progressLabel: "1 of 2",
        },
      ],
    },
    {
      id: "ds-event",
      type: "eventCards",
      title: "Event cards",
      cards: [
        {
          id: "ev1",
          label: "Today",
          title: "Design review",
          startTime: "2:00 PM",
          endTime: "3:00 PM",
          timeLeft: { icon: "clock", label: "In 45 min" },
        },
      ],
    },
  ],
  social: [
    {
      id: "ds-session",
      type: "sessionCards",
      title: "Session cards",
      cards: [
        {
          id: "ss1",
          headline: "Live now",
          avatarName: "Maya Chen",
          title: "Intro to agent UI",
          subtitle: "Design systems track",
          tags: ["Workshop"],
        },
      ],
    },
    {
      id: "ds-news",
      type: "newsFeedCards",
      title: "News feed",
      cards: [
        {
          id: "n1",
          source: "Longformer",
          headline: "Design tokens ship in theme.css",
          excerpt: "Every component reads from CSS custom properties.",
          imageTone: "accent",
        },
      ],
    },
    {
      id: "ds-video-player",
      type: "videoPlayerCards",
      title: "Video player",
      cards: [
        {
          id: "vp1",
          elapsed: "1:43",
          duration: "1:43",
          progress: 100,
          ended: true,
          imageTone: "neutral",
        },
        {
          id: "vp2",
          elapsed: "0:42",
          duration: "1:43",
          progress: 41,
          ended: false,
          imageTone: "accent",
        },
      ],
    },
  ],
  device: [
    {
      id: "ds-device",
      type: "deviceCards",
      title: "Device cards",
      cards: [
        {
          id: "d1",
          title: "MacBook Pro",
          subtitle: "Connected",
          status: "87%",
          statusTone: "success",
          icon: "monitor",
          progress: 87,
        },
      ],
    },
    {
      id: "ds-battery",
      type: "batteryStatusCards",
      title: "Battery status",
      cards: [{ id: "b1", percent: "87%", powerMode: "Low Power", timeRemaining: "4h 12m", tone: "success" }],
    },
  ],
  dashboard: [
    {
      id: "ds-active-projects",
      type: "activeProjectsCards",
      title: "Active projects",
      cards: [
        {
          id: "ap1",
          title: "Active projects",
          subtitle: "Average 72% completion",
          items: [
            { name: "Desktop shell", progress: 84, tone: "accent" },
            { name: "Agent surfaces", progress: 61, tone: "green" },
          ],
        },
      ],
    },
  ],
  "design-media": [
    {
      id: "ds-palette",
      type: "colorPaletteCards",
      title: "Color palettes",
      cards: [
        {
          id: "cp1",
          swatches: [
            { color: "#5b8def", label: "Accent" },
            { color: "#3fbf72", label: "Success" },
            { color: "#e3a53c", label: "Warning" },
            { color: "#ea5f5f", label: "Danger" },
          ],
        },
      ],
    },
  ],
  collections: [
    {
      id: "ds-collection",
      type: "cardCollection",
      title: "Responsive grid",
      subtitle: "Mixed banking and finance widgets in a auto-fill layout.",
      layout: "grid",
      itemHeight: 220,
      items: [
        {
          id: "c1",
          kind: "banking",
          variant: "monthlyRevenue",
          amount: "$12,890.67",
          period: "Jan – Feb 2025",
          thisMonth: [42, 55, 48, 68],
          previousMonth: [38, 44, 52, 58],
        },
      ],
    },
  ],
};

export const WIDGET_SAMPLES: GeneratedBlock[] = [
  {
    id: "ds-glass",
    type: "glassWidgets",
    title: "Glass widgets",
    widgets: [
      { id: "gw1", variant: "analogClock", size: "md" },
      { id: "gw2", variant: "musicWidget", size: "md", title: "Midnight City", artist: "M83" },
    ],
  },
  {
    id: "ds-creator",
    type: "creatorWidgets",
    title: "Creator widgets",
    widgets: [
      {
        id: "cw1",
        variant: "newsletterSignup",
        publisherName: "Longformer",
        headline: "Weekly design drops",
        issueValue: "12",
        issueLabel: "issues",
        subscriberCount: "4.2k subscribers",
      },
    ],
  },
];

export function blocksForCardFamily(familyId: CardFamilyId): GeneratedBlock[] {
  return CARD_FAMILY_SAMPLES[familyId] ?? [];
}
