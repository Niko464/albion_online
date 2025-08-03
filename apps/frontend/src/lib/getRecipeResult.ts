import { PlayerStats, Recipe, RecipeResult } from "../utils/types";

function getRecipeResult(
  recipe: Recipe,
  player: PlayerStats
): RecipeResult {
  const foodSpecLevel = player.specializations[recipe.item] || 0;

  // Estimated reductions
  const specReduction = 0.0035 * foodSpecLevel;
  const masteryReduction = 0.0015 *  player.mastery;

  // NOTE: is there a cap here ?
  const totalReduction = Math.min(specReduction + masteryReduction, 0.5); // Cap at 50%

  const adjustedFocus = recipe.baseFocusCost * (1 - totalReduction);
  const fame = recipe.baseFame;

  return {
    item: recipe.item,
    tier: recipe.tier,
    fameGained: fame,
    focusCost: Math.round(adjustedFocus)
  };
}