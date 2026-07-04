import type { GeneratedSurfaceSchema } from "longformer-ui-tailwind";

export const projectRiskPreviewSchema: GeneratedSurfaceSchema = {
  id: "chat-project-risks-preview",
  blocks: [
    {
      id: "prp1",
      type: "cardGrid",
      title: "Top risks flagged",
      cards: [
        {
          id: "r1",
          title: "Rain backup plan",
          description: "No indoor fallback location if weather turns.",
          icon: "terminal",
          badge: "High",
        },
        {
          id: "r2",
          title: "Permit deadline",
          description: "Park permit paperwork is still pending approval.",
          icon: "code",
          badge: "Medium",
        },
        {
          id: "r3",
          title: "Volunteer gap",
          description: "Cleanup shift still needs two volunteers.",
          icon: "check",
          badge: "Quick win",
        },
      ],
    },
  ],
};

export const projectRiskCardsSchema: GeneratedSurfaceSchema = {
  id: "chat-project-risks",
  blocks: [
    {
      id: "pr1",
      type: "text",
      tone: "muted",
      text: "Three items flagged before the picnic — tap a card to open the relevant note or create a follow-up.",
    },
    {
      id: "pr2",
      type: "cardGrid",
      title: "Risk register",
      cards: [
        {
          id: "r1",
          title: "Rain backup plan",
          description: "No indoor fallback location if weather turns.",
          icon: "terminal",
          badge: "High",
        },
        {
          id: "r2",
          title: "Permit deadline",
          description: "Park permit paperwork is still pending approval.",
          icon: "code",
          badge: "Medium",
        },
        {
          id: "r3",
          title: "Volunteer gap",
          description: "Cleanup shift still needs two volunteers.",
          icon: "check",
          badge: "Quick win",
        },
      ],
    },
    {
      id: "pr3",
      type: "taskChecklistCards",
      title: "Pre-event checklist",
      cards: [
        {
          id: "tc1",
          title: "Ready to open gates",
          progress: 67,
          progressLabel: "4 of 6 complete",
          memberNames: ["Alex", "Sam"],
          actionLabel: "Mark done",
          items: [
            { label: "Pavilion rental confirmed", completed: true },
            { label: "Catering headcount finalized", completed: true },
            { label: "Permit submitted to parks dept", completed: true },
            { label: "Welcome table supplies packed", completed: true },
            { label: "Rain backup location booked", completed: false },
            { label: "Volunteer reminder sent", completed: false },
          ],
        },
      ],
    },
    {
      id: "pr4",
      type: "code",
      language: "notes.txt",
      code: `- Backup location: Redwood Hall B\n+ Backup location: Community Center Room 3 (confirmed hold)`,
    },
  ],
};

export const officeSuiteCompareSchema: GeneratedSurfaceSchema = {
  id: "chat-office-compare",
  blocks: [
    {
      id: "oc1",
      type: "text",
      tone: "muted",
      text: "Side-by-side on the dimensions you asked for — docs, sheets, calendar, and real-time collab.",
    },
    {
      id: "oc2",
      type: "statCards",
      title: "Feature fit",
      cards: [
        {
          id: "s1",
          icon: "notebook",
          label: "Lark Suite",
          value: "9.2",
          caption: "Best for docs + wikis",
          tone: "accent",
          visualization: { type: "ring", percent: 92 },
        },
        {
          id: "s2",
          icon: "grid",
          label: "Harbor Office",
          value: "8.8",
          caption: "Strong sheets + calendar",
          tone: "success",
          visualization: { type: "ring", percent: 88 },
        },
        {
          id: "s3",
          icon: "layers",
          label: "Summit 365",
          value: "8.5",
          caption: "Enterprise calendar",
          tone: "warning",
          visualization: { type: "ring", percent: 85 },
        },
      ],
    },
    {
      id: "oc3",
      type: "selectionTiles",
      title: "Pick a primary suite",
      tiles: [
        { id: "t1", label: "Lark Suite", selected: true, size: "tall" },
        { id: "t2", label: "Harbor", size: "sm" },
        { id: "t3", label: "Summit", size: "sm" },
        { id: "t4", label: "Cedar Docs", size: "sm" },
        { id: "t5", label: "Pineboard", size: "wide" },
        { id: "t6", label: "Northstar", size: "sm" },
      ],
    },
    {
      id: "oc4",
      type: "timelineSteps",
      title: "Suggested rollout",
      steps: [
        { id: "st1", label: "Pilot with docs team", completed: true },
        { id: "st2", label: "Migrate shared calendar", completed: true },
        { id: "st3", label: "Import spreadsheet templates" },
        { id: "st4", label: "Train on collab workflows", showConnector: false },
      ],
    },
  ],
};

