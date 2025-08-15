import type { RecipeStats } from "@/utils/types";
import type { GetPricesResponse, Recipe } from "@albion_online/common";
import { calculateRecipeCost } from "./calculateRecipeCost";
import { getMarketData } from "./getMarketData";
import type { CitySelectionsType } from "../CookingRecipesPage";

export const calculateRecipeProfit = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: CitySelectionsType,
  useInstantSell: boolean,
  pricePer100Nutrition: number,
  withFocus: boolean
): RecipeStats => {
  const { totalCost: recipeCost, recipeCostDetails } = calculateRecipeCost(
    recipe,
    priceData,
    selections,
    pricePer100Nutrition,
    withFocus
  );
  const marketData = getMarketData(
    recipe.recipeId,
    priceData,
    useInstantSell,
    selections[recipe.recipeId] || ""
  );
  if (!marketData) {
    return {
      profit: -recipeCost,
      percentage: -100,
      recipeCost: recipeCost,
      recipeCostDetails,
    };
  }
  const sellPrice = marketData.price;
  const marketTax = 0.065; // 6.5%

  // Some recipes (e.g., Butcher/meat recipes) generate extra output instead of returning ingredients.
  const returnsInExtraOutput = recipe.specializationBranchName === "Butcher";
  const returnRate = withFocus ? 0.435 : 0.152;
  const outputMultiplier = returnsInExtraOutput ? 1 + returnRate : 1;

  const profit = sellPrice * recipe.quantity * outputMultiplier * (1 - marketTax) - recipeCost;
  const percentage = recipeCost > 0 ? (profit / recipeCost) * 100 : 0;
  return {
    profit,
    percentage,
    recipeCost: recipeCost,
    recipeCostDetails: recipeCostDetails,
  };
};
