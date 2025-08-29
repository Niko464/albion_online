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
import { useRef } from "react";
import type { useRecipeColumns } from "../hooks/useRecipeColumns";
import { useVirtualizer } from "@tanstack/react-virtual";

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
  setSelectedRow: (row: RecipeRowData | null) => void;
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
  setSelectedRow,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: isLoading ? 5 : rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // keep an estimate for first render
    overscan: 10,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  return (
    <div ref={parentRef} className="max-h-[600px] overflow-auto">
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
        <TableBody
          style={{
            position: "relative",
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];

            if (isLoading) {
              return (
                <TableRow
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      style={{
                        width: column.size,
                        minWidth: column.size,
                      }}
                    >
                      <Skeleton className="w-full h-6" />
                    </TableCell>
                  ))}
                </TableRow>
              );
            }

            return (
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
                ref={rowVirtualizer.measureElement}
                data-index={virtualRow.index}
                setSelectedRow={setSelectedRow}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
