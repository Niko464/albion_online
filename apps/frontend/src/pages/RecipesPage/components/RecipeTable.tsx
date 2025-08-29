import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, type Table as ReactTable } from "@tanstack/react-table";
import { RecipeRow } from "./RecipeRow";
import type { RecipeRowData } from "@/utils/types";
import { Skeleton } from "@/components/ui/skeleton";
import type { GetPricesResponse } from "@albion_online/common";
import type { CitySelectionsType } from "../RecipePage";
import { useCallback, useState } from "react";
import type { useRecipeColumns } from "../hooks/useRecipeColumns";

type Props = {
  table: ReactTable<RecipeRowData>;
  isLoading: boolean;
  priceData: GetPricesResponse;
  selections: CitySelectionsType;
  handleSelectionChange: (itemId: string, value: string) => void;
  itemTranslations: Record<string, string>;
  columns: ReturnType<typeof useRecipeColumns>;
  missingPriceDataItemIds: string[];
  expandedRows: Record<string, boolean>;
  toggleExpandedRow: (recipeId: string) => void;
};

export function RecipeTable({
  table,
  isLoading,
  priceData,
  selections,
  handleSelectionChange,
  itemTranslations,
  columns,
  missingPriceDataItemIds,
  expandedRows,
  toggleExpandedRow,
}: Props) {
  return (
    <Table className="w-full table-fixed">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="flex items-center">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className={`cursor-pointer select-none overflow-hidden`}
                style={{
                  width: header.column.getSize(),
                  minWidth: header.column.getSize(),
                }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {header.column.getIsSorted() === "asc"
                  ? " ↑"
                  : header.column.getIsSorted() === "desc"
                  ? " ↓"
                  : ""}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    style={{ width: column.size, minWidth: column.size }}
                  >
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : table
              .getRowModel()
              .rows.map((row) => (
                <RecipeRow
                  key={row.original.recipe.recipeId}
                  recipe={row.original.recipe}
                  priceData={priceData}
                  selections={selections}
                  isExpanded={!!expandedRows[row.original.recipe.recipeId]}
                  toggleExpandedRow={toggleExpandedRow}
                  handleSelectionChange={handleSelectionChange}
                  rowData={row.original}
                  itemTranslations={itemTranslations}
                  columns={columns}
                  missingPriceDataItemIds={missingPriceDataItemIds}
                />
              ))}
      </TableBody>
    </Table>
  );
}
