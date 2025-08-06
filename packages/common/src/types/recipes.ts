export type Recipe = {
  recipeId: string;
  tier: number;
  quantity: number;
  ingredients: { itemId: string; quantity: number }[];
  nutrition: number;
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
