import type { WidgetTile } from "longformer-ui";

/** Fitness dashboard tiles inspired by dot-matrix health/lifestyle widgets. */

const weightTrackerValues = [
  90.2, 90.5, 91.0, 90.8, 91.2, 91.5, 91.0, 90.6, 90.1, 89.6, 89.2, 89.5, 89.8, 90.0,
  90.8, 91.2, 91.8, 92.2, 92.8, 92.4, 92.0, 91.4, 91.0, 90.4, 90.0, 89.7, 90.1, 90.6,
  91.2, 92.0, 92.6, 93.2, 92.5, 91.8,
];

export const fitnessWidgetTiles: WidgetTile[] = [
  {
    id: "fitness-weight-tracker",
    colSpan: 6,
    rowSpan: 2,
    content: {
      type: "fitnessWidget",
      props: {
        variant: "weightTracker",
        tabs: ["WEIGHT", "BMI"],
        activeTab: "WEIGHT",
        change: "-0.5",
        baseline: 89,
        threshold: 92,
        max: 94,
        values: weightTrackerValues,
      },
    },
  },
  {
    id: "fitness-workout-photo",
    colSpan: 3,
    content: {
      type: "fitnessWidget",
      props: {
        variant: "workoutPhoto",
        totalTime: "6H 20",
        totalTimeLabel: "TOTAL TIME",
      },
    },
  },
  {
    id: "fitness-hiking",
    colSpan: 3,
    content: {
      type: "fitnessWidget",
      props: {
        variant: "hiking",
        label: "HIKING",
        distance: "100",
        unit: "m",
        actionLabel: "START",
      },
    },
  },
  {
    id: "fitness-running",
    colSpan: 3,
    content: {
      type: "fitnessWidget",
      props: {
        variant: "running",
        date: "10.03",
        label: "RUNNING",
        distance: "10.00",
        unit: "KM",
        actionLabel: "START SESSION",
      },
    },
  },
  {
    id: "fitness-gym-streak",
    colSpan: 3,
    content: {
      type: "fitnessWidget",
      props: {
        variant: "gymStreak",
        title: "Gym streak",
        completed: 3,
        total: 7,
        dots: [
          true, true, false, true, false, false, false,
          false, false, false, false, false, false, false,
          false, false, false, false, false, false, false,
        ],
      },
    },
  },
  {
    id: "fitness-heart-rate",
    colSpan: 5,
    rowSpan: 2,
    content: {
      type: "fitnessWidget",
      props: {
        variant: "heartRate",
        title: "Heart rate",
        date: "Wed, 17 Jan 2024",
        average: 124,
        rangeMin: 56,
        rangeMax: 172,
        chartValues: [42, 68, 55, 92, 78, 110, 88, 124, 98, 72, 58, 84, 96, 118, 102, 76, 64, 88, 104, 92],
        chartLabels: ["12 AM", "2 PM", "4 PM", "6 PM", "8 PM"],
      },
    },
  },
  {
    id: "fitness-progress",
    colSpan: 7,
    rowSpan: 2,
    content: {
      type: "fitnessWidget",
      props: {
        variant: "progressTracker",
        title: "Progress",
        rows: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        columns: ["GYM", "HIKING", "YOGA", "RUNNING", "SLEEP"],
        cells: [
          true, true, false, true, false,
          true, false, true, false, true,
          false, true, true, true, false,
          true, true, false, false, true,
          false, false, true, true, true,
          true, false, false, true, false,
          false, true, true, false, true,
        ],
      },
    },
  },
  {
    id: "fitness-music",
    colSpan: 4,
    rowSpan: 2,
    content: {
      type: "fitnessWidget",
      props: {
        variant: "musicPlayer",
        title: "Nonstop",
        artist: "Drake",
        progress: 38,
        playing: true,
        upNext: [
          { title: "SICKO MODE", artist: "Travis Scott", swatch: "#3d3d3d" },
          { title: "WOW.", artist: "Post Malone", swatch: "#5a4a3a" },
          { title: "Sunflower", artist: "Post Malone", swatch: "#4a5a6a" },
          { title: "God's Plan", artist: "Drake", swatch: "#2a2a2a" },
        ],
      },
    },
  },
  {
    id: "fitness-steps",
    colSpan: 3,
    rowSpan: 2,
    content: {
      type: "fitnessWidget",
      props: {
        variant: "stepsStreak",
        steps: "5,548",
        streak: "1 DAY",
      },
    },
  },
  {
    id: "fitness-weather",
    colSpan: 5,
    rowSpan: 2,
    content: {
      type: "fitnessWidget",
      props: {
        variant: "weather",
        temperature: "30°",
        high: "35°",
        low: "16°",
        location: "Toronto",
        condition: "Partly Cloudy",
        forecast: [
          { label: "WED", high: "-3°", low: "-6°", icon: "partly-cloudy" },
          { label: "THU", high: "-2°", low: "-7°", icon: "cloud" },
          { label: "FRI", high: "1°", low: "-4°", icon: "sun" },
          { label: "SAT", high: "3°", low: "-2°", icon: "partly-cloudy" },
          { label: "SUN", high: "0°", low: "-5°", icon: "cloud" },
          { label: "MON", high: "-1°", low: "-6°", icon: "partly-cloudy" },
        ],
      },
    },
  },
];
