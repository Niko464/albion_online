import type { Recipe } from "@albion_online/common";
import { Minus, Plus } from "lucide-react";

type Props = {
  recipe: Recipe;
  addToCart: (recipe: Recipe) => void;
  removeFromCart: (recipe: Recipe) => void;
};

export function ShoppingAddItem({ recipe, addToCart, removeFromCart }: Props) {
  return (
    <div className="flex flex-col ml-1 bg-accent">
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(recipe);
        }}
        className="text-green-600 hover:text-green-800"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeFromCart(recipe);
        }}
        className="text-red-600 hover:text-red-800"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}
