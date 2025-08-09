import type { Recipe } from "@albion_online/common";

export const getEffectiveFocusCost = (recipe: Recipe): number => {
  if (!recipe.focus) return 0;
  // TODO: Implement the logic to calculate the effective focus cost
  return recipe.focus;
};
