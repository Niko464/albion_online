import {
  returnRateBlackList,
  type GetPricesResponse,
  type Recipe,
} from "@albion_online/common";
import { getMarketData } from "./getMarketData";

export type RecipeCostDetails = {
  total: number;
  nutritionCost: number;
  blacklistedIngredientsCost: number;
  returnableIngredientsCost: number;
};

export const calculateRecipeCost = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: Record<string, string>,
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
    const marketData = getMarketData(
      ingredient.itemId,
      priceData,
      false,
      selections[ingredient.itemId]
    );
    if (!marketData) {
      console.log("DEBUG ", priceData, selections[ingredient.itemId]);
      throw new Error(
        `No market data found for ingredient ${ingredient.itemId}`
      );
    }

    if (returnRateBlackList.includes(ingredient.itemId)) {
      blacklistedIngredientsCost += marketData.price * ingredient.quantity;
    } else {
      returnableIngredientsCost += marketData.price * ingredient.quantity;
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
