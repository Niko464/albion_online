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

  const addRecipeToCart = useCallback((recipe: Recipe, amount: number = 1) => {
    setCartItems((prev) => {
      const alreadyInCart = prev.find(
        (item) => item.recipe.recipeId === recipe.recipeId
      );

      if (alreadyInCart) {
        return prev.map((item) =>
          item.recipe.recipeId === recipe.recipeId
            ? { ...item, amount: item.amount + amount }
            : item
        );
      } else {
        return [...prev, { recipe, amount: amount }];
      }
    });
  }, []);

  const removeRecipeFromCart = useCallback((recipe: Recipe, amount: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.recipe.recipeId === recipe.recipeId
      );
      if (existing) {
        if (existing.amount > amount) {
          return prev.map((item) =>
            item.recipe.recipeId === recipe.recipeId
              ? { ...item, amount: item.amount - amount }
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
    console.log("DEBUG WW add");
  }, []);

  const resetCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(`shoppingCart:${craftingCategory}`);
  }, [craftingCategory]);

  useEffect(() => {
    console.log("DEBUG LOADING FROM STORAGE");
    const elem = localStorage.getItem(`shoppingCart:${craftingCategory}`);
    if (elem) {
      setCartItems(JSON.parse(elem));
    }
  }, [craftingCategory]);

  useEffect(() => {
    console.log("DEBUG SAVING TO STORAGE");
    if (cartItems.length > 0) {
      localStorage.setItem(
        `shoppingCart:${craftingCategory}`,
        JSON.stringify(cartItems)
      );
    }
  }, [cartItems, craftingCategory]);

  return {
    cartItems,
    addRecipeToCart,
    removeRecipeFromCart,
    resetCart,
    requiredMaterials,
  };
};
