import type { NodalWorkspaceData } from "./types";

export const NODAL_SAMPLE_DATA: NodalWorkspaceData = {
  fileName: "Roadmap Sketch",
  tabs: [
    { id: "tab-meridian", label: "Meridian Launch Kit" },
    { id: "tab-q3", label: "Q3 Planning" },
    { id: "tab-onboarding", label: "Onboarding Flows" },
    { id: "tab-retro", label: "Team Retro" },
  ],
  nodes: [
    {
      id: "node-rect",
      kind: "rectangle",
      x: 120,
      y: 180,
      width: 280,
      height: 200,
    },
    {
      id: "node-circle",
      kind: "circle",
      x: 520,
      y: 200,
      width: 160,
      height: 160,
      label: "Ship beta",
    },
  ],
  connectors: [{ id: "conn-1", fromId: "node-rect", toId: "node-circle" }],
};
