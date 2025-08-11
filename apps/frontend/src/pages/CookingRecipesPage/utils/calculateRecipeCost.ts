import {
  returnRateBlackList,
  type GetPricesResponse,
  type Recipe,
} from "@albion_online/common";
import { getMarketData } from "./getMarketData";
import type { CitySelectionsType } from "../CookingRecipesPage";

export type RecipeCostDetails = {
  total: number;
  nutritionCost: number;
  blacklistedIngredientsCost: number;
  returnableIngredientsCost: number;
};

export const calculateRecipeCost = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: CitySelectionsType,
  pricePer100Nutrition: number,
  usingFocus: boolean
) => {
  // NOTE: tier 2 or less has no nutrition cost
  const nutritionCost =
    recipe.itemValue && recipe.tier > 2
      ? recipe.itemValue * 0.001125 * pricePer100Nutrition * recipe.quantity
      : 0;
  let returnableIngredientsCost = 0;
  let blacklistedIngredientsCost = 0;

  for (const ingredient of recipe.ingredients) {
    const bestCity = selections[ingredient.itemId];
    if (!bestCity) {
      // NOTE: we skip it because we will show in UI that we're missing prices
      continue;
    }
    const marketData = getMarketData(
      ingredient.itemId,
      priceData,
      false,
      bestCity
    );
    // if (!marketData) {
    //   throw new Error(
    //     `No market data found for ingredient ${ingredient.itemId}`
    //   );
    // }

    if (returnRateBlackList.includes(ingredient.itemId)) {
      blacklistedIngredientsCost += (marketData?.price || 0) * ingredient.quantity;
    } else {
      returnableIngredientsCost += (marketData?.price || 0) * ingredient.quantity;
    }
  }

  const returnRate = usingFocus ? 0.435 : 0.152;
  const recipeCost =
    nutritionCost +
    blacklistedIngredientsCost +
    returnableIngredientsCost * (1 - returnRate);
  return {
    totalCost: recipeCost,
    recipeCostDetails: {
      total: recipeCost,
      nutritionCost,
      blacklistedIngredientsCost,
      returnableIngredientsCost,
    },
  };
};
