import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { GetPricesResponse } from "@albion_online/common";
import type { RecipeRowData } from "@/utils/types";
import { renderItemImage } from "../components/renderItemImage";
import { renderMarketSelect } from "../components/renderMarketSelect";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const columnHelper = createColumnHelper<RecipeRowData>();

export const useRecipeColumns = (
  itemTranslations: Record<string, string>,
  priceData: GetPricesResponse | undefined,
  selections: Record<string, string>,
  useInstantSell: boolean,
  handleSelectionChange: (itemId: string, value: string) => void
): ColumnDef<RecipeRowData, any>[] => {
  return [
    columnHelper.accessor((row: RecipeRowData) => row.recipe, {
      id: "recipe",
      header: "Recipe",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {renderItemImage(
            row.original.recipe.recipeId,
            itemTranslations[row.original.recipe.recipeId]
          )}
        </div>
      ),
      size: 110,
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
    columnHelper.accessor("withoutFocusRecipeStats.profit", {
      header: "Profit (Silver)",
      cell: ({ row }) => {
        const profit = row.original.withoutFocusRecipeStats.profit;
        return (
          <span className={profit > 0 ? "text-green-600" : "text-red-600"}>
            {profit.toLocaleString()}
          </span>
        );
      },
      size: 150,
      meta: { align: "left" },
    }),
    // columnHelper.accessor("withFocusRecipeStats.recipeCost", {
    //   header: "Recipe Cost (with focus)",
    //   cell: ({ row }) =>
    //     Math.round(
    //       row.original.withFocusRecipeStats.recipeCost
    //     ).toLocaleString() + " Silver",
    //   size: 150,
    //   meta: { align: "left" },
    // }),

    columnHelper.accessor("withFocusRecipeStats.profit", {
      header: "Profit (with focus)",
      cell: ({ row }) => {
        const profit = row.original.withFocusRecipeStats.profit;
        return (
          <span className={profit > 0 ? "text-green-600" : "text-red-600"}>
            {profit.toLocaleString()}
          </span>
        );
      },
      size: 150,
      meta: { align: "left" },
    }),
    columnHelper.accessor("silverPerFocusWithoutSpecialization", {
      header: "Base Silver/focus",
      cell: ({ row }) => {
        return (
          <span>
            {row.original.silverPerFocusWithoutSpecialization.toFixed(2)}
          </span>
        );
      },
      size: 120,
      meta: { align: "left" },
    }),
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
                Base focus cost: {row.original.recipe.focus?.toFixed(2)}
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
    columnHelper.accessor("famePerSilverInvested", {
      header: "Fame/silver (buying item)",
      cell: ({ row }) => {
        return (
          <span>
            {row.original.famePerSilverInvested.toFixed(2)} (
            {row.original.famePerSilverInvestedSellCity})
          </span>
        );
      },
      size: 150,
      meta: { align: "left" },
    }),
    columnHelper.accessor("recipe.fame", {
      header: "Fame",
      cell: ({ row }) => {
        return <span>{row.original.recipe.fame?.toLocaleString()}</span>;
      },
      size: 100,
      meta: { align: "left" },
    }),
    columnHelper.display({
      id: "sellCity",
      header: "Sell City",
      cell: ({ row }) => {
        if (!priceData) {
          return null;
        }
        return renderMarketSelect(
          row.original.recipe.recipeId,
          priceData,
          selections,
          useInstantSell,
          handleSelectionChange,
          "Select sell city",
          "w-full max-w-[200px]"
        );
      },
      size: 200,
      meta: { align: "left" },
    }),
  ];
};
