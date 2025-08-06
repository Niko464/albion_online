import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomPrices } from "@/hooks/useCustomPrices";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useState } from "react";
import { getBestMarket } from "./getBestMarket";
import type { Recipe } from "@albion_online/common";

const recipes: Recipe[] = [
  {
    recipeId: "T1_MEAL_GRILLEDFISH",
    tier: 1,
    quantity: 1,
    ingredients: [{ itemId: "T1_FISH", quantity: 10 }],
    nutrition: 0,
  },
  {
    recipeId: "T1_MEAL_SEAWEEDSALAD",
    tier: 1,
    quantity: 1,
    ingredients: [{ itemId: "T1_SEAWEED", quantity: 10 }],
    nutrition: 0,
  },
  {
    recipeId: "T1_FISHSAUCE_1",
    tier: 1,
    quantity: 1,
    ingredients: [
      { itemId: "T1_FISH", quantity: 15 },
      { itemId: "T1_SEAWEED", quantity: 1 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T1_FISHSAUCE_2",
    tier: 1,
    quantity: 1,
    ingredients: [
      { itemId: "T1_FISH", quantity: 45 },
      { itemId: "T1_SEAWEED", quantity: 3 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T1_FISHSAUCE_3",
    tier: 1,
    quantity: 1,
    ingredients: [
      { itemId: "T1_FISH", quantity: 135 },
      { itemId: "T1_SEAWEED", quantity: 9 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T1_MEAL_SOUP",
    tier: 1,
    quantity: 10,
    ingredients: [{ itemId: "T1_CARROT", quantity: 16 }],
    nutrition: 0,
  },
  {
    recipeId: 'T1_MEAL_SOUP_FISH',
    tier: 1,
    quantity: 1,
    ingredients: [
      { itemId: "T3_FISH_FRESHWATER_SWAMP_RARE", quantity: 1 },
      { itemId: "T1_CARROT", quantity: 2 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T2_MEAL_SALAD",
    tier: 2,
    quantity: 10,
    ingredients: [
      { itemId: "T1_CARROT", quantity: 8 },
      { itemId: "T2_BEAN", quantity: 8 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T2_MEAL_SALAD_FISH",
    tier: 2,
    quantity: 1,
    ingredients: [
      { itemId: "T3_FISH_SALTWATER_ALL_RARE", quantity: 1 },
      { itemId: "T2_BEAN", quantity: 1 },
      {
        itemId: "T2_AGARIC",
        quantity: 1,
      },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T3_MEAL_SOUP",
    tier: 3,
    quantity: 10,
    ingredients: [{ itemId: "T3_WHEAT", quantity: 48 }],
    nutrition: 0,
  },
  {
    recipeId: "T3_MEAL_SOUP_FISH",
    tier: 3,
    quantity: 1,
    ingredients: [
      { itemId: "T5_FISH_FRESHWATER_SWAMP_RARE", quantity: 1 },
      {
        itemId: "T3_WHEAT",
        quantity: 2,
      },
      { itemId: "T3_COMFREY", quantity: 2 },
      {
        itemId: "T3_MEAT",
        quantity: 2,
      },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T3_MEAL_OMELETTE",
    tier: 3,
    quantity: 10,
    ingredients: [
      { itemId: "T3_WHEAT", quantity: 4 },
      { itemId: "T3_MEAT", quantity: 8 },
      { itemId: "T3_EGG", quantity: 2 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T3_MEAL_OMELETTE_FISH",
    tier: 3,
    quantity: 1,
    ingredients: [
      {
        itemId: "T3_FISH_FRESHWATER_STEPPE_RARE",
        quantity: 1,
      },
      { itemId: "T3_COMFREY", quantity: 1 },
      { itemId: "T3_EGG", quantity: 1 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T3_MEAL_OMELETTE_AVALON",
    tier: 3,
    quantity: 1,
    ingredients: [
      {
        itemId: "T4_MILK",
        quantity: 4,
      },
      { itemId: "T3_MEAT", quantity: 8 },
      { itemId: "T3_EGG", quantity: 2 },
      { itemId: "QUESTITEM_TOKEN_AVALON", quantity: 10 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T3_MEAL_PIE",
    tier: 3,
    quantity: 10,
    ingredients: [
      { itemId: "T3_WHEAT", quantity: 2 },
      { itemId: "T3_FLOUR", quantity: 4 },
      { itemId: "T3_MEAT", quantity: 8 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T3_MEAL_PIE_FISH",
    tier: 3,
    quantity: 1,
    ingredients: [
      { itemId: "T3_FISH_FRESHWATER_MOUNTAIN_RARE", quantity: 1 },
      { itemId: "T3_FLOUR", quantity: 1 },
      { itemId: "T3_EGG", quantity: 1 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T3_MEAL_ROAST",
    tier: 3,
    quantity: 10,
    ingredients: [
      { itemId: "T3_MEAT", quantity: 8 },
      { itemId: "T2_BEAN", quantity: 4 },
      { itemId: "T4_MILK", quantity: 4 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T3_MEAL_ROAST_FISH",
    tier: 3,
    quantity: 1,
    ingredients: [
      { itemId: "T3_FISH_FRESHWATER_AVALON_RARE", quantity: 1 },
      { itemId: "T3_COMFREY", quantity: 1 },
      { itemId: "T4_MILK", quantity: 1 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T4_MEAL_SALAD",
    tier: 4,
    quantity: 10,
    ingredients: [
      { itemId: "T4_TURNIP", quantity: 24 },
      { itemId: "T3_WHEAT", quantity: 24 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T4_MEAL_SALAD_FISH",
    tier: 4,
    quantity: 1,
    ingredients: [
      { itemId: "T5_FISH_SALTWATER_ALL_RARE", quantity: 1 },
      { itemId: "T4_TURNIP", quantity: 2 },
      { itemId: "T4_BURDOCK", quantity: 2 },
      { itemId: "T4_MEAT", quantity: 2 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T4_MEAL_STEW",
    tier: 4,
    quantity: 10,
    ingredients: [
      { itemId: "T4_TURNIP", quantity: 4 },
      { itemId: "T3_BREAD", quantity: 4 },
      { itemId: "T4_MEAT", quantity: 8 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T4_MEAL_SANDWICH",
    tier: 4,
    quantity: 10,
    ingredients: [
      { itemId: "T4_MEAT", quantity: 8 },
      { itemId: "T3_BREAD", quantity: 4 },
      { itemId: "T4_BUTTER", quantity: 2 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T4_MEAL_STEW_FISH",
    tier: 4,
    quantity: 1,
    ingredients: [
      { itemId: "T3_FISH_FRESHWATER_FOREST_RARE", quantity: 1 },
      { itemId: "T4_TURNIP", quantity: 1 },
      { itemId: "T4_BURDOCK", quantity: 1 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T4_MEAL_STEW_AVALON",
    tier: 4,
    quantity: 10,
    ingredients: [
      { itemId: "T1_CARROT", quantity: 4 },
      { itemId: "T4_TURNIP", quantity: 4 },
      { itemId: "T4_MEAT", quantity: 8 },
      { itemId: "QUESTITEM_TOKEN_AVALON", quantity: 10 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T4_MEAL_SANDWICH",
    tier: 4,
    quantity: 10,
    ingredients: [
      { itemId: "T4_BREAD", quantity: 4 },
      { itemId: "T4_MEAT", quantity: 8 },
      { itemId: "T4_BUTTER", quantity: 2 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T4_MEAL_SANDWICH_FISH",
    tier: 4,
    quantity: 1,
    ingredients: [
      { itemId: "T3_FISH_FRESHWATER_HIGHLANDS_RARE", quantity: 1 },
      { itemId: "T4_TURNIP", quantity: 1 },
      { itemId: "T4_BUTTER", quantity: 1 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T4_MEAL_SANDWICH_AVALON",
    tier: 4,
    quantity: 1,
    ingredients: [
      { itemId: "T4_BREAD", quantity: 4 },
      { itemId: "T4_MEAT", quantity: 8 },
      { itemId: "T4_BUTTER", quantity: 2 },
      { itemId: "QUESTITEM_TOKEN_AVALON", quantity: 10 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T5_MEAL_SOUP",
    tier: 5,
    quantity: 10,
    ingredients: [{ itemId: "T5_CABBAGE", quantity: 144 }],
    nutrition: 0,
  },
  {
    recipeId: "T5_MEAL_SOUP_FISH",
    tier: 5,
    quantity: 1,
    ingredients: [
      { itemId: "T7_FISH_FRESHWATER_SWAMP_RARE", quantity: 1 },
      { itemId: "T5_CABBAGE", quantity: 6 },
      { itemId: "T5_TEASEL", quantity: 6 },
      { itemId: "T5_MEAT", quantity: 6 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T5_MEAL_OMELETTE",
    tier: 5,
    quantity: 10,
    ingredients: [
      { itemId: "T5_CABBAGE", quantity: 12 },
      { itemId: "T5_MEAT", quantity: 24 },
      { itemId: "T5_EGG", quantity: 6 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T5_MEAL_OMELETTE_FISH",
    tier: 5,
    quantity: 1,
    ingredients: [
      { itemId: "T5_FISH_FRESHWATER_STEPPE_RARE", quantity: 1 },
      { itemId: "T5_CABBAGE", quantity: 2 },
      { itemId: "T5_TEASEL", quantity: 2 },
      { itemId: "T5_EGG", quantity: 2 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T5_MEAL_OMELETTE_AVALON",
    tier: 5,
    quantity: 10,
    ingredients: [
      { itemId: "T6_MILK", quantity: 12 },
      { itemId: "T5_MEAT", quantity: 24 },
      { itemId: "T5_EGG", quantity: 6 },
      { itemId: "QUESTITEM_TOKEN_AVALON", quantity: 30 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T5_MEAL_PIE",
    tier: 5,
    quantity: 10,
    ingredients: [
      { itemId: "T5_CABBAGE", quantity: 6 },
      { itemId: "T3_FLOUR", quantity: 12 },
      { itemId: "T5_MEAT", quantity: 24 },
      { itemId: "T4_MILK", quantity: 6 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T5_MEAL_PIE_FISH",
    tier: 5,
    quantity: 1,
    ingredients: [
      { itemId: "T5_FISH_FRESHWATER_MOUNTAIN_RARE", quantity: 1 },
      { itemId: "T5_CABBAGE", quantity: 2 },
      { itemId: "T5_TEASEL", quantity: 2 },
      { itemId: "T5_EGG", quantity: 2 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T5_MEAL_ROAST",
    tier: 5,
    quantity: 10,
    ingredients: [
      { itemId: "T5_MEAT", quantity: 24 },
      { itemId: "T5_CABBAGE", quantity: 12 },
      { itemId: "T6_MILK", quantity: 12 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T5_MEAL_ROAST_FISH",
    tier: 5,
    quantity: 1,
    ingredients: [
      { itemId: "T5_FISH_FRESHWATER_AVALON_RARE", quantity: 1 },
      { itemId: "T5_CABBAGE", quantity: 2 },
      { itemId: "T5_TEASEL", quantity: 2 },
      { itemId: "T6_MILK", quantity: 2 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T6_MEAL_SALAD",
    tier: 6,
    quantity: 10,
    ingredients: [
      { itemId: "T6_POTATO", quantity: 72 },
      { itemId: "T5_CABBAGE", quantity: 72 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T6_MEAL_SALAD_FISH",
    tier: 6,
    quantity: 1,
    ingredients: [
      { itemId: "T7_FISH_SALTWATER_ALL_RARE", quantity: 1 },
      { itemId: "T6_POTATO", quantity: 6 },
      { itemId: "T6_FOXGLOVE", quantity: 6 },
      { itemId: "T6_MEAT", quantity: 6 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T6_MEAL_STEW",
    tier: 6,
    quantity: 10,
    ingredients: [
      { itemId: "T6_POTATO", quantity: 12 },
      { itemId: "T4_BREAD", quantity: 12 },
      { itemId: "T6_MEAT", quantity: 24 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T6_MEAL_STEW_FISH",
    tier: 6,
    quantity: 1,
    ingredients: [
      { itemId: "T5_FISH_FRESHWATER_FOREST_RARE", quantity: 1 },
      { itemId: "T6_POTATO", quantity: 2 },
      { itemId: "T6_FOXGLOVE", quantity: 2 },
      { itemId: "T6_MILK", quantity: 2 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T6_MEAL_STEW_AVALON",
    tier: 6,
    quantity: 10,
    ingredients: [
      { itemId: "T5_CABBAGE", quantity: 12 },
      { itemId: "T6_POTATO", quantity: 12 },
      { itemId: "T6_MEAT", quantity: 24 },
      { itemId: "QUESTITEM_TOKEN_AVALON", quantity: 30 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T6_MEAL_SANDWICH",
    tier: 6,
    quantity: 10,
    ingredients: [
      { itemId: "T4_BREAD", quantity: 12 },
      { itemId: "T6_MEAT", quantity: 24 },
      { itemId: "T6_BUTTER", quantity: 6 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T6_MEAL_SANDWICH_FISH",
    tier: 6,
    quantity: 1,
    ingredients: [
      { itemId: "T5_FISH_FRESHWATER_HIGHLANDS_RARE", quantity: 1 },
      { itemId: "T6_POTATO", quantity: 2 },
      { itemId: "T6_FOXGLOVE", quantity: 2 },
      { itemId: "T6_BUTTER", quantity: 2 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T6_MEAL_SANDWICH_AVALON",
    tier: 6,
    quantity: 1,
    ingredients: [
      { itemId: "T4_BREAD", quantity: 12 },
      { itemId: "T6_MEAT", quantity: 24 },
      { itemId: "T6_BUTTER", quantity: 6 },
      { itemId: "QUESTITEM_TOKEN_AVALON", quantity: 30 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T7_MEAL_OMELETTE",
    tier: 7,
    quantity: 10,
    ingredients: [
      { itemId: "T7_CORN", quantity: 36 },
      { itemId: "T7_MEAT", quantity: 72 },
      { itemId: "T5_EGG", quantity: 18 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T7_MEAL_OMELETTE_FISH",
    tier: 7,
    quantity: 1,
    ingredients: [
      { itemId: "T7_FISH_FRESHWATER_STEPPE_RARE", quantity: 1 },
      { itemId: "T7_CORN", quantity: 6 },
      { itemId: "T7_MULLEIN", quantity: 6 },
      { itemId: "T7_MEAT", quantity: 6 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T7_MEAL_OMELETTE_AVALON",
    tier: 7,
    quantity: 10,
    ingredients: [
      { itemId: "T8_MILK", quantity: 36 },
      { itemId: "T7_MEAT", quantity: 72 },
      { itemId: "T5_EGG", quantity: 18 },
      { itemId: "QUESTITEM_TOKEN_AVALON", quantity: 90 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T7_MEAL_PIE",
    tier: 7,
    quantity: 10,
    ingredients: [
      { itemId: "T7_CORN", quantity: 18 },
      { itemId: "T3_FLOUR", quantity: 36 },
      { itemId: "T7_MEAT", quantity: 72 },
      { itemId: "T6_MILK", quantity: 18 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T7_MEAL_PIE_FISH",
    tier: 7,
    quantity: 1,
    ingredients: [
      { itemId: "T7_FISH_FRESHWATER_MOUNTAIN_RARE", quantity: 1 },
      { itemId: "T7_CORN", quantity: 6 },
      { itemId: "T7_MULLEIN", quantity: 6 },
      { itemId: "T7_MEAT", quantity: 6 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T7_MEAL_ROAST",
    tier: 7,
    quantity: 10,
    ingredients: [
      { itemId: "T7_MEAT", quantity: 72 },
      { itemId: "T7_CORN", quantity: 36 },
      { itemId: "T8_MILK", quantity: 36 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T7_MEAL_ROAST_FISH",
    tier: 7,
    quantity: 1,
    ingredients: [
      { itemId: "T7_FISH_FRESHWATER_AVALON_RARE", quantity: 1 },
      { itemId: "T7_CORN", quantity: 6 },
      { itemId: "T7_MULLEIN", quantity: 6 },
      { itemId: "T8_MILK", quantity: 6 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T8_MEAL_STEW",
    tier: 8,
    quantity: 10,
    ingredients: [
      { itemId: "T8_PUMPKIN", quantity: 36 },
      { itemId: "T4_BREAD", quantity: 36 },
      { itemId: "T8_MEAT", quantity: 72 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T8_MEAL_STEW_FISH",
    tier: 8,
    quantity: 1,
    ingredients: [
      { itemId: "T7_FISH_FRESHWATER_FOREST_RARE", quantity: 1 },
      { itemId: "T8_PUMPKIN", quantity: 6 },
      { itemId: "T8_YARROW", quantity: 6 },
      { itemId: "T8_MILK", quantity: 6 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T8_MEAL_STEW_AVALON",
    tier: 8,
    quantity: 10,
    ingredients: [
      { itemId: "T7_CORN", quantity: 36 },
      { itemId: "T8_PUMPKIN", quantity: 36 },
      { itemId: "T8_MEAT", quantity: 72 },
      { itemId: "QUESTITEM_TOKEN_AVALON", quantity: 90 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T8_MEAL_SANDWICH",
    tier: 8,
    quantity: 10,
    ingredients: [
      { itemId: "T4_BREAD", quantity: 36 },
      { itemId: "T8_MEAT", quantity: 72 },
      { itemId: "T8_BUTTER", quantity: 18 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T8_MEAL_SANDWICH_FISH",
    tier: 8,
    quantity: 1,
    ingredients: [
      { itemId: "T7_FISH_FRESHWATER_HIGHLANDS_RARE", quantity: 1 },
      { itemId: "T8_PUMPKIN", quantity: 6 },
      { itemId: "T8_YARROW", quantity: 6 },
      { itemId: "T8_BUTTER", quantity: 6 },
    ],
    nutrition: 0,
  },
  {
    recipeId: "T8_MEAL_SANDWICH_AVALON",
    tier: 8,
    quantity: 10,
    ingredients: [
      { itemId: "T4_BREAD", quantity: 36 },
      { itemId: "T8_MEAT", quantity: 72 },
      { itemId: "T8_BUTTER", quantity: 18 },
      { itemId: "QUESTITEM_TOKEN_AVALON", quantity: 90 },
    ],
    nutrition: 0,
  },
];

export function CookingRecipesPage() {
  const ingredientIds = recipes.flatMap((recipe) =>
    recipe.ingredients.map((ingredient) => ingredient.itemId)
  );
  const recipeIds = recipes.map((recipe) => recipe.recipeId);
  const {
    data: priceData,
    isLoading,
    error,
  } = useCustomPrices([...new Set([...ingredientIds, ...recipeIds])]);

  // State to track selected cities for each ingredient and recipe
  const [selections, setSelections] = useState<Record<string, string>>({});
  // State for instant sell option
  const [useInstantSell, setUseInstantSell] = useState(false);

  // Calculate minutes ago for market data
  const getMinutesAgo = (receivedAt: Date) => {
    const minutesAgo = Math.floor(
      (Date.now() - new Date(receivedAt).getTime()) / 1000 / 60
    );
    return minutesAgo >= 0 ? minutesAgo : 0;
  };

  // Initialize selections with best markets
  const initializeSelections = () => {
    const initial: Record<string, string> = {};
    recipes.forEach((recipe) => {
      // Ingredients
      recipe.ingredients.forEach((ingredient, index) => {
        const bestMarket = getBestMarket(ingredient.itemId, priceData);
        initial[`${recipe.recipeId}-ingredient-${index}`] = bestMarket
          ? bestMarket.locationName
          : "";
      });
      // Recipe sell city
      const bestMarket = getBestMarket(
        recipe.recipeId,
        priceData,
        useInstantSell
      );
      initial[`${recipe.recipeId}-sell`] = bestMarket
        ? bestMarket.locationName
        : "";
    });
    return initial;
  };

  // Set initial selections when priceData is available
  const [initialized, setInitialized] = useState(false);
  if (priceData && !initialized) {
    setSelections(initializeSelections());
    setInitialized(true);
  }

  // Handle selection change
  const handleSelectionChange = (key: string, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  // Calculate recipe cost based on selected cities
  const calculateRecipeCost = (recipe: Recipe) => {
    if (!priceData) return 0;
    return recipe.ingredients.reduce((total, ingredient, index) => {
      const selectedCity = selections[`${recipe.recipeId}-ingredient-${index}`];
      const itemData = priceData.prices.find(
        (el) => el.itemId === ingredient.itemId
      );
      if (!itemData || !itemData.markets || !selectedCity) return total;
      const market = itemData.markets.find(
        (m) => m.locationName === selectedCity
      );
      if (!market || !market.offerOrders?.length) return total;
      const minPrice = Math.min(
        ...market.offerOrders.map((order) => order.price)
      );
      return total + minPrice * ingredient.quantity;
    }, 0); // Cost for one craft
  };

  // Calculate recipe profit based on selected sell city and instant sell option
  const calculateRecipeProfit = (recipe: Recipe) => {
    if (!priceData) return 0;
    const recipeCost = calculateRecipeCost(recipe); // Cost for one craft
    const selectedCity = selections[`${recipe.recipeId}-sell`];
    const recipeData = priceData.prices.find(
      (el) => el.itemId === recipe.recipeId
    );
    if (!recipeData || !recipeData.markets || !selectedCity) return -recipeCost;
    const market = recipeData.markets.find(
      (m) => m.locationName === selectedCity
    );
    if (!market) return -recipeCost;

    let sellPrice = 0;
    if (useInstantSell) {
      // Use requestOrders for instant sell
      if (market.requestOrders?.length) {
        sellPrice = Math.max(
          ...market.requestOrders.map((order) => order.price)
        );
      }
    } else {
      // Use lowest offerOrder to undercut competition
      if (market.offerOrders?.length) {
        sellPrice = Math.min(...market.offerOrders.map((order) => order.price));
      }
    }

    // Multiply sellPrice by quantity produced per craft
    return sellPrice * recipe.quantity - recipeCost;
  };

  // Find max number of ingredients for table columns
  const maxIngredients = Math.max(
    ...recipes.map((recipe) => recipe.ingredients.length)
  );

  if (error) {
    return <div className="p-4 text-destructive">Error fetching prices</div>;
  }

  return (
    <TooltipProvider>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Cooking Recipes</h1>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useInstantSell}
              onChange={(e) => setUseInstantSell(e.target.checked)}
              className="h-4 w-4"
            />
            <span>Use Instant Sell</span>
          </label>
        </div>
        <Card className="overflow-x-auto rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipe (T)</TableHead>
                {Array.from({ length: maxIngredients }).map((_, i) => (
                  <TableHead key={i}>Ingredient {i + 1}</TableHead>
                ))}
                <TableHead>Recipe Cost</TableHead>
                <TableHead>Recipe Profit</TableHead>
                <TableHead>Sell City</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="w-24 h-6" />
                      </TableCell>
                      {Array.from({ length: maxIngredients }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="w-32 h-8" />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Skeleton className="w-16 h-6" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-16 h-6" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-32 h-8" />
                      </TableCell>
                    </TableRow>
                  ))
                : recipes.map((recipe) => (
                    <TableRow key={recipe.recipeId}>
                      <TableCell className="flex items-center gap-2">
                        <img
                          src={`https://render.albiononline.com/v1/item/${recipe.recipeId}.png`}
                          alt={recipe.recipeId}
                          className="w-8 h-8 object-contain"
                        />
                        {recipe.recipeId} (T{recipe.tier})
                      </TableCell>
                      {Array.from({ length: maxIngredients }).map((_, i) => {
                        const ingredient = recipe.ingredients[i];
                        if (!ingredient) {
                          return <TableCell key={i} />;
                        }
                        const itemData = priceData?.prices.find(
                          (el) => el.itemId === ingredient.itemId
                        );
                        const selectedCity =
                          selections[`${recipe.recipeId}-ingredient-${i}`] ||
                          "";
                        return (
                          <TableCell key={i}>
                            <div className="flex items-center gap-2">
                              <img
                                src={`https://render.albiononline.com/v1/item/${ingredient.itemId}.png`}
                                alt={ingredient.itemId}
                                className="w-6 h-6 object-contain"
                              />
                              <span>
                                {ingredient.itemId} ({ingredient.quantity})
                              </span>
                              <select
                                className="border rounded-md px-2 py-1 text-sm bg-background hover:bg-accent max-w-xs"
                                value={selectedCity}
                                onChange={(e) =>
                                  handleSelectionChange(
                                    `${recipe.recipeId}-ingredient-${i}`,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="" disabled>
                                  Select market
                                </option>
                                {itemData?.markets
                                  .filter(
                                    (market) => market.offerOrders?.length > 0
                                  )
                                  .map((market) => ({
                                    ...market,
                                    minPrice: Math.min(
                                      ...market.offerOrders.map(
                                        (order) => order.price
                                      )
                                    ),
                                    minutesAgo: getMinutesAgo(
                                      market.offerOrders[0].receivedAt
                                    ),
                                  }))
                                  .sort((a, b) => a.minPrice - b.minPrice) // Sort by lowest price
                                  .map((market) => (
                                    <option
                                      key={`${market.locationName}-${ingredient.itemId}`}
                                      value={market.locationName}
                                    >
                                      {market.minPrice} Silver,{" "}
                                      {market.locationName}, {market.minutesAgo}{" "}
                                      min ago
                                    </option>
                                  )) || (
                                  <option value="no-data">
                                    No data available
                                  </option>
                                )}
                              </select>
                            </div>
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        {calculateRecipeCost(recipe).toLocaleString()} Silver
                      </TableCell>
                      <TableCell
                        className={
                          calculateRecipeProfit(recipe) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {calculateRecipeProfit(recipe).toLocaleString()} Silver
                      </TableCell>
                      <TableCell>
                        <select
                          className="border rounded-md px-2 py-1 text-sm bg-background hover:bg-accent max-w-xs"
                          value={selections[`${recipe.recipeId}-sell`] || ""}
                          onChange={(e) =>
                            handleSelectionChange(
                              `${recipe.recipeId}-sell`,
                              e.target.value
                            )
                          }
                        >
                          <option value="" disabled>
                            Select sell city
                          </option>
                          {priceData?.prices
                            .find((el) => el.itemId === recipe.recipeId)
                            ?.markets.filter((market) =>
                              useInstantSell
                                ? market.requestOrders?.length > 0
                                : market.offerOrders?.length > 0
                            )
                            .map((market) => ({
                              ...market,
                              price: useInstantSell
                                ? Math.max(
                                    ...market.requestOrders.map(
                                      (order) => order.price
                                    )
                                  )
                                : Math.min(
                                    ...market.offerOrders.map(
                                      (order) => order.price
                                    )
                                  ),
                              minutesAgo: getMinutesAgo(
                                (useInstantSell
                                  ? market.requestOrders[0]
                                  : market.offerOrders[0]
                                ).receivedAt
                              ),
                            }))
                            .sort((a, b) => b.price - a.price) // Sort by highest price for instant, lowest for non-instant
                            .map((market) => (
                              <option
                                key={`${market.locationName}-${recipe.recipeId}`}
                                value={market.locationName}
                              >
                                {market.price} Silver, {market.locationName},{" "}
                                {market.minutesAgo} min ago
                              </option>
                            )) || (
                            <option value="no-data">No data available</option>
                          )}
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  );
}
