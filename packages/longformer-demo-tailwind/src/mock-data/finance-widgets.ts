import type { WidgetTile } from "longformer-ui-tailwind";

/** Finance dashboard tiles — lime, lavender, and charcoal surfaces. */
export const financeWidgetTiles: WidgetTile[] = [
  {
    id: "finance-expenses",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "financeWidget",
      props: {
        variant: "expenses",
        tag: "EXPENSES",
        period: "In the past 7 days",
        total: "32K",
        segments: [
          { label: "Relax", percent: 54, color: "teal" },
          { label: "Food", percent: 27, color: "lavender" },
          { label: "Transport", percent: 12, color: "lime" },
          { label: "Pets", percent: 7, color: "orange" },
        ],
      },
    },
  },
  {
    id: "finance-current-balance",
    colSpan: 4,
    content: {
      type: "financeWidget",
      props: {
        variant: "currentBalance",
        amount: "$ 1248",
        change: "+3,51 %",
        label: "Current balance",
      },
    },
  },
  {
    id: "finance-progress",
    colSpan: 4,
    content: {
      type: "financeWidget",
      props: {
        variant: "progress",
        title: "Progress",
        value: "72,5%",
        pill: "+0,10 (+0,13%)",
      },
    },
  },
  {
    id: "finance-subscription",
    colSpan: 4,
    content: {
      type: "financeWidget",
      props: {
        variant: "subscription",
        monthLabel: "THIS MONTH",
        count: "4 subs",
        totalLabel: "TOTAL",
        total: "$25.99",
        nextLabel: "NEXT PAYMENT IN 4 DAYS",
        nextPayment: "Spotify — $9.99",
      },
    },
  },
  {
    id: "finance-performance",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "financeWidget",
      props: {
        variant: "performance",
        tag: "PERFORMANCE",
        headline: "+280%",
        period: "In the past 30 days",
        bars: [
          { label: "12%", value: 12 },
          { label: "78%", value: 78 },
          { label: "62%", value: 62 },
          { label: "70%", value: 70 },
          { label: "75%", value: 75 },
          { label: "95%", value: 95 },
        ],
        footerLabel: "SEE ALL",
      },
    },
  },
  {
    id: "finance-balance",
    colSpan: 8,
    rowSpan: 2,
    content: {
      type: "financeWidget",
      props: {
        variant: "balance",
        title: "Balance",
        period: "monthly",
        highlightValue: "5",
        highlightUnit: "%",
        series: [
          {
            id: "lavender",
            color: "lavender",
            label: "12450",
            percent: "40%",
            values: [42, 48, 52, 58, 55, 62, 68],
          },
          {
            id: "teal",
            color: "teal",
            label: "11252",
            percent: "11%",
            values: [38, 44, 46, 50, 48, 54, 60],
          },
        ],
        chartLabels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
        tooltip: { label: "PROF./H", value: "12 450" },
      },
    },
  },
];
