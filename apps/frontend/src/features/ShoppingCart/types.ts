import type { Recipe } from "@albion_online/common";

export type CartItem = {
  amount: number;
  recipe: Recipe;
};

export type MaterialItem = {
  itemId: string;
  amount: number;
};
