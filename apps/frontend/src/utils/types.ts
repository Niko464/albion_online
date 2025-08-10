import type { RecipeCostDetails } from "@/pages/CookingRecipesPage/utils/calculateRecipeCost";
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
  recipeCostDetails: RecipeCostDetails
};

// ---------------- TanStack Table Setup ----------------
export type RecipeRowData = {
  recipe: Recipe;
  withFocusRecipeStats: RecipeStats;
  withoutFocusRecipeStats: RecipeStats;
  focusCostWithSpecialization: number;
  silverPerFocusWithoutSpecialization: number;
  silverPerFocusWithSpecialization: number;
  oldestAge: number;
  famePerSilverInvested: number;
  famePerSilverInvestedSellCity: string;
};
