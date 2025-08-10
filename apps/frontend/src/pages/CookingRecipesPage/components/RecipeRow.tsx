import { TableCell, TableRow } from "@/components/ui/table";
import { memo } from "react";
import { type GetPricesResponse, type Recipe } from "@albion_online/common";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { renderMarketSelect } from "./renderMarketSelect";
import { flexRender } from "@tanstack/react-table";
import type { RecipeRowData } from "@/utils/types";
import { renderItemImage } from "./renderItemImage";
import type { ColumnDef } from "@tanstack/react-table";

interface RecipeRowProps {
  recipe: Recipe;
  priceData: GetPricesResponse;
  selections: Record<string, string>;
  expanded: boolean;
  toggleRow: (recipeId: string) => void;
  handleSelectionChange: (itemId: string, value: string) => void;
  itemTranslations: Record<string, string>;
  rowData: RecipeRowData;
  columns: ColumnDef<RecipeRowData>[];
}

export const RecipeRow = memo(
  ({
    recipe,
    priceData,
    selections,
    expanded,
    toggleRow,
    handleSelectionChange,
    rowData,
    itemTranslations,
    columns,
  }: RecipeRowProps) => {
    return (
      <Collapsible
        key={recipe.recipeId}
        open={expanded}
        onOpenChange={() => {
          try {
            toggleRow(recipe.recipeId);
          } catch (error) {
            console.error("Error toggling row:", error);
          }
        }}
      >
        <TableRow>
          {columns.map((column) => {
            // Safely access cell value for accessor columns
            const isAccessorColumn =
              "accessorKey" in column && column.accessorKey;
            const cellValue = isAccessorColumn
              ? column.accessorKey!.includes(".")
                ? column
                    .accessorKey!.split(".")
                    .reduce(
                      (obj, key) =>
                        obj ? obj[key as keyof typeof obj] : undefined,
                      rowData as any
                    )
                : (rowData as any)[column.accessorKey!]
              : undefined;

            return (
              <TableCell
                key={column.id || Math.random().toString()} // Use column.id or fallback
                style={{
                  width: column.size,
                  minWidth: column.size,
                }}
              >
                {column.id === "recipe" ? (
                  <div className="flex items-center gap-2">
                    <CollapsibleTrigger className="flex items-center gap-2">
                      {expanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      {renderItemImage(
                        recipe.recipeId,
                        itemTranslations[recipe.recipeId] || recipe.recipeId
                      )}
                    </CollapsibleTrigger>
                  </div>
                ) : (
                  flexRender(column.cell, {
                    getValue: () => cellValue,
                    row: { original: rowData },
                    column: { id: column.id },
                    table: {},
                  } as any)
                )}
              </TableCell>
            );
          })}
        </TableRow>
        <CollapsibleContent>
          <div className="flex flex-wrap gap-4 p-4">
            {recipe.ingredients && Array.isArray(recipe.ingredients) ? (
              recipe.ingredients.map((ingredient, i) => {
                try {
                  return (
                    <div
                      key={`${ingredient.itemId}-${i}`}
                      className="flex items-center gap-2"
                    >
                      <span>{ingredient.quantity || 0}x</span>
                      <div className="min-w-16 relative group">
                        {renderItemImage(
                          ingredient.itemId,
                          itemTranslations[ingredient.itemId] ||
                            ingredient.itemId
                        )}
                      </div>
                      {renderMarketSelect(
                        ingredient.itemId,
                        priceData,
                        selections,
                        false,
                        handleSelectionChange,
                        "Select market",
                        "w-40"
                      )}
                    </div>
                  );
                } catch (error) {
                  console.error(
                    `Error rendering ingredient ${ingredient.itemId}:`,
                    error
                  );
                  return (
                    <div
                      key={`${ingredient.itemId}-${i}`}
                      className="text-red-600"
                    >
                      Error loading ingredient
                    </div>
                  );
                }
              })
            ) : (
              <div className="text-red-600">No ingredients available</div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
);
