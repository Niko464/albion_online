import {
  returnRateBlackList,
  type GetPricesResponse,
  type Recipe,
} from "@albion_online/common";
import { getMarketData } from "./getMarketData";

export const calculateRecipeCost = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: Record<string, string>,
  pricePer100Nutrition: number,
  usingFocus: boolean
): number => {
  const nutritionCost = recipe.itemValue
    ? recipe.itemValue * 0.01125 * pricePer100Nutrition
    : 0;
  let returnableIngredientsCost = 0;
  let blacklistedIngredientsCost = 0;

  for (const ingredient of recipe.ingredients) {
    const marketData = getMarketData(
      ingredient.itemId,
      priceData,
      false,
      selections[ingredient.itemId] || ""
    );
    if (!marketData) {
      return 500000000
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

  return nutritionCost + blacklistedIngredientsCost + returnableIngredientsCost * (1 - (usingFocus ? 0.435 : 0.152));
};
