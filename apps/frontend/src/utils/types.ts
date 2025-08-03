export type Recipe = {
  item: string;
  tier: number;
  quantity: number;
  baseFame: number;
  baseFocusCost: number; // Focus cost to craft the quantity
};

export type PlayerStats = {
  mastery: number;
  specializations: Record<string, number>; // ex: "Chicken Omelette": 50
};

export type RecipeResult = {
  item: string;
  tier: number;
  fameGained: number;
  focusCost: number;
};

export const allCities: string[] = [
  "Thetford",
  "Lymhurst",
  "Bridgewatch",
  "Martlock",
  "FortSterling",
  "Caerleon",
  "Brecilien",
];

export const cityColors: Record<string, string> = {
  Bridgewatch: "#eab308",
  "Bridgewatch Market": "#eab308",
  Lymhurst: "#22c55e",
  "Lymhurst Market": "#22c55e",
  FortSterling: "#9ca3af",
  "Fort Sterling": "#9ca3af",
  Martlock: "#60a5fa",
  "Martlock Market": "#60a5fa",
  Thetford: "#a855f7",
  "Thetford Market": "#a855f7",
  Caerleon: "#ef4444",
  "Caerleon Market": "#ef4444",
  Brecilien: "#f97316",
  "Brecilien Market": "#f97316",
};
