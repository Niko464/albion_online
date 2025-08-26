import type { PlayerSpecializationStats, Recipe } from "@albion_online/common";

const getBonuses = (
  craftingCategory: string
): {
  masteryBonus: number;
  correctBranchBonus: number;
  wrongBranchBonus: number;
} => {
  switch (craftingCategory) {
    case "food":
      return {
        masteryBonus: 0.3,
        correctBranchBonus: 2.5,
        wrongBranchBonus: 0.3,
      };
    case "potion":
      return {
        masteryBonus: 0.3,
        correctBranchBonus: 2.5,
        wrongBranchBonus: 0.18,
      };
    default:
      throw new Error("getBonus: Unknown crafting category");
  }
};
// FORMULA FROM: https://forum.albiononline.com/index.php/Thread/126568-Cooking-Focus-Cost-Formula/
// Focus required = Focus base cost * 0.5^((Mastery level * 0.3 + Specialization level A * Specialization bonus A/100 + Specialization level B * Specialization bonus B/100 + ... + Specialization level N * Specialization bonus N/100 ) / 100)
// = 610 * 0,5^((2,8*U20 + 0,3*(U16+U17+U18+U19+U21+U22+U23+U24+U25))/100)
export const getEffectiveFocusCost = (
  recipe: Recipe,
  playerSpecStats: PlayerSpecializationStats | null
): number => {
  if (!recipe.focus) return 0;
  if (!playerSpecStats) return recipe.focus * recipe.quantity;
  const { masteryBonus, correctBranchBonus, wrongBranchBonus } = getBonuses(
    recipe.craftingCategory
  );
  const branchKeys = Object.keys(playerSpecStats.specializations);

  const specializationTotal = branchKeys.reduce((total, key) => {
    const isRecipeSameBranch = recipe.specializationBranchName === key;
    const specializationBonus = isRecipeSameBranch
      ? correctBranchBonus + wrongBranchBonus
      : wrongBranchBonus;
    const specializationLevel = playerSpecStats.specializations[key] || 0;
    return total + specializationLevel * specializationBonus;
  }, playerSpecStats.mastery * masteryBonus);

  return (
    recipe.focus * recipe.quantity * Math.pow(0.5, specializationTotal / 100)
  );
};
