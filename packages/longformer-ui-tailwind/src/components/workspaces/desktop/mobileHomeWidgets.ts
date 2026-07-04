import type { WidgetTile } from "./widget-types";

const DEFAULT_MOBILE_WIDGET_COLUMNS: WidgetTile[][] = [
  [
    {
      id: "mobile-weather",
      content: {
        type: "kpi",
        icon: "sun",
        label: "Weather",
        value: "72°",
        meta: "Partly cloudy · Toronto",
      },
    },
    {
      id: "mobile-steps",
      content: {
        type: "stat",
        props: {
          icon: "heart",
          label: "Steps today",
          value: "5,548",
          caption: "1-day streak",
          tone: "accent",
          visualization: { type: "bars", values: [3, 5, 4, 6, 7, 5, 8] },
        },
      },
    },
  ],
  [
    {
      id: "mobile-calendar",
      content: {
        type: "calendarSchedule",
        props: {
          monthLabel: "July 2026",
          days: Array.from({ length: 31 }, (_, index) => ({
            value: index + 1,
            selected: index + 1 === 1,
          })),
          events: [
            { timeRange: "9:00 AM", title: "Design review", tone: "accent" as const },
            { timeRange: "1:30 PM", title: "Lunch with Alex", tone: "neutral" as const },
          ],
        },
      },
    },
  ],
  [
    {
      id: "mobile-tasks",
      content: {
        type: "taskChecklist",
        props: {
          title: "Today",
          items: [
            { label: "Review pull requests", completed: true },
            { label: "Ship mobile widgets", completed: false },
            { label: "Plan sprint demo", completed: false },
          ],
          progress: 33,
          progressLabel: "1 of 3 done",
        },
      },
    },
    {
      id: "mobile-battery",
      content: {
        type: "batteryStatus",
        props: {
          percent: "86%",
          powerMode: "Balanced",
          timeRemaining: "4h 12m remaining",
          tone: "success" as const,
        },
      },
    },
  ],
];

/** Split widget tiles into swipeable phone columns. */
export function splitWidgetsIntoColumns(tiles: WidgetTile[], widgetsPerColumn = 2): WidgetTile[][] {
  const source = tiles.length > 0 ? tiles : DEFAULT_MOBILE_WIDGET_COLUMNS.flat();
  const columns: WidgetTile[][] = [];

  for (let index = 0; index < source.length; index += widgetsPerColumn) {
    columns.push(source.slice(index, index + widgetsPerColumn));
  }

  if (columns.length === 0) {
    return DEFAULT_MOBILE_WIDGET_COLUMNS;
  }

  return columns.slice(0, 4);
}
