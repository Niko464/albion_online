import type { Recipe } from "@albion_online/common";
import { useCallback, useMemo, useState } from "react";

type CartItem = {
  amount: number;
  recipe: Recipe;
};

type MaterialItem = {
  itemId: string;
  amount: number;
}

export const useShoppingCart = (craftingCategory: string[]) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const requiredMaterials: MaterialItem[] = useMemo(() => {
    const materials: MaterialItem[] = [];
    cartItems.forEach((item) => {
      item.recipe.ingredients.forEach((ingredient) => {
        const existing = materials.find((m) => m.itemId === ingredient.id);
        if (existing) {
          existing.amount += ingredient.amount * item.amount;
        } else {
          materials.push({
            itemId: ingredient.id,
            amount: ingredient.amount * item.amount,
          });
        }
      });
    });
    return materials;
  }, [cartItems]);

  const addItemToCart = useCallback(() => {
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

  const resetCart = useCallback(() => {
    setCartItems([]);
  }, []);

  

  return {
    resetCart,
  };
};
