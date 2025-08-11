import type { GetPricesResponse, Recipe } from "@albion_online/common";
import { getMarketData } from "./getMarketData";
import type { CitySelectionsType } from "../CookingRecipesPage";

export const getOldestComponentAge = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: CitySelectionsType,
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
    const bestCity = selections[ingredient.itemId];
    if (!bestCity) return;
    const marketData = getMarketData(
      ingredient.itemId,
      priceData,
      false,
      bestCity
    );
    if (marketData) ages.push(marketData.minutesAgo);
  });
  return ages.length ? Math.max(...ages) : 0;
};
