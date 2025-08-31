import type { Recipe } from "@albion_online/common";
import { Minus, Plus } from "lucide-react";
import type { useShoppingCart } from "./useShoppingCart";

type Props = {
  recipe: Recipe;
  addToCart: ReturnType<typeof useShoppingCart>['addRecipeToCart'];
  removeFromCart: ReturnType<typeof useShoppingCart>['removeRecipeFromCart'];
};

export function ShoppingAddItem({ recipe, addToCart, removeFromCart }: Props) {
  return (
    <div className="flex flex-col ml-1 bg-accent">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (e.shiftKey) {
            addToCart(recipe, 5);
            return;
          }

          addToCart(recipe);
        }}
        className="text-green-600 hover:text-green-800"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (e.shiftKey) {
            removeFromCart(recipe, 5);
            return;
          }
          removeFromCart(recipe);
        }}
        className="text-red-600 hover:text-red-800"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}