export const officeSuiteListSchema: GeneratedSurfaceSchema = {
  id: "chat-office-list",
  blocks: [
    {
      id: "ol1",
      type: "text",
      tone: "muted",
      text: "Shortlist based on docs, sheets, calendar, and team size — pulled from recent reviews and your stack.",
    },
    {
      id: "ol2",
      type: "listingCards",
      title: "Top matches",
      cards: [
        {
          id: "l1",
          avatarName: "Lark",
          title: "Lark Suite Workspace",
          subtitle: "Docs · Sheets · Calendar views",
          tags: ["Best docs", "Flexible"],
          price: "$12",
          priceMeta: "/user · 10+ seats",
          actionLabel: "View details",
          saved: true,
        },
        {
          id: "l2",
          avatarName: "Harbor",
          title: "Harbor Office",
          subtitle: "Sheets · Calendar · File storage",
          tags: ["Best sheets", "Real-time"],
          price: "$14",
          priceMeta: "/user · Business",
          actionLabel: "View details",
        },
        {
          id: "l3",
          avatarName: "Summit",
          title: "Summit 365",
          subtitle: "Spreadsheets · Mail · Team chat",
          tags: ["Enterprise", "Calendar"],
          price: "$22",
          priceMeta: "/user · Business",
          actionLabel: "View details",
        },
      ],
    },
  ],
};

export const pizzaOptionsSchema: GeneratedSurfaceSchema = {
  id: "chat-pizza-options",
  blocks: [
    {
      id: "pz1",
      type: "text",
      tone: "muted",
      text: "Three spots within 2 miles with 4.5+ ratings and delivery under 35 minutes tonight.",
    },
    {
      id: "pz2",
      type: "mediaCards",
      title: "Nearby picks",
      cards: [
        {
          id: "m1",
          tone: "accent",
          title: "Tony's Brick Oven",
          description: "Margherita · Pepperoni · White pie — 28 min delivery",
          badges: [
            { icon: "star", label: "4.8" },
            { label: "$$" },
          ],
          actionLabel: "Select",
        },
        {
          id: "m2",
          tone: "success",
          title: "Slice House",
          description: "Detroit-style squares · 22 min delivery",
          badges: [
            { icon: "star", label: "4.6" },
            { label: "Fastest" },
          ],
          actionLabel: "Select",
        },
        {
          id: "m3",
          tone: "warning",
          title: "North End Pizzeria",
          description: "Neapolitan · Gluten-free crust available",
          badges: [
            { icon: "star", label: "4.7" },
            { label: "GF option" },
          ],
          actionLabel: "Select",
        },
      ],
    },
  ],
};

export const pizzaOrderFormSchema: GeneratedSurfaceSchema = {
  id: "chat-pizza-order",
  blocks: [
    {
      id: "po1",
      type: "text",
      tone: "muted",
      text: "Delivery ETAs and a quick customization form for Tony's — your usual address is pre-filled.",
    },
    {
      id: "po2",
      type: "eventCards",
      title: "Delivery windows",
      cards: [
        {
          id: "e1",
          label: "Fastest",
          title: "Tony's Brick Oven",
          startTime: "7:15 PM",
          endTime: "7:43 PM",
          timeLeft: { icon: "clock", label: "28 min" },
        },
        {
          id: "e2",
          label: "Alternative",
          title: "Slice House",
          startTime: "7:10 PM",
          endTime: "7:32 PM",
          timeLeft: { icon: "clock", label: "22 min" },
        },
      ],
    },
    {
      id: "po3",
      type: "routeCards",
      title: "Delivery route",
      cards: [
        {
          id: "r1",
          pickup: { label: "Pickup", address: "Tony's Brick Oven, 412 Main St" },
          dropoff: { label: "Deliver to", address: "Home · 88 Oak Lane, Apt 4B" },
        },
      ],
    },
    {
      id: "po4",
      type: "form",
      title: "Customize order",
      fields: [
        { id: "f1", label: "Pizza", value: "Large pepperoni + mushrooms" },
        { id: "f2", label: "Crust", value: "Thin crust" },
        { id: "f3", label: "Delivery", value: "ASAP · Leave at door" },
        { id: "f4", label: "Tip", value: "20% ($6.40)" },
      ],
    },
  ],
};
