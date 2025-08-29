import { TableCell, TableRow } from "@/components/ui/table";
import { memo, forwardRef } from "react";
import { type GetPricesResponse, type Recipe } from "@albion_online/common";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { flexRender } from "@tanstack/react-table";
import type { RecipeRowData } from "@/utils/types";
import { renderItemImage } from "./renderItemImage";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/utils/utils";
import type { CitySelectionsType } from "../RecipePage";
import { MarketSelect } from "./renderMarketSelect";

interface RecipeRowProps {
  recipe: Recipe;
  priceData: GetPricesResponse;
  selections: CitySelectionsType;
  handleSelectionChange: (itemId: string, value: string) => void;
  itemTranslations: Record<string, string>;
  rowData: RecipeRowData;
  columns: ColumnDef<RecipeRowData>[];
  missingPriceDataItemIds: string[];
  isExpanded: boolean;
  toggleExpandedRow: (recipeId: string) => void;
  // extra props for virtualization
  style?: React.CSSProperties;
  "data-index"?: number;
  setSelectedRow: (row: RecipeRowData | null) => void;
}
export const RecipeRow = memo(
  forwardRef<HTMLDivElement, RecipeRowProps>(
    (
      {
        recipe,
        priceData,
        selections,
        handleSelectionChange,
        rowData,
        itemTranslations,
        columns,
        missingPriceDataItemIds,
        isExpanded,
        toggleExpandedRow,
        style,
        setSelectedRow,
        ...rest
      },
      ref
    ) => {
      const itemIds = [
        ...recipe.recipeId,
        ...recipe.ingredients.flatMap((ing) => ing.itemId),
      ];
      const isMissingAnyPriceData = itemIds.some((id) =>
        missingPriceDataItemIds.includes(id)
      );

      return (
        <div
          ref={ref} // 👈 ref here instead of <TableRow>
          style={style} // 👈 style also here
          {...rest}
        >
          <Collapsible
            key={recipe.recipeId}
            open={isExpanded}
            onOpenChange={() => toggleExpandedRow(recipe.recipeId)}
          >
            <TableRow
              className={cn(isMissingAnyPriceData && "opacity-25")}
              onClick={() => setSelectedRow(rowData)}
            >
              {columns.map((column) => {
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
                    key={column.id || Math.random().toString()}
                    style={{
                      width: column.size,
                      minWidth: column.size,
                    }}
                  >
                    {column.id === "recipe" ? (
                      <CollapsibleTrigger className="flex items-center gap-2">
                        {flexRender(column.cell, {
                          getValue: () => cellValue,
                          row: { original: rowData },
                          column: { id: column.id },
                          table: {},
                        } as any)}
                      </CollapsibleTrigger>
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
                {recipe.ingredients?.map((ingredient, i) => (
                  <div
                    key={`${ingredient.itemId}-${i}`}
                    className="flex items-center gap-2"
                  >
                    <span>{ingredient.quantity || 0}x</span>
                    <div className="min-w-16 relative group">
                      {renderItemImage(
                        ingredient.itemId,
                        itemTranslations[ingredient.itemId] || ingredient.itemId
                      )}
                    </div>
                    <MarketSelect
                      itemId={ingredient.itemId}
                      priceData={priceData}
                      selections={selections}
                      useInstantSell={false}
                      handleSelectionChange={handleSelectionChange}
                      placeholder="Select market"
                      widthClass="w-40"
                    />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }
  )
);
