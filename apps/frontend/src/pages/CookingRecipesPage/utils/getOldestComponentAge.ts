import type { GetPricesResponse, Recipe } from "@albion_online/common";
import { getMarketData } from "./getMarketData";

export const getOldestComponentAge = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: Record<string, string>,
  useInstantSell: boolean
): number => {
  const ages: number[] = [];
  const recipeMarket = getMarketData(
    recipe.recipeId,
    priceData,
    useInstantSell,
    selections[recipe.recipeId] || ""
  );
  if (recipeMarket) ages.push(recipeMarket.minutesAgo);
  recipe.ingredients.forEach((ingredient) => {
    const marketData = getMarketData(
      ingredient.itemId,
      priceData,
      false,
      selections[ingredient.itemId] || ""
    );
    if (marketData) ages.push(marketData.minutesAgo);
  });
  return ages.length ? Math.max(...ages) : 0;
};
