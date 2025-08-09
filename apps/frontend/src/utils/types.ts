import type { Recipe } from "@albion_online/common";

export interface MarketData {
  locationName: string;
  price: number;
  minutesAgo: number;
}

export type RecipeStats = {
  profit: number;
  percentage: number;
  recipeCost: number;
};

// ---------------- TanStack Table Setup ----------------
export type RecipeRowData = {
  recipe: Recipe;
  withFocusRecipeStats: RecipeStats;
  withoutFocusRecipeStats: RecipeStats;
  silverPerFocus: number;
  oldestAge: number;
};
