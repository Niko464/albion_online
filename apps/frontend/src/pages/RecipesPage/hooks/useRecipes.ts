import { useMemo } from "react";
import recipesJSON from "../../../utils/recipes.json";

export function useRecipes(craftingCategory: string) {
  return useMemo(() => {
    const allRecipes = recipesJSON.filter(
      (r) => r.craftingCategory === craftingCategory
    );
    const branchNames = [
      ...new Set(
        allRecipes.map((r) => r.specializationBranchName).filter(Boolean)
      ),
    ];
    const ingredientIds = [
      ...new Set(allRecipes.flatMap((r) => r.ingredients.map((i) => i.itemId))),
    ];
    const recipeIds = allRecipes.map((r) => r.recipeId);
    const allIds = [...new Set([...ingredientIds, ...recipeIds])];
    return { allRecipes, branchNames, ingredientIds, recipeIds, allIds };
  }, [craftingCategory]);
}
