import type { WidgetTile } from "longformer-ui-tailwind";

/** Finance-style widget board — one UI component per tile, no group titles. */
export const widgetDashboardTiles: WidgetTile[] = [
  {
    id: "allocation",
    colSpan: 3,
    content: {
      type: "stat",
      props: {
        label: "Joint allocation",
        value: "$31,234",
        tone: "accent",
        visualization: { type: "ring", percent: 68 },
        caption: "Retirement 42%",
      },
    },
  },
  {
    id: "credit-history",
    colSpan: 3,
    content: {
      type: "stat",
      props: {
        icon: "calendar",
        label: "Credit history",
        value: "742",
        caption: "Very good",
        tone: "neutral",
        visualization: { type: "bars", values: [4, 6, 5, 7, 8, 6, 9, 7, 8, 9, 8, 10] },
      },
    },
  },
  {
    id: "debt-payoff",
    colSpan: 6,
    rowSpan: 2,
    content: {
      type: "metricChart",
      props: {
        label: "Debt payoff",
        value: "$18,420",
        change: { amount: "-$2,140", percent: "-10.4%", caption: "This year", direction: "down" },
        chartValues: [92, 88, 84, 80, 76, 72, 68, 64, 58, 52, 46, 40],
      },
    },
  },
  {
    id: "score",
    colSpan: 3,
    content: {
      type: "stat",
      props: {
        label: "Score",
        value: "420",
        tone: "warning",
        visualization: { type: "ring", percent: 42 },
        caption: "Fair",
      },
    },
  },
  {
    id: "cash-flow",
    colSpan: 3,
    content: {
      type: "kpi",
      icon: "folder",
      label: "Cash flow",
      value: "$1,234,567",
      meta: "Available balance",
    },
  },
  {
    id: "investment",
    colSpan: 3,
    content: {
      type: "kpi",
      icon: "arrow-up-right",
      label: "Investment",
      value: "$842,190",
      meta: "+4.2% this quarter",
    },
  },
  {
    id: "tax-return",
    colSpan: 3,
    content: {
      type: "stat",
      props: {
        label: "Tax return",
        value: "$4,820",
        tone: "success",
        visualization: { type: "ring", percent: 92 },
        caption: "Excellent",
      },
    },
  },
  {
    id: "stocks",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "stockList",
      items: [
        { name: "Apple Inc.", avatarName: "Apple", value: "$12,840", change: "+2.4%", direction: "up" },
        { name: "Microsoft", avatarName: "Microsoft", value: "$9,210", change: "+1.1%", direction: "up" },
        { name: "Tesla", avatarName: "Tesla", value: "$4,680", change: "-0.8%", direction: "down" },
        { name: "NVIDIA", avatarName: "NVIDIA", value: "$7,320", change: "+3.6%", direction: "up" },
      ],
    },
  },
  {
    id: "transactions",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "activityFeed",
      items: [
        {
          avatarName: "Apple",
          title: "Buy AAPL",
          status: { label: "Completed", tone: "success" },
          category: "Buy",
          amount: "$1,400",
          time: "3:15 PM",
        },
        {
          avatarName: "Microsoft",
          title: "Sell MSFT",
          status: { label: "Failed", tone: "danger" },
          category: "Sell",
          amount: "$820",
          time: "11:02 AM",
        },
      ],
    },
  },
  {
    id: "planning-menu",
    colSpan: 4,
    content: {
      type: "menuList",
      items: [
        { icon: "check", label: "Debt payoff" },
        { icon: "calendar", label: "Retirement" },
        { icon: "home", label: "Mortgage" },
        { icon: "lock", label: "Insurance" },
      ],
    },
  },
  {
    id: "link-bank",
    colSpan: 4,
    content: {
      type: "cta",
      icon: "external-link",
      title: "Link your bank",
      description: "Connect accounts to track cash flow automatically.",
      buttonLabel: "Connect your bank",
    },
  },
  {
    id: "garage-station",
    colSpan: 3,
    content: {
      type: "device",
      props: {
        title: "Front station",
        subtitle: "Garage",
        status: "70%",
        statusTone: "success",
        icon: "battery",
        iconTone: "success",
        progress: 70,
      },
    },
  },
  {
    id: "living-light",
    colSpan: 3,
    content: {
      type: "device",
      props: {
        title: "Light",
        subtitle: "Living room",
        icon: "sun",
        iconTone: "warning",
        progress: 70,
      },
    },
  },
  {
    id: "recent-expense",
    colSpan: 3,
    content: {
      type: "expense",
      props: {
        tone: "success",
        category: "Taxi",
        merchant: "Uber Inc.",
        amount: "-$35",
        avatarName: "Uber",
      },
    },
  },
  {
    id: "insight",
    colSpan: 3,
    content: {
      type: "insight",
      props: {
        title: "Revise meeting order",
        description: "Start later, rest longer, finish earlier.",
      },
    },
  },
  {
    id: "portfolio-spark",
    colSpan: 6,
    content: {
      type: "metricChart",
      props: {
        value: "$10,182.01",
        change: { amount: "+$1,234", percent: "+1.01%", caption: "All time", direction: "up" },
        chartValues: [42, 48, 44, 52, 50, 58, 55, 62, 60, 68, 64, 72],
      },
    },
  },
  {
    id: "next-class",
    colSpan: 3,
    content: {
      type: "event",
      props: {
        title: "Grid Systems",
        startTime: "02:00",
        endTime: "03:30",
        timeLeft: { icon: "sparkles", label: "5h 39m left" },
      },
    },
  },
  {
    id: "standup",
    colSpan: 3,
    content: {
      type: "meetingCountdown",
      props: {
        memberNames: ["Alex", "Jordan", "Sam"],
        memberCount: "13 members",
        countdown: "00:19",
        actionLabel: "Join",
      },
    },
  },
  {
    id: "stay-card",
    colSpan: 4,
    content: {
      type: "media",
      props: {
        tone: "accent",
        title: "Santorini Villa",
        description: "Infinity pool, sunset view.",
        badges: [{ icon: "star", label: "4.8" }],
        actionLabel: "Reserve",
      },
    },
  },
  {
    id: "trip-route",
    colSpan: 4,
    content: {
      type: "route",
      props: {
        pickup: { label: "Pickup", address: "Living World Mall" },
        dropoff: { label: "Drop off", address: "Pasar Buah" },
      },
    },
  },
  {
    id: "open-role",
    colSpan: 4,
    content: {
      type: "listing",
      props: {
        avatarName: "Amazon",
        title: "Senior UI/UX Designer",
        subtitle: "Amazon · 5 days ago",
        tags: ["Part-time"],
        price: "$120",
        priceMeta: "/hr",
        actionLabel: "Apply",
      },
    },
  },
  {
    id: "wallpaper-asset",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "assetShowcase",
      props: {
        title: "Elegant Pink Floral Wallpaper",
        description: "Soft abstract waves for desktop and mobile.",
        imageTone: "accent",
        stats: [
          { icon: "thumbs-up", label: "2.4k" },
          { icon: "message-square", label: "128" },
          { icon: "download", label: "890" },
        ],
        creatorName: "Miriam Martinez",
        creatorMeta: "12.4k followers",
        actionLabel: "Download",
      },
    },
  },
  {
    id: "crypto-market",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "cryptoMarket",
      props: {
        rows: [
          {
            symbol: "BTC",
            name: "Bitcoin",
            price: "$67,420",
            changePercent: "+2.4%",
            direction: "up",
            tone: "warning",
            chartValues: [40, 42, 38, 44, 48, 46, 52, 50],
          },
          {
            symbol: "AKT",
            name: "Akash",
            price: "$4.82",
            changePercent: "+5.1%",
            direction: "up",
            tone: "accent",
            chartValues: [20, 24, 22, 28, 30, 34, 32, 38],
          },
          {
            symbol: "ETH",
            name: "Ethereum",
            price: "$3,412",
            changePercent: "-0.8%",
            direction: "down",
            tone: "neutral",
            chartValues: [50, 48, 46, 44, 42, 40, 38, 36],
          },
        ],
      },
    },
  },
  {
    id: "vpn",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "vpnConnection",
      props: {
        active: true,
        statusLabel: "On",
        location: "France",
        ipAddress: "192.168.1.42",
        timeConnected: "2h 14m",
        download: { label: "Download", value: "842 Mbps", chartValues: [20, 28, 24, 32, 36, 30, 38, 42] },
        upload: { label: "Upload", value: "128 Mbps", chartValues: [12, 16, 14, 18, 20, 16, 22, 24] },
      },
    },
  },
  {
    id: "calendar",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "calendarSchedule",
      props: {
        monthLabel: "April 2023",
        days: [
          { value: "", muted: true },
          { value: "", muted: true },
          { value: "", muted: true },
          { value: "", muted: true },
          { value: "", muted: true },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
          { value: 7 },
          { value: 8 },
          { value: 9 },
          { value: 10 },
          { value: 11 },
          { value: 12 },
          { value: 13 },
          { value: 14 },
          { value: 15 },
          { value: 16 },
          { value: 17 },
          { value: 18 },
          { value: 19, selected: true },
          { value: 20 },
          { value: 21 },
          { value: 22 },
          { value: 23 },
          { value: 24 },
          { value: 25 },
          { value: 26 },
          { value: 27 },
          { value: 28 },
          { value: 29 },
          { value: 30 },
        ],
        events: [
          { title: "Yoga Class", timeRange: "8:00–9:00 AM", tone: "accent" },
          { title: "Gym", timeRange: "6:00–7:00 PM", tone: "success" },
        ],
      },
    },
  },
  {
    id: "battery",
    colSpan: 3,
    content: {
      type: "batteryStatus",
      props: {
        percent: "63%",
        powerMode: "Balanced",
        timeRemaining: "7h 36m",
        tone: "success",
      },
    },
  },
  {
    id: "music",
    colSpan: 5,
    content: {
      type: "musicPlayer",
      props: {
        title: "Les Muses: Taylor",
        artist: "Taylor Swift",
        sourceLabel: "Spotify",
        imageTone: "neutral",
        progress: 42,
        elapsed: "1:24",
        duration: "3:18",
        playing: true,
      },
    },
  },
  {
    id: "news",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "newsFeed",
      props: {
        source: "CNN News",
        headline: "Biden says banking system is safe after SVB collapse",
        excerpt: "President Biden sought to reassure Americans that the banking system remains secure.",
        imageTone: "accent",
        stats: [
          { icon: "thumbs-up", label: "1.2k" },
          { icon: "message-square", label: "342" },
        ],
      },
    },
  },
  {
    id: "tasks",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "taskChecklist",
      props: {
        tabs: [
          { id: "design", label: "Design" },
          { id: "uiux", label: "UI/UX" },
          { id: "website", label: "Website" },
        ],
        activeTab: "design",
        title: "Design Website",
        items: [
          { label: "Create wireframes", completed: true },
          { label: "Build component library", completed: true },
          { label: "Implement responsive layout", completed: false },
          { label: "QA and accessibility pass", completed: false },
        ],
        progress: 70,
        memberNames: ["Alex", "Jordan", "Sam", "Riley"],
        actionLabel: "Add Task",
      },
    },
  },
  {
    id: "translation",
    colSpan: 8,
    content: {
      type: "translation",
      props: {
        panels: [
          {
            language: "English",
            flag: "🇺🇸",
            text: "The quick brown fox jumps over the lazy dog near the riverbank at dawn.",
          },
          {
            language: "French",
            flag: "🇫🇷",
            text: "Le rapide renard brun saute par-dessus le chien paresseux près de la rive à l'aube.",
          },
        ],
      },
    },
  },
  {
    id: "palette",
    colSpan: 4,
    content: {
      type: "colorPalette",
      props: {
        swatches: [
          { color: "#111827", label: "Black" },
          { color: "#1e3a8a", label: "Blue" },
          { color: "#14b8a6", label: "Teal" },
          { color: "#ec4899", label: "Pink" },
          { color: "#f97316", label: "Orange" },
        ],
      },
    },
  },
  {
    id: "design-flight",
    colSpan: 5,
    content: {
      type: "designCard",
      props: {
        variant: "flight",
        origin: "SFO",
        destination: "YEG",
        departureTime: "2:10 PM",
        arrivalTime: "6:42 PM",
        status: "Arrives in 47m",
        progress: 62,
      },
    },
  },
  {
    id: "design-order",
    colSpan: 5,
    content: {
      type: "designCard",
      props: {
        variant: "order",
        status: "Picking up order",
        eta: "5:50",
        progress: 45,
        driverName: "Dave",
      },
    },
  },
  {
    id: "design-glucose",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "glucose",
        value: "7.2",
        unit: "mmol/L",
        trend: "down",
        chartValues: [42, 58, 72, 64, 80, 68, 92],
        labels: ["1PM", "2PM", "NOW"],
      },
    },
  },
  {
    id: "design-delivery",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "delivery",
        statusLabel: "Status",
        status: "Out for delivery",
        eta: "15–30 min",
      },
    },
  },
  {
    id: "design-espresso",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "espresso",
        timer: "16s",
        chartValues: [24, 48, 72, 56, 88, 64, 40, 72, 52],
      },
    },
  },
  {
    id: "design-iss",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "iss",
        countdown: "in 15 min",
      },
    },
  },
  {
    id: "design-workout",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "workout",
        elapsed: "24:15",
        distance: "1.8 MI",
        chartValues: [32, 48, 72, 56, 88, 64, 80, 52, 68],
      },
    },
  },
  {
    id: "design-race",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "race",
        sector: "Sector 2",
        progress: 38,
      },
    },
  },
  {
    id: "design-transit",
    colSpan: 5,
    content: {
      type: "designCard",
      props: {
        variant: "transit",
        stops: [
          { label: "Harajuku" },
          { label: "Shibuya", active: true },
          { label: "Ebisu" },
        ],
      },
    },
  },
  {
    id: "design-heart",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "heartRate",
        value: "82",
        unit: "bpm",
        chartValues: [28, 52, 88, 44, 72, 36, 64, 48, 80],
      },
    },
  },
  {
    id: "design-sleep",
    colSpan: 4,
    content: {
      type: "designCard",
      props: { variant: "sleep", duration: "9h 40m", delta: "+219m", goalAt: 72 },
    },
  },
  {
    id: "design-subway",
    colSpan: 5,
    content: {
      type: "designCard",
      props: {
        variant: "subwayNav",
        headline: "2 Min EXIT → Marcy Avenue",
        stationCount: "3 Stations",
        stopCount: 5,
        activeStop: 2,
      },
    },
  },
  {
    id: "design-wishlist",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "wishlist",
        kicker: "Wish List",
        title: "Death Stranding",
        price: "$13.29",
        discount: "-67%",
        progress: 34,
      },
    },
  },
  {
    id: "design-weekly-rings",
    colSpan: 6,
    content: {
      type: "designCard",
      props: {
        variant: "weeklyRings",
        tags: [{ label: "Workout" }, { label: "Health", tone: "success" }],
        rings: [
          { label: "M", progress: 80 },
          { label: "T", progress: 65 },
          { label: "W", progress: 90 },
          { label: "T", progress: 55 },
          { label: "F", progress: 72, active: true },
          { label: "S", progress: 40 },
          { label: "S", progress: 30 },
        ],
      },
    },
  },
  {
    id: "design-podcast",
    colSpan: 5,
    content: {
      type: "designCard",
      props: {
        variant: "podcast",
        date: "Jun 2, 2023",
        title: "The Seagulls",
        show: "Radiolab",
        progress: 35,
        speed: "1x",
        duration: "1h 03m",
      },
    },
  },
  {
    id: "design-weather",
    colSpan: 5,
    content: {
      type: "designCard",
      props: {
        variant: "weather",
        city: "New York",
        temperature: "66°",
        aqi: "38 AQI",
        wind: "7 Mph",
      },
    },
  },
  {
    id: "design-network",
    colSpan: 5,
    content: {
      type: "designCard",
      props: {
        variant: "network",
        stats: [
          { value: "161.35", direction: "up" },
          { value: "24 ms", direction: "down" },
          { value: "96.24", direction: "up" },
        ],
        downloadProgress: 62,
        uploadProgress: 38,
      },
    },
  },
  {
    id: "design-sports",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "sportsScore",
        homeTeam: "Knicks",
        awayTeam: "Wizards",
        homeScore: "86",
        awayScore: "91",
        league: "NBA",
      },
    },
  },
  {
    id: "design-billing",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "billing",
        kicker: "Due Payment",
        countdown: "5 Days Left",
        amount: "$109.43",
      },
    },
  },
  {
    id: "design-goals",
    colSpan: 5,
    content: {
      type: "designCard",
      props: {
        variant: "activityGoals",
        goals: [
          { label: "0.60", progress: 60 },
          { label: "1.25", progress: 85 },
          { completed: true, progress: 100 },
          { label: "SAT", progress: 45 },
          { progress: 30 },
          { progress: 70 },
        ],
      },
    },
  },
  {
    id: "design-airpods",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "airpods",
        featureValue: "13%",
        feature: "Noise Cancellation",
        leftBattery: 7,
        rightBattery: 19,
      },
    },
  },
  {
    id: "design-laundry",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "laundry",
        program: "Intensive Wash",
        timer: "29m 13s",
        phase: "Rinse",
        phaseProgress: 55,
        phaseTimer: "4:13",
        temp: "45",
        spin: "1000",
      },
    },
  },
  {
    id: "analytics-flow",
    colSpan: 6,
    rowSpan: 2,
    content: {
      type: "flowReport",
      props: {
        title: "Flow report",
        icon: "folder",
        sources: [
          { label: "Licenses", value: "$5,000", tone: "purple" },
          { label: "Hardware", value: "$5,000", tone: "cyan" },
          { label: "Subscriptions", value: "$5,000", tone: "blue" },
        ],
        targets: [
          { label: "Adobe", value: "$5,000", tone: "purple" },
          { label: "Avast", value: "$5,000", tone: "cyan" },
        ],
        links: [
          { from: 0, to: 0, tone: "purple" },
          { from: 1, to: 0, tone: "cyan" },
          { from: 2, to: 1, tone: "purple" },
        ],
      },
    },
  },
  {
    id: "analytics-saved",
    colSpan: 6,
    rowSpan: 2,
    content: {
      type: "savedMoney",
      props: {
        chartValues: [180, 210, 195, 90, 170, 220, 240],
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        timeframes: ["Week", "Month", "Year"],
        activeTimeframe: "Week",
        yMax: 300,
      },
    },
  },
  {
    id: "analytics-fear-greed",
    colSpan: 6,
    rowSpan: 2,
    content: {
      type: "fearGreed",
      props: {
        score: 68,
        label: "Greed",
        leftPercent: 46,
        rightPercent: 54,
      },
    },
  },
  {
    id: "analytics-target",
    colSpan: 6,
    rowSpan: 2,
    content: {
      type: "targetChart",
      props: {
        actualValues: [82, 82, 82, 82, 82, 82],
        targetEnd: 18,
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        yLabels: ["5:00", "10:00", "15:00", "/km"],
      },
    },
  },
  {
    id: "lms-quiz",
    colSpan: 3,
    content: {
      type: "quizScore",
      props: {
        value: "82%",
        change: "-10%",
        changeDirection: "down",
        highestValue: "92.50%",
        lowestValue: "64.25%",
        highestProgress: 92,
        lowestProgress: 64,
      },
    },
  },
  {
    id: "lms-time",
    colSpan: 3,
    content: {
      type: "timeSpent",
      props: {
        value: "12 Hours",
        change: "-12.00%",
        changeDirection: "down",
        subValue: "9.5H",
        chartValues: [40, 55, 48, 62, 70, 58, 45],
        activeIndex: 4,
      },
    },
  },
  {
    id: "lms-streak",
    colSpan: 3,
    content: {
      type: "weeklyStreak",
      props: {
        value: "5 Days",
        longestValue: "15 days",
        days: [
          { label: "01", completed: true },
          { label: "02", completed: true },
          { label: "03", completed: true },
          { label: "04", completed: true },
          { label: "05", completed: true },
          { label: "06" },
          { label: "07" },
          { label: "08" },
          { label: "09" },
          { label: "10" },
        ],
      },
    },
  },
  {
    id: "lms-ranking",
    colSpan: 3,
    content: {
      type: "globalRanking",
      props: {
        value: "#15 of 23K learners",
        entries: [
          { name: "Brooklyn Simmons" },
          { name: "Annette Black" },
          { name: "Guy Hawkins" },
        ],
      },
    },
  },
  {
    id: "lms-enrollment",
    colSpan: 12,
    rowSpan: 2,
    content: {
      type: "enrollmentChart",
      props: {
        avgValue: "1,250,00",
        change: "+13.4%",
        changeDirection: "up",
        activeMonth: 6,
        tooltip: {
          title: "July 2024",
          enrollments: "Enrollments: 350",
          completion: "Completion: 85.20%",
        },
      },
    },
  },
  {
    id: "vuexy-projects",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "activeProjects",
      props: {
        items: [
          { name: "Laravel", category: "Ecommerce", icon: "code", progress: 85, tone: "purple" },
          { name: "Figma", category: "App UI Kit", icon: "layers", progress: 72, tone: "teal" },
          { name: "VueJS", category: "Calendar App", icon: "calendar", progress: 64, tone: "green" },
          { name: "React", category: "Dashboard", icon: "grid", progress: 58, tone: "orange" },
        ],
      },
    },
  },
  {
    id: "vuexy-order",
    colSpan: 3,
    content: {
      type: "miniStatChart",
      props: {
        title: "Order",
        subtitle: "Last week",
        value: "124k",
        change: "+12.6%",
        changeDirection: "up",
        chartType: "bar",
      },
    },
  },
  {
    id: "vuexy-sales",
    colSpan: 3,
    content: {
      type: "miniStatChart",
      props: {
        title: "Sales",
        subtitle: "Last year",
        value: "175k",
        change: "+18.2%",
        changeDirection: "up",
        chartType: "line",
      },
    },
  },
  {
    id: "vuexy-profit",
    colSpan: 3,
    content: {
      type: "miniStatChart",
      props: {
        title: "Profit",
        subtitle: "Last month",
        value: "624k",
        change: "+42.5%",
        changeDirection: "up",
        chartType: "line",
      },
    },
  },
  {
    id: "vuexy-sessions",
    colSpan: 3,
    content: {
      type: "miniStatChart",
      props: {
        title: "Sessions",
        subtitle: "Last month",
        value: "38.5k",
        change: "-16.2%",
        changeDirection: "down",
        chartType: "bar",
      },
    },
  },
  {
    id: "vuexy-statistics",
    colSpan: 4,
    content: {
      type: "statisticsProgress",
      props: {
        rows: [
          { label: "Subscribers Gained", subLabel: "Monthly Report", change: "+92k", value: "92k", progress: 78 },
          { label: "Orders Received", subLabel: "Weekly Report", change: "+38k", value: "38k", progress: 52 },
        ],
      },
    },
  },
  {
    id: "vuexy-sales-overview",
    colSpan: 4,
    content: {
      type: "salesOverview",
      props: {
        total: "$42.5k",
        change: "+18.2%",
        left: { label: "Order", value: "62.2%", count: "6,440", icon: "hash" },
        right: { label: "Visits", value: "25.5%", count: "12,749", icon: "users" },
        leftRatio: 62,
      },
    },
  },
  {
    id: "vuexy-webinar",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "webinarCta",
      props: {
        title: "Upcoming Webinar",
        description: "Join our live session on dashboard design patterns and data visualization.",
        date: "17 Nov 24",
        duration: "32 min",
      },
    },
  },
  {
    id: "vuexy-profile-grid",
    colSpan: 6,
    rowSpan: 2,
    content: {
      type: "profileGrid",
      props: {
        columns: 3,
        profiles: [
          { username: "StarrySky_07", dateLabel: "Jan 15, 2026", avatarName: "Starry Sky", avatarColor: "#f97316" },
          { username: "WaffleWarrior", dateLabel: "Jan 6, 2026", avatarName: "Waffle Warrior", avatarColor: "#ec4899" },
          { username: "CriticalHit99", dateLabel: "Dec 28, 2025", avatarName: "Critical Hit", avatarColor: "#38bdf8" },
          { username: "lunavia_27", dateLabel: "Dec 23, 2025", avatarName: "Lunavia", avatarColor: "#22c55e" },
          { username: "DataBloom_21", dateLabel: "Dec 18, 2025", avatarName: "Data Bloom", avatarColor: "#a855f7" },
          { username: "SlowComet", dateLabel: "Dec 15, 2025", avatarName: "Slow Comet", avatarColor: "#eab308" },
        ],
      },
    },
  },
  {
    id: "vuexy-spent-month",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "spentThisMonth",
      props: {
        amount: "€2,540.00",
        label: "Spent this Month",
        change: "5.8%",
        changeDirection: "up",
        bars: [
          { label: "5", value: 15 },
          { label: "10", value: 45 },
          { label: "15", value: 55 },
          { label: "20", value: 20 },
          { label: "25", value: 10 },
          { label: "31", value: 30 },
        ],
      },
    },
  },
  {
    id: "vuexy-expenses",
    colSpan: 3,
    content: {
      type: "expenseGauge",
      props: {
        value: "82.5k",
        label: "Expenses",
        percent: 78,
        caption: "78% of budget used this month",
      },
    },
  },
  {
    id: "vuexy-earnings",
    colSpan: 6,
    rowSpan: 2,
    content: {
      type: "earningReports",
      props: {
        stats: [
          { label: "Earnings", amount: "$545.69", change: "+12.5%", changeDirection: "up", icon: "dollar-sign" },
          { label: "Profit", amount: "$256.34", change: "+8.2%", changeDirection: "up", icon: "target" },
        ],
        activeIndex: 4,
      },
    },
  },
  {
    id: "vuexy-subscribers",
    colSpan: 6,
    content: {
      type: "subscribersChart",
      props: {
        value: "92.6k",
        subtitle: "Subscribers gained this month",
      },
    },
  },
  {
    id: "glass-wifi",
    colSpan: 2,
    content: { type: "glassWidget", props: { variant: "wifi", network: "guest_wifi_5g", enabled: true } },
  },
  {
    id: "glass-habits",
    colSpan: 2,
    content: { type: "glassWidget", props: { variant: "habits", label: "Daily Writing", remaining: "10m left", progress: 72 } },
  },
  {
    id: "glass-gate",
    colSpan: 2,
    content: { type: "glassWidget", props: { variant: "gateInfo", gate: "B18", status: "Gate Open", countdown: "26 min" } },
  },
  {
    id: "glass-audio",
    colSpan: 2,
    content: { type: "glassWidget", props: { variant: "audioRecording", elapsed: "01:12:25", recording: true } },
  },
  {
    id: "glass-clock",
    colSpan: 2,
    content: { type: "glassWidget", props: { variant: "analogClock", hours: 10, minutes: 25 } },
  },
  {
    id: "glass-camera",
    colSpan: 2,
    content: { type: "glassWidget", props: { variant: "cameraRecording", elapsed: "00:04:18", recording: true } },
  },
  {
    id: "glass-timezone-light",
    colSpan: 2,
    content: {
      type: "glassWidget",
      props: {
        variant: "timezoneWidget",
        theme: "light",
        location: "Shibuya, Tokyo",
        time: "10:25",
        dayProgress: 58,
        offsetLabel: "+4H",
        offsetTone: "success",
      },
    },
  },
  {
    id: "glass-timezone-dark",
    colSpan: 2,
    content: {
      type: "glassWidget",
      props: {
        variant: "timezoneWidget",
        theme: "dark",
        location: "Shibuya, Tokyo",
        time: "10:25",
        dayProgress: 42,
        offsetLabel: "-4H",
        offsetTone: "warning",
      },
    },
  },
  {
    id: "glass-uber",
    colSpan: 2,
    content: {
      type: "glassWidget",
      props: { variant: "rideShare", provider: "Uber", eta: "2 min", vehicle: "White sedan", model: "Mercedes-Benz" },
    },
  },
  {
    id: "glass-charging",
    colSpan: 2,
    content: { type: "glassWidget", props: { variant: "charging", percent: 68, timeLeft: "37 min left" } },
  },
  {
    id: "glass-flight",
    colSpan: 4,
    content: {
      type: "glassWidget",
      props: {
        variant: "flightArrival",
        size: "md",
        headline: "Arrival in 53min",
        origin: "London",
        originCode: "LHR",
        destination: "Istanbul",
        destinationCode: "IST",
        progress: 68,
      },
    },
  },
  {
    id: "glass-nav",
    colSpan: 4,
    content: {
      type: "glassWidget",
      props: { variant: "navigation", size: "md", turnDistance: "300m", eta: "10:21", remaining: "64 km", progress: 58 },
    },
  },
  {
    id: "glass-energy",
    colSpan: 4,
    content: {
      type: "glassWidget",
      props: { variant: "energyUsage", size: "md", percent: 57, durationLabel: "~ 5 hours", chartValues: [28, 44, 36, 52, 40] },
    },
  },
  {
    id: "glass-music",
    colSpan: 4,
    content: {
      type: "glassWidget",
      props: {
        variant: "musicWidget",
        size: "md",
        title: "Love On The Brain",
        artist: "Rihanna",
        source: "Spotify",
        progress: 42,
        playing: true,
      },
    },
  },
  {
    id: "glass-scooter",
    colSpan: 4,
    content: {
      type: "glassWidget",
      props: { variant: "scooterRide", size: "md", date: "Aug 12", distance: "3.2km", avgSpeed: "18.4km/h", calories: "186" },
    },
  },
  {
    id: "glass-activity",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "glassWidget",
      props: {
        variant: "activityOverview",
        size: "lg",
        distance: "2.8 km",
        goal: "64 km",
        goalProgress: 44,
        duration: "42m",
        avgSpeed: "4.0km/h",
        calories: "312",
      },
    },
  },
  {
    id: "glass-calendar",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "glassWidget",
      props: {
        variant: "activityCalendar",
        size: "lg",
        month: "August",
        year: "2024",
        days: [
          { day: 1, tone: "low" },
          { day: 2, tone: "high" },
          { day: 3, tone: "high" },
          { day: 4, tone: "milestone" },
          { day: 5, tone: "high" },
          { day: 6, tone: "low" },
          { day: 7 },
          { day: 8, tone: "high" },
          { day: 9, tone: "high" },
          { day: 10, tone: "high" },
          { day: 11, tone: "low" },
          { day: 12, tone: "high" },
          { day: 13, tone: "milestone" },
          { day: 14, tone: "high" },
          { day: 15, tone: "high" },
          { day: 16 },
          { day: 17, tone: "low" },
          { day: 18, tone: "high" },
          { day: 19, tone: "high" },
          { day: 20, tone: "high" },
          { day: 21, tone: "high" },
          { day: 22, tone: "low" },
          { day: 23, tone: "high" },
          { day: 24, tone: "high" },
          { day: 25, tone: "milestone" },
          { day: 26, tone: "high" },
          { day: 27 },
          { day: 28, tone: "low" },
          { day: 29, tone: "high" },
          { day: 30, tone: "high" },
          { day: 31, tone: "high" },
        ],
      },
    },
  },
  {
    id: "live-stock-quote",
    colSpan: 6,
    rowSpan: 2,
    content: {
      type: "designCard",
      props: {
        variant: "stockQuote",
        size: "lg",
        symbol: "TSLA",
        company: "Tesla Inc.",
        brandMark: "T",
        brandColor: "#e82127",
        updated: "updated 2m ago",
        price: "£ 8,01",
        change: "+£0.92",
        changePercent: "1.24%",
        changeDirection: "up",
      },
    },
  },
  {
    id: "live-stock-activity",
    colSpan: 6,
    rowSpan: 2,
    content: {
      type: "designCard",
      props: {
        variant: "stockActivity",
        size: "lg",
        symbol: "TSLA",
        company: "Tesla Inc.",
        brandMark: "T",
        brandColor: "#e82127",
        updated: "updated 2m ago",
        activeIndices: [4, 5],
      },
    },
  },
  {
    id: "live-amazon-buy",
    colSpan: 4,
    content: { type: "designCard", props: { variant: "amazonBuy", symbol: "AMZN", company: "Amazon Ltd." } },
  },
  {
    id: "live-amazon-actions",
    colSpan: 4,
    content: { type: "designCard", props: { variant: "amazonActions", symbol: "AMZN", company: "Amazon Ltd." } },
  },
  {
    id: "live-price-alert",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "priceAlert",
        company: "Tesla, Inc.",
        alertLabel: "Price change",
        brandMark: "T",
        brandColor: "#e82127",
        progress: 73,
      },
    },
  },
  {
    id: "live-spendings",
    colSpan: 4,
    content: { type: "designCard", props: { variant: "statusSpendings", amount: "£32.43", location: "London" } },
  },
  {
    id: "live-eth",
    colSpan: 4,
    content: {
      type: "designCard",
      props: {
        variant: "statusCrypto",
        symbol: "ETH",
        change: "1.05%",
        changeDirection: "up",
        brandColor: "#627eea",
      },
    },
  },
  {
    id: "creator-rick",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "creatorWidget",
      props: {
        variant: "consultantProfile",
        name: "Rick Wright",
        verified: true,
        available: true,
        priceTier: "$$$",
        durationValue: "25",
        durationLabel: "Minutes",
        followerCount: "+299K",
        rating: "4.5",
        bio: "A dedicated Productivity Manager with over a decade",
        memberNames: ["Alex", "Jordan", "Sam", "Riley"],
      },
    },
  },
  {
    id: "creator-quote",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "creatorWidget",
      props: {
        variant: "quoteArticle",
        showName: "Rick's Podcast",
        verified: true,
        subtitle: "How to improve communication in a relationship",
        dateValue: "30",
        dateLabel: "January",
        quote: "One of our proudest achievements was helping Michael",
      },
    },
  },
  {
    id: "creator-stream",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "creatorWidget",
      props: {
        variant: "streamEpisode",
        hostName: "John Doe",
        verified: true,
        donateLabel: "Donate",
        durationValue: "52",
        durationLabel: "minutes",
        rating: "5.0",
        title: "How to improve communication in a relationship",
        memberNames: "Alex",
        extraMembers: "+3",
      },
    },
  },
  {
    id: "creator-video",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "creatorWidget",
      props: {
        variant: "videoCourse",
        showName: "Rick's Podcast",
        verified: true,
        available: true,
        priceTier: "$$$",
        episodeCount: "+6 Episodes",
        durationValue: "25",
        durationLabel: "Minutes",
        adFree: true,
        viewCount: "14k Views",
        rating: "5.0",
        memberNames: ["Alex", "Jordan", "Sam"],
        phoneAction: true,
      },
    },
  },
  {
    id: "creator-live",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "creatorWidget",
      props: {
        variant: "liveCourse",
        hostName: "John Doe",
        verified: true,
        donateLabel: "Donate",
        sessionCount: "5 Sessions /",
        viewerCount: "(8)",
        live: true,
        title: "Title Of The Course",
        memberNames: ["Alex", "Jordan", "Sam"],
      },
    },
  },
  {
    id: "creator-audio",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "creatorWidget",
      props: {
        variant: "audioPlayer",
        title: "Title: Subject",
        subtitle: "Here's the info about the audio.",
        timeValue: "1:30",
        timeLabel: "hh / mm",
        chapterCount: "12 Capítulos",
        description: "A short overview of the audio content and what you'll learn in each chapter.",
      },
    },
  },
  {
    id: "creator-workshop",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "creatorWidget",
      props: {
        variant: "workshopEvent",
        hostName: "Sarah Chen",
        verified: true,
        eventTitle: "Design Systems at Scale",
        countdownValue: "2d",
        countdownLabel: "Starts in",
        spotsLeft: "12 spots left",
        memberNames: ["Alex", "Jordan", "Sam", "Riley"],
      },
    },
  },
  {
    id: "creator-masterclass",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "creatorWidget",
      props: {
        variant: "masterclass",
        instructorName: "Elena Vasquez",
        verified: true,
        courseTitle: "Advanced Typography",
        lessonCount: "24 lessons",
        price: "$89",
        rating: "4.9",
        durationValue: "6",
        durationLabel: "Hours",
      },
    },
  },
  {
    id: "creator-newsletter",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "creatorWidget",
      props: {
        variant: "newsletterSignup",
        publisherName: "The Weekly Brief",
        verified: true,
        subscriberCount: "48K subscribers",
        issueValue: "#142",
        issueLabel: "Issue",
        headline: "Why async work is reshaping creative teams",
      },
    },
  },
  {
    id: "creator-coaching",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "creatorWidget",
      props: {
        variant: "coachingSlot",
        coachName: "Jordan Hayes",
        verified: true,
        specialty: "Executive coaching",
        slotTime: "3:00",
        slotDate: "PM Today",
        timezone: "EST",
        rating: "4.8",
        price: "$120",
      },
    },
  },
];
