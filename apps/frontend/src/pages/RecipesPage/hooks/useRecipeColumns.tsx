import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { GetPricesResponse } from "@albion_online/common";
import type { RecipeRowData } from "@/utils/types";
import { renderItemImage } from "../components/renderItemImage";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CitySelectionsType } from "../RecipePage";
import { MarketSelect } from "../components/renderMarketSelect";
import { ChevronDown, ChevronUp, Minus, Plus, Star } from "lucide-react";
import type { useShoppingCart } from "@/features/ShoppingCart/useShoppingCart";

const columnHelper = createColumnHelper<RecipeRowData>();

export const useRecipeColumns = (
  itemTranslations: Record<string, string>,
  priceData: GetPricesResponse | undefined,
  selections: CitySelectionsType,
  useInstantSell: boolean,
  handleSelectionChange: (itemId: string, value: string) => void,
  favoriteList: string[],
  toggleFavorite: (recipeId: string) => void,
  expandedRows: Record<string, boolean>,
  toggleExpanded: (recipeId: string) => void,
  addToCart: ReturnType<typeof useShoppingCart>["addRecipeToCart"],
  removeFromCart: ReturnType<typeof useShoppingCart>["removeRecipeFromCart"]
): ColumnDef<RecipeRowData, any>[] => {
  return [
    columnHelper.accessor((row: RecipeRowData) => row.recipe, {
      id: "recipe",
      header: "Recipe",
      cell: ({ row }) => {
        const recipe = row.original.recipe;
        const isFavorite = favoriteList.includes(recipe.recipeId);
        const isExpanded = !!expandedRows[recipe.recipeId];

        return (
          <div className="flex items-center gap-2">
            {/* expand arrow */}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}

            {/* favorite star */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(recipe.recipeId);
              }}
              className="focus:outline-none"
            >
              <Star
                size={18}
                className={`cursor-pointer transition-colors ${
                  isFavorite
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }`}
              />
            </button>

            {/* image with plus/minus controls */}
            <div className="relative flex items-center">
              {renderItemImage(
                recipe.recipeId,
                itemTranslations[recipe.recipeId]
              )}

              {/* vertical plus/minus buttons */}
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
            </div>
          </div>
        );
      },
      size: 210,
      meta: { align: "left" },
    }),
    columnHelper.accessor("oldestAge", {
      header: "Oldest Data",
      cell: ({ row }) =>
        row.original.oldestAge
          ? `${row.original.oldestAge} min ago`
          : "No data",
      size: 110,
      meta: { align: "left" },
    }),
    columnHelper.accessor("withoutFocusRecipeStats.recipeCost", {
      header: "Recipe Cost",
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger>
              <span>
                {Math.round(
                  row.original.withoutFocusRecipeStats.recipeCost
                ).toLocaleString() + " Silver"}
              </span>
            </TooltipTrigger>
            <TooltipContent className="flex flex-col">
              <span>
                Nutrition:{" "}
                {Math.round(
                  row.original.withoutFocusRecipeStats.recipeCostDetails
                    .nutritionCost
                ).toLocaleString()}
              </span>
              <span>
                Not returnable ingredients:{" "}
                {Math.round(
                  row.original.withoutFocusRecipeStats.recipeCostDetails
                    .blacklistedIngredientsCost
                ).toLocaleString()}
              </span>
              <span>
                Returnable ingredients:{" "}
                {Math.round(
                  row.original.withoutFocusRecipeStats.recipeCostDetails
                    .returnableIngredientsCost
                ).toLocaleString()}
              </span>
              <span>
                Total:{" "}
                {Math.round(
                  row.original.withoutFocusRecipeStats.recipeCostDetails.total
                ).toLocaleString()}
              </span>
            </TooltipContent>
          </Tooltip>
        );
      },
      size: 120,
      meta: { align: "left" },
    }),

    columnHelper.accessor("withoutFocusRecipeStats.percentage", {
      header: "Profit %",
      cell: ({ row }) => {
        const profit = row.original.withoutFocusRecipeStats.profit;
        const value = row.original.withoutFocusRecipeStats.percentage;
        const sign = value >= 0 ? "+" : "-";
        return (
          <span className={profit > 0 ? "text-green-600" : "text-red-600"}>
            {`${sign}${Math.abs(value).toFixed(2)}%`}
          </span>
        );
      },
      size: 120,
      meta: { align: "left" },
    }),
    columnHelper.accessor("withFocusRecipeStats.percentage", {
      header: "Profit % (with focus)",
      cell: ({ row }) => {
        const profit = row.original.withFocusRecipeStats.profit;
        const value = row.original.withFocusRecipeStats.percentage;
        const sign = value >= 0 ? "+" : "-";
        return (
          <span className={profit > 0 ? "text-green-600" : "text-red-600"}>
            {`${sign}${Math.abs(value).toFixed(2)}%`}
          </span>
        );
      },
      size: 120,
      meta: { align: "left" },
    }),

    // columnHelper.accessor("withoutFocusRecipeStats.profit", {
    //   header: "Profit (Silver)",
    //   cell: ({ row }) => {
    //     const profit = row.original.withoutFocusRecipeStats.profit;
    //     return (
    //       <span className={profit > 0 ? "text-green-600" : "text-red-600"}>
    //         {profit.toLocaleString()}
    //       </span>
    //     );
    //   },
    //   size: 150,
    //   meta: { align: "left" },
    // }),

    // columnHelper.accessor("withFocusRecipeStats.recipeCost", {
    //   header: "Recipe Cost (with focus)",
    //   cell: ({ row }) =>
    //     Math.round(
    //       row.original.withFocusRecipeStats.recipeCost
    //     ).toLocaleString() + " Silver",
    //   size: 150,
    //   meta: { align: "left" },
    // }),

    // columnHelper.accessor("withFocusRecipeStats.profit", {
    //   header: "Profit (with focus)",
    //   cell: ({ row }) => {
    //     const profit = row.original.withFocusRecipeStats.profit;
    //     return (
    //       <span className={profit > 0 ? "text-green-600" : "text-red-600"}>
    //         {profit.toLocaleString()}
    //       </span>
    //     );
    //   },
    //   size: 150,
    //   meta: { align: "left" },
    // }),

    // columnHelper.accessor("silverPerFocusWithoutSpecialization", {
    //   header: "Base Silver/focus",
    //   cell: ({ row }) => {
    //     return (
    //       <span>
    //         {row.original.silverPerFocusWithoutSpecialization.toFixed(2)}
    //       </span>
    //     );
    //   },
    //   size: 120,
    //   meta: { align: "left" },
    // }),

    columnHelper.accessor("silverPerFocusWithSpecialization", {
      header: "Silver/focus (with spec)",
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger>
              <span>
                {row.original.silverPerFocusWithSpecialization.toFixed(2)}
              </span>
            </TooltipTrigger>
            <TooltipContent className="flex flex-col">
              <span>
                Base focus cost:{" "}
                {(
                  (row.original.recipe.focus || 0) *
                  row.original.recipe.quantity
                )?.toFixed(2)}
              </span>
              <span>
                Spec focus cost:{" "}
                {row.original.focusCostWithSpecialization.toFixed(2)}
              </span>
            </TooltipContent>
          </Tooltip>
        );
      },
      size: 120,
      meta: { align: "left" },
    }),
    columnHelper.accessor("otherSilverPerFoca", {
      header: "Other Silver/focus (with spec)",
      cell: ({ row }) => {
        return <span>{row.original.otherSilverPerFoca.toFixed(2)}</span>;
      },
      size: 120,
      meta: { align: "left" },
    }),
    // columnHelper.accessor("famePerSilverInvested", {
    //   header: "Fame/silver (buying item)",
    //   cell: ({ row }) => {
    //     return (
    //       <span>
    //         {row.original.famePerSilverInvested.toFixed(2)} (
    //         {row.original.famePerSilverInvestedSellCity})
    //       </span>
    //     );
    //   },
    //   size: 150,
    //   meta: { align: "left" },
    // }),

    // columnHelper.accessor("recipe.fame", {
    //   header: "Fame",
    //   cell: ({ row }) => {
    //     return <span>{row.original.recipe.fame?.toLocaleString()}</span>;
    //   },
    //   size: 100,
    //   meta: { align: "left" },
    // }),

    columnHelper.display({
      id: "sellCity",
      header: "Sell City",
      cell: ({ row }) => {
        if (!priceData) {
          return null;
        }
        return (
          <MarketSelect
            itemId={row.original.recipe.recipeId}
            priceData={priceData}
            selections={selections}
            useInstantSell={useInstantSell}
            handleSelectionChange={handleSelectionChange}
            placeholder="Select sell city"
            widthClass="w-full max-w-[200px]"
          />
        );
      },
      size: 200,
      meta: { align: "left" },
    }),
    columnHelper.accessor("sellCityMarketStats.avgAmount", {
      header: "Avg sold Sell City",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <span>
              Amt:{" "}
              {Math.round(row.original.sellCityMarketStats?.avgAmount || 0)}
            </span>
            <span>
              Price:{" "}
              {Math.round(row.original.sellCityMarketStats?.avgPrice || 0)}
            </span>
            {/* <span>Std dev: {Math.round(row.original.sellCityMarketStats?.stdDev || 0)}</span> */}
          </div>
        );
      },
      size: 200,
      meta: { align: "left" },
    }),
  ];
};
