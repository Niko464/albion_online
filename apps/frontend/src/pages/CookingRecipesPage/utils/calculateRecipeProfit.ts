import type { RecipeStats } from "@/utils/types";
import type { GetPricesResponse, Recipe } from "@albion_online/common";
import { calculateRecipeCost } from "./calculateRecipeCost";
import { getMarketData } from "./getMarketData";

export const calculateRecipeProfit = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: Record<string, string>,
  useInstantSell: boolean,
  pricePer100Nutrition: number,
  withFocus: boolean
): RecipeStats => {
  const recipeCost = calculateRecipeCost(
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
    };
  }
  const sellPrice = marketData.price;
  const profit = sellPrice * recipe.quantity - recipeCost;
  const percentage = recipeCost > 0 ? (profit / recipeCost) * 100 : 0;
  return {
    profit,
    percentage,
    recipeCost: recipeCost,
  };
};
