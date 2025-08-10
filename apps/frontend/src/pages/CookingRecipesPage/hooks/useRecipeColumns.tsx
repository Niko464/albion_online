import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { GetPricesResponse } from "@albion_online/common";
import type { RecipeRowData } from "@/utils/types";
import { renderItemImage } from "../components/renderItemImage";
import { renderMarketSelect } from "../components/renderMarketSelect";

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
      size: 200,
      meta: { align: "left" },
    }),
    columnHelper.accessor("oldestAge", {
      header: "Oldest Data",
      cell: ({ row }) =>
        row.original.oldestAge
          ? `${row.original.oldestAge} min ago`
          : "No data",
      size: 120,
      meta: { align: "center" },
    }),
    columnHelper.accessor("withoutFocusRecipeStats.recipeCost", {
      header: "Recipe Cost",
      cell: ({ row }) =>
        row.original.withoutFocusRecipeStats.recipeCost.toLocaleString() +
        " Silver",
      size: 150,
      meta: { align: "right" },
    }),
    columnHelper.accessor("famePerSilverInvested", {
      header: "Fame per silver invested",
      cell: ({ row }) => {
        return (
          <span>
            {row.original.famePerSilverInvested.toFixed(2)} ({row.original.famePerSilverInvestedSellCity})
          </span>
        );
      },
      size: 150,
      meta: { align: "right" },
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
      meta: { align: "right" },
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
      meta: { align: "right" },
    }),
    columnHelper.accessor("withFocusRecipeStats.recipeCost", {
      header: "Recipe Cost (with focus)",
      cell: ({ row }) =>
        row.original.withFocusRecipeStats.recipeCost.toLocaleString() +
        " Silver",
      size: 150,
      meta: { align: "right" },
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
      meta: { align: "right" },
    }),
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
      meta: { align: "right" },
    }),
    columnHelper.accessor("silverPerFocus", {
      header: "Silver per Focus",
      cell: ({ row }) => row.original.silverPerFocus.toLocaleString(),
      size: 120,
      meta: { align: "right" },
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
