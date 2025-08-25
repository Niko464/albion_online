export type Recipe = {
  recipeId: string;
  tier: number;
  quantity: number;
  ingredients: { itemId: string; quantity: number; returnable?: boolean }[];
  itemValue: number | null;
  focus: number | null;
  fame: number | null;
  specializationBranchName: string | null;
  craftingCategory: string;
};

export type PlayerSpecializationStats = {
  mastery: number;
  specializations: Record<string, number>; // ex: "Pie": 50
};
