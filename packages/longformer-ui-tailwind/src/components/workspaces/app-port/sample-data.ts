import type { AdaptiveListItem, AdaptiveNavItem } from "./types";

export const SAMPLE_APP_NAV: AdaptiveNavItem[] = [
  { id: "inbox", label: "Inbox", icon: "inbox" },
  { id: "active", label: "Active", icon: "layers" },
  { id: "archive", label: "Archive", icon: "folder" },
];

/** Extra destinations used to demo bottom-nav overflow on phone. */
export const SAMPLE_APP_OVERFLOW_NAV: AdaptiveNavItem[] = [
  ...SAMPLE_APP_NAV,
  { id: "drafts", label: "Drafts", icon: "edit" },
  { id: "starred", label: "Starred", icon: "star" },
  { id: "reports", label: "Reports", icon: "notebook" },
  { id: "team", label: "Team", icon: "users" },
  { id: "timeline", label: "Timeline", icon: "calendar" },
  { id: "alerts", label: "Alerts", icon: "bell" },
  { id: "files", label: "Files", icon: "folder" },
  { id: "search", label: "Search", icon: "search" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export const SAMPLE_APP_ITEMS: Record<string, AdaptiveListItem[]> = {
  inbox: [
    {
      id: "brief",
      title: "Launch brief",
      subtitle: "Finalize copy and hero assets",
      meta: "Today",
    },
    {
      id: "review",
      title: "Design review",
      subtitle: "Navigation patterns across viewports",
      meta: "Thu",
    },
    {
      id: "sync",
      title: "Weekly sync",
      subtitle: "Surface manager + app port alignment",
      meta: "Fri",
    },
    {
      id: "standup",
      title: "Morning standup",
      subtitle: "Watch list scrolling demo",
      meta: "9:00",
    },
    {
      id: "qa-pass",
      title: "QA pass",
      subtitle: "Verify scroll on 196px watch face",
      meta: "Open",
    },
    {
      id: "assets-export",
      title: "Export assets",
      subtitle: "App icons and launch screens",
      meta: "Due",
    },
    {
      id: "stakeholder-note",
      title: "Stakeholder note",
      subtitle: "Adaptive layout walkthrough",
      meta: "New",
    },
    {
      id: "release-checklist",
      title: "Release checklist",
      subtitle: "Phone overflow + watch lists",
      meta: "Fri",
    },
    {
      id: "metrics-review",
      title: "Metrics review",
      subtitle: "Viewport usage in demo sessions",
      meta: "Mon",
    },
    {
      id: "onboarding-copy",
      title: "Onboarding copy",
      subtitle: "Explain App Port to new users",
      meta: "Draft",
    },
  ],
  active: [
    {
      id: "port",
      title: "App Port workspace",
      subtitle: "Single-app viewport harness",
      meta: "In progress",
    },
    {
      id: "layout",
      title: "Adaptive layout primitives",
      subtitle: "Shared nav / list / detail components",
      meta: "In progress",
    },
    {
      id: "watch-scroll",
      title: "Watch scroll lists",
      subtitle: "Long item lists on tiny screens",
      meta: "Building",
    },
    {
      id: "bottom-nav",
      title: "Bottom nav overflow",
      subtitle: "More menu + horizontal scroll",
      meta: "Building",
    },
    {
      id: "theme-picker",
      title: "Theme switcher",
      subtitle: "Light and dark across viewports",
      meta: "Building",
    },
    {
      id: "modal-resize",
      title: "Modal resize",
      subtitle: "Drag window edges to test scaling",
      meta: "Review",
    },
    {
      id: "tablet-split",
      title: "Tablet split view",
      subtitle: "Icon rail + list + detail",
      meta: "Review",
    },
    {
      id: "mobile-back",
      title: "Mobile top bar",
      subtitle: "Back button in stacked header",
      meta: "Done",
    },
  ],
  archive: [
    {
      id: "desktop",
      title: "Desktop shell polish",
      subtitle: "Window chrome and tray scaling",
      meta: "Done",
    },
    {
      id: "bento",
      title: "Bento board",
      subtitle: "Drag-resize widget grid",
      meta: "Done",
    },
    {
      id: "chat-refactor",
      title: "Chat refactor",
      subtitle: "Conversation tabs and composer",
      meta: "Done",
    },
    {
      id: "email-compose",
      title: "Email compose",
      subtitle: "Modal reply flow",
      meta: "Done",
    },
    {
      id: "tasks-board",
      title: "Tasks board",
      subtitle: "Calendar + list hybrid",
      meta: "Done",
    },
    {
      id: "calendar-week",
      title: "Calendar week view",
      subtitle: "Dense agenda layout",
      meta: "Done",
    },
    {
      id: "maps-prototype",
      title: "Maps prototype",
      subtitle: "Pin cluster interactions",
      meta: "Done",
    },
    {
      id: "wallet-v2",
      title: "Wallet v2",
      subtitle: "Card stack animations",
      meta: "Done",
    },
  ],
  drafts: [
    {
      id: "draft-copy",
      title: "Hero copy draft",
      subtitle: "Waiting on review",
      meta: "Draft",
    },
  ],
  starred: [
    {
      id: "star-port",
      title: "App Port workspace",
      subtitle: "Pinned for daily checks",
      meta: "Starred",
    },
  ],
  reports: [
    {
      id: "report-q2",
      title: "Q2 rollout report",
      subtitle: "Viewport adoption metrics",
      meta: "Weekly",
    },
  ],
  team: [
    {
      id: "team-design",
      title: "Design systems",
      subtitle: "Overflow nav patterns",
      meta: "3 members",
    },
  ],
  timeline: [
    {
      id: "timeline-launch",
      title: "Launch milestone",
      subtitle: "Modal bottom nav QA",
      meta: "Next week",
    },
  ],
  alerts: [
    {
      id: "alert-nav",
      title: "Navigation overflow",
      subtitle: "Scroll the bottom bar to reach hidden tabs",
      meta: "New",
    },
  ],
  files: [
    {
      id: "files-spec",
      title: "Layout spec",
      subtitle: "Phone bottom nav overflow rules",
      meta: "PDF",
    },
  ],
  search: [
    {
      id: "search-recent",
      title: "Recent searches",
      subtitle: "Settings, Timeline, Reports",
      meta: "Saved",
    },
  ],
  settings: [
    {
      id: "settings-nav",
      title: "Navigation density",
      subtitle: "Scroll vs collapse rules",
      meta: "Pref",
    },
  ],
};

export const SAMPLE_APP_DETAILS: Record<string, { title: string; body: string; status: string }> = {
  brief: {
    title: "Launch brief",
    body: "Ship the App Port demo with a sample three-pane app. Navigation stays in the sidebar on desktop, compresses into tabs inside a modal, stacks on phone, and collapses to a glance on watch.",
    status: "Due today",
  },
  review: {
    title: "Design review",
    body: "Walk through how list and detail panes reflow when the viewport changes. Desktop keeps all three regions visible; modal keeps list + detail side by side; phone pushes detail over the list; watch shows a single summary card.",
    status: "Scheduled",
  },
  sync: {
    title: "Weekly sync",
    body: "Align App Port with SurfaceManager form factors so generated apps can reuse the same adaptive layout primitives in desktop windows and device previews.",
    status: "Friday 10:00",
  },
  standup: {
    title: "Morning standup",
    body: "Review watch list scrolling with ten inbox items. Confirm ScrollArea keeps momentum on the 242px-tall watch frame.",
    status: "9:00",
  },
  "qa-pass": {
    title: "QA pass",
    body: "Scroll through the full inbox on watch, open a middle item, and verify the detail pane keeps the back button in the header.",
    status: "Open",
  },
  "assets-export": {
    title: "Export assets",
    body: "Ship launcher icons for every viewport preset in App Port, including the watch complication size.",
    status: "Due",
  },
  "stakeholder-note": {
    title: "Stakeholder note",
    body: "Walk through how list density changes from desktop three-pane layout down to watch stack navigation.",
    status: "New",
  },
  "release-checklist": {
    title: "Release checklist",
    body: "Validate phone bottom-nav overflow, modal resize, and watch scroll lists before merging the App Port workspace.",
    status: "Friday",
  },
  "metrics-review": {
    title: "Metrics review",
    body: "Track which App Port viewports users open most often during design reviews and QA sessions.",
    status: "Monday",
  },
  "onboarding-copy": {
    title: "Onboarding copy",
    body: "Explain that watch lists scroll vertically while sections stay reachable through the hub and footer controls.",
    status: "Draft",
  },
  port: {
    title: "App Port workspace",
    body: "Preview one app at a time inside desktop, modal, phone, and watch frames without launching the full simulated OS.",
    status: "Building",
  },
  layout: {
    title: "Adaptive layout primitives",
    body: "AdaptiveAppLayout composes NavSidebar, ListPane, ResizablePane, Tabs, and bottom navigation depending on the active viewport.",
    status: "Building",
  },
  "watch-scroll": {
    title: "Watch scroll lists",
    body: "Inbox now ships ten items so the watch list pane demonstrates vertical scrolling on a compact screen.",
    status: "Building",
  },
  "bottom-nav": {
    title: "Bottom nav overflow",
    body: "Phone tabs scroll horizontally and collapse extra destinations into the More menu when they do not fit.",
    status: "Building",
  },
  "theme-picker": {
    title: "Theme switcher",
    body: "Light and dark modes propagate through desktop, modal, phone, and watch previews from a single control.",
    status: "Building",
  },
  "modal-resize": {
    title: "Modal resize",
    body: "Drag the modal window edges to see sidebar, list, and detail panes reflow at different widths.",
    status: "Review",
  },
  "tablet-split": {
    title: "Tablet split view",
    body: "Tablet uses a compact icon rail with list and detail columns visible at the same time.",
    status: "Review",
  },
  "mobile-back": {
    title: "Mobile top bar",
    body: "Stacked phone navigation places the back affordance in the top bar when viewing item detail.",
    status: "Done",
  },
  desktop: {
    title: "Desktop shell polish",
    body: "Tray scaling, wallpaper presets, and widget tiles shipped for the desktop workspace preview.",
    status: "Complete",
  },
  bento: {
    title: "Bento board",
    body: "Interactive widget grid with drag, resize, and catalog-driven add/remove flows.",
    status: "Complete",
  },
  "chat-refactor": {
    title: "Chat refactor",
    body: "Conversation tabs, thinking blocks, and composer chips shipped for the chat workspace.",
    status: "Complete",
  },
  "email-compose": {
    title: "Email compose",
    body: "Reply modal with threaded messages and folder sidebar integration.",
    status: "Complete",
  },
  "tasks-board": {
    title: "Tasks board",
    body: "Calendar column and task rows with drag-friendly list density.",
    status: "Complete",
  },
  "calendar-week": {
    title: "Calendar week view",
    body: "Week grid with event chips and day headers tuned for narrow widths.",
    status: "Complete",
  },
  "maps-prototype": {
    title: "Maps prototype",
    body: "Map canvas with floating search and pin detail sheets.",
    status: "Complete",
  },
  "wallet-v2": {
    title: "Wallet v2",
    body: "Card carousel, send flow, and activity list with responsive reflow.",
    status: "Complete",
  },
  "draft-copy": {
    title: "Hero copy draft",
    body: "Overflow tabs stay reachable via horizontal scroll, edge fades, and scroll buttons in modal.",
    status: "Draft",
  },
  "star-port": {
    title: "App Port workspace",
    body: "Pinned section for quick checks while resizing the modal window.",
    status: "Starred",
  },
  "report-q2": {
    title: "Q2 rollout report",
    body: "Track how navigation density behaves as the modal shrinks below the sidebar breakpoint.",
    status: "Weekly",
  },
  "team-design": {
    title: "Design systems",
    body: "Bottom navigation keeps every destination one tap away even when labels overflow.",
    status: "3 members",
  },
  "timeline-launch": {
    title: "Launch milestone",
    body: "Resize the modal narrower to see tabs compress, scroll, and reveal the More hint.",
    status: "Next week",
  },
  "settings-nav": {
    title: "Navigation density",
    body: "Modal switches from sidebar navigation to bottom tabs once the window gets too narrow.",
    status: "Pref",
  },
  "alert-nav": {
    title: "Navigation overflow",
    body: "Swipe or use the scroll arrows to reach tabs that do not fit in the phone bottom bar.",
    status: "New",
  },
  "files-spec": {
    title: "Layout spec",
    body: "Bottom navigation keeps a fixed tab width and scrolls horizontally when destinations overflow.",
    status: "PDF",
  },
  "search-recent": {
    title: "Recent searches",
    body: "Hidden destinations stay reachable via horizontal scroll, edge fades, and the More hint.",
    status: "Saved",
  },
};
