import type { RecipeRowData } from "@/utils/types";
import { useMemo } from "react";
import { calculateRecipeProfit } from "../utils/calculateRecipeProfit";
import { getOldestComponentAge } from "../utils/getOldestComponentAge";
import { getEffectiveFocusCost } from "../utils/calculateEffectiveFocusCost";
import { getBestMarket } from "../getBestMarket";
import type {
  GetPricesResponse,
  GetSoldHistoryResponse,
  PlayerSpecializationStats,
  Recipe,
} from "@albion_online/common";
import type { CitySelectionsType } from "../RecipePage";

export const useRecipeData = (
  priceData: GetPricesResponse | undefined,
  selections: CitySelectionsType,
  useInstantSell: boolean,
  allRecipes: Recipe[],
  soldHistoryData: GetSoldHistoryResponse | undefined,
  missingPriceDataItemIds: string[] | null,
  playerSpec: PlayerSpecializationStats
) => {
  const data: RecipeRowData[] = useMemo(() => {
    if (!priceData || !soldHistoryData || !missingPriceDataItemIds) return [];
    return allRecipes.map((recipe) => {
      const withoutFocusRecipeStats = calculateRecipeProfit(
        recipe,
        priceData,
        selections,
        useInstantSell,
        // TODO: not make this hardcoded
        1000,
        false
      );
      const withFocusRecipeStats = calculateRecipeProfit(
        recipe,
        priceData,
        selections,
        useInstantSell,
        // TODO: not make this hardcoded
        1000,
        true
      );
      const oldestAge = getOldestComponentAge(
        recipe,
        priceData,
        selections,
        useInstantSell
      );
      const effectiveFocusWithoutSpecialization = getEffectiveFocusCost(
        recipe,
        null
      );
      const effectiveFocusWithSpecialization = getEffectiveFocusCost(
        recipe,
        playerSpec
      );

      // NOTE: the place where I can buy the recipe the cheapest at
      const cheapestMarketPrice = getBestMarket(
        recipe.recipeId,
        priceData,
        false
      );

      // if (!cheapestMarketPrice) {
      //   throw new Error(
      //     `No market data found for recipe ${recipe.recipeId} (cheapestMarketPrice)`
      //   );
      // }
      const famePerSilverInvestedSellCity =
        cheapestMarketPrice?.locationName || "Non existing";

      // TODO: I am trying to maximize fame, I need to make a list
      const famePerSilverInvested = recipe.fame
        ? (recipe.fame * 2.75) /
          ((cheapestMarketPrice?.offerOrders[0].price || 1) * recipe.quantity)
        : 0;

      const selectedCity = selections[recipe.recipeId];
      const selectedCityMarketStats = soldHistoryData.histories
        .find((el) => el.itemId === recipe.recipeId)
        ?.markets.find((el) => el.location === selectedCity);

      // if (!selectedCityMarketStats) {
      //   throw new Error("No market stats for selected sell city");
      // }

      return {
        recipe,
        sellCityMarketStats: selectedCityMarketStats,
        withFocusRecipeStats,
        withoutFocusRecipeStats,
        oldestAge,
        silverPerFocusWithoutSpecialization:
          (withFocusRecipeStats.profit - withoutFocusRecipeStats.profit) /
          effectiveFocusWithoutSpecialization,
        silverPerFocusWithSpecialization:
          (withFocusRecipeStats.profit - withoutFocusRecipeStats.profit) /
          effectiveFocusWithSpecialization,
        focusCostWithSpecialization: effectiveFocusWithSpecialization,
        famePerSilverInvested,
        famePerSilverInvestedSellCity,
        otherSilverPerFoca:
          withFocusRecipeStats.profit / effectiveFocusWithSpecialization,
      } satisfies RecipeRowData;
    });
  }, [
    priceData,
    soldHistoryData,
    missingPriceDataItemIds,
    allRecipes,
    selections,
    useInstantSell,
    playerSpec,
  ]);

  return data;
};
