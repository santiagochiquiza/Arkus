const SCENARIOS = {
  tierra: {
    name: "Tierra",
    gravity: 9.8,
    mediumType: "gas",
    skyTop: "#87ceeb",
    skyBottom: "#dff6ff",
    ground: "#7c5a3a",
    landing: "#caa472"
  },
  luna: {
    name: "Luna",
    gravity: 1.6,
    mediumType: "gas",
    skyTop: "#111827",
    skyBottom: "#334155",
    ground: "#9ca3af",
    landing: "#d1d5db"
  },
  jupiter: {
    name: "Júpiter",
    gravity: 24.8,
    mediumType: "gas",
    skyTop: "#d97706",
    skyBottom: "#fde68a",
    ground: "#92400e",
    landing: "#f59e0b"
  },
  subacuatico: {
    name: "Subacuático",
    gravity: 9.8,
    mediumType: "fluid",
    skyTop: "#0ea5e9",
    skyBottom: "#bae6fd",
    ground: "#164e63",
    landing: "#22d3ee"
  },
  aceite: {
    name: "Aceite",
    gravity: 9.8,
    mediumType: "fluid",
    skyTop: "#fbbf24",
    skyBottom: "#fef3c7",
    ground: "#a16207",
    landing: "#f59e0b"
  }
};

function getScenario(key) {
  return SCENARIOS[key];
}