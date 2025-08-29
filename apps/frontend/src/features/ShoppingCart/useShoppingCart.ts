import type { Recipe } from "@albion_online/common";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CartItem, MaterialItem } from "./types";

export const useShoppingCart = (craftingCategory: string) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const requiredMaterials: MaterialItem[] = useMemo(() => {
    const materials: MaterialItem[] = [];
    cartItems.forEach((item) => {
      item.recipe.ingredients.forEach((ingredient) => {
        const existing = materials.find((m) => m.itemId === ingredient.itemId);
        if (existing) {
          existing.amount += ingredient.quantity * item.amount;
        } else {
          materials.push({
            itemId: ingredient.itemId,
            amount: ingredient.quantity * item.amount,
          });
        }
      });
    });
    return materials;
  }, [cartItems]);

  const addRecipeToCart = useCallback((recipe: Recipe) => {
    setCartItems((prev) => {
      const alreadyInCart = prev.find(
        (item) => item.recipe.recipeId === recipe.recipeId
      );

      if (alreadyInCart) {
        return prev.map((item) =>
          item.recipe.recipeId === recipe.recipeId
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      } else {
        return [...prev, { recipe, amount: 1 }];
      }
    });
  }, []);

  const removeRecipeFromCart = useCallback((recipe: Recipe) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.recipe.recipeId === recipe.recipeId
      );
      if (existing) {
        if (existing.amount > 1) {
          return prev.map((item) =>
            item.recipe.recipeId === recipe.recipeId
              ? { ...item, amount: item.amount - 1 }
              : item
          );
        } else {
          return prev.filter(
            (item) => item.recipe.recipeId !== recipe.recipeId
          );
        }
      }
      return prev;
    });
  console.log('DEBUG WW add')

  }, []);

  const resetCart = useCallback(() => {
    setCartItems([]);
  }, []);

  useEffect(() => {
    console.log('DEBUG LOADING FROM STORAGE')
    const elem = localStorage.getItem(`shoppingCart:${craftingCategory}`);
    if (elem) {
      setCartItems(JSON.parse(elem));
    }
  }, [craftingCategory]);

  useEffect(() => {
    console.log('DEBUG SAVING TO STORAGE')
    localStorage.setItem(
      `shoppingCart:${craftingCategory}`,
      JSON.stringify(cartItems)
    );
  }, [cartItems, craftingCategory]);

  return {
    cartItems,
    addRecipeToCart,
    removeRecipeFromCart,
    resetCart,
    requiredMaterials,
  };
};
