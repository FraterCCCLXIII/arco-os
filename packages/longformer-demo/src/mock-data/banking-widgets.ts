import type { WidgetTile } from "longformer-ui";

/** Banking dashboard cards — Space Grotesk, purple/lime/black surfaces. */
export const bankingWidgetTiles: WidgetTile[] = [
  {
    id: "banking-monthly-revenue",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "bankingWidget",
      props: {
        variant: "monthlyRevenue",
        title: "Monthly Revenue",
        amount: "$12,890.67",
        period: "14 Jan - 13 Feb, 2025",
        thisMonth: [42, 55, 48, 68],
        previousMonth: [38, 44, 52, 58],
        weekLabels: ["W1", "W2", "W3", "W4"],
      },
    },
  },
  {
    id: "banking-transactions",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "bankingWidget",
      props: {
        variant: "transactions",
        title: "Latest Transactions",
        groups: [
          {
            label: "TODAY",
            items: [
              { id: "t1", title: "Movie Tickets", date: "24 Apr", amount: "$12.5", icon: "🎬" },
              { id: "t2", title: "Grocery Store", date: "24 Apr", amount: "$84.20", icon: "🛒" },
            ],
          },
          {
            label: "YESTERDAY",
            items: [
              { id: "t3", title: "Coffee Shop", date: "23 Apr", amount: "$6.40", icon: "☕" },
              { id: "t4", title: "Gym Membership", date: "23 Apr", amount: "$29.00", icon: "🏋️" },
            ],
          },
        ],
      },
    },
  },
  {
    id: "banking-exchange",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "bankingWidget",
      props: {
        variant: "exchange",
        title: "Exchange",
        pair: "USD → EUR",
        amount: "$285.72",
        available: "$18,375.94",
        rate: "1 USD = 0.88 EUR",
        tax: "$5.71",
        fee: "$2.86",
        total: "$294.29",
        actionLabel: "Exchange Now",
        disclaimer: "Transactions may take up to 24 hours to process.",
      },
    },
  },
  {
    id: "banking-crypto",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "bankingWidget",
      props: {
        variant: "cryptoList",
        assets: [
          {
            id: "btc",
            name: "Bitcoin",
            symbol: "BTC",
            price: "$110,771.30",
            change: "+1,164.80 (1.06%)",
            about: "Bitcoin is a decentralized digital currency that enables peer-to-peer transactions without intermediaries.",
            expanded: true,
          },
          { id: "bnb", name: "Binance", symbol: "BNB", expanded: false },
          { id: "usdt", name: "Tether", symbol: "USDT", expanded: false },
        ],
      },
    },
  },
  {
    id: "banking-pricing",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "bankingWidget",
      props: {
        variant: "pricingPlans",
        title: "Pick Your Plan",
        period: "monthly",
        plans: [
          {
            id: "free",
            name: "Free",
            price: "$0",
            description: "Basic features for personal use and getting started.",
            highlighted: true,
            actionLabel: "Continue",
          },
          {
            id: "pro",
            name: "Pro",
            price: "$17.50",
            period: "/month",
            description: "Advanced tools for power users and small teams.",
          },
        ],
      },
    },
  },
  {
    id: "banking-credit-card",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "bankingWidget",
      props: {
        variant: "creditCard",
        title: "Credit Card Information",
        number: "4567 - 1234 - 5678 - 9012",
        brand: "VISA",
        name: "Samantha William",
        expiry: "May 2028",
        transactionLimit: "$500",
        dailyLimit: "$1,000",
      },
    },
  },
  {
    id: "banking-family-saving",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "bankingWidget",
      props: {
        variant: "familySaving",
        title: "Family Saving",
        amount: "$64,705.882",
        subtitle: "You're halfway to your target",
        values: [4, 6, 5, 8, 7, 9, 6, 8, 7, 5, 6, 9],
        highlightIndex: 6,
        tooltip: { label: "Highest", value: "$1,258.73" },
      },
    },
  },
];
