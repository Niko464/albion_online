import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCustomPrices } from "@/hooks/useCustomPrices";
import { getItemTiers } from "@/hooks/useItemTiers";
import { useItemTranslations } from "@/hooks/useItemTranslations";
import type { PriceComparisonRowData } from "@/utils/types";
import { allCities } from "@albion_online/common";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { usePriceComparisonColumns } from "./hooks/usePriceComparisonColumns";
import { cn } from "@/utils/utils";
import { renderItemImage } from "../CookingRecipesPage/components/renderItemImage";

export default function PriceComparisonPage() {
  const allIds = useMemo(() => {
    return [
      ...getItemTiers("HIDE"),
      ...getItemTiers("WOOD"),
      ...getItemTiers("ORE"),
      ...getItemTiers("FIBER"),
      ...getItemTiers("ROCK"),
      ...getItemTiers("LEATHER"),
      ...getItemTiers("PLANKS"),
      ...getItemTiers("METALBAR"),
      ...getItemTiers("CLOTH"),
      ...getItemTiers("STONEBLOCK"),
    ];
  }, []);
  const [selectedCities, setSelectedCities] = useState<string[]>([
    "Martlock",
    "Bridgewatch",
    "Lymhurst",
    `FortSterling`,
    "Thetford",
  ]);
  const {
    data: priceData,
    isLoading: isLoadingPriceData,
    error,
  } = useCustomPrices(allIds, selectedCities);

  const isLoading = isLoadingPriceData;

  const data: PriceComparisonRowData[] = useMemo(() => {
    if (!priceData) return [];

    return allIds.map((itemId) => {
      const priceInfo = priceData.prices.find(
        (price) => price.itemId === itemId
      );
      return {
        itemId,
        priceData: priceInfo,
      };
    });
  }, [priceData, allIds]);
  const itemTranslations = useItemTranslations(allIds);
  const columns = usePriceComparisonColumns(itemTranslations);

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!priceData || isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Price comparisons</h1>
        <Card className="p-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-6 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-destructive">Error fetching prices</div>;
  }
  return (
    <TooltipProvider>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Price comparisons</h1>
          <div className="flex flex-row gap-4">
            {allCities.map((city) => (
              <div
                key={city}
                className="flex justify-center items-center gap-1"
              >
                <Checkbox
                  checked={selectedCities.includes(city)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCities((prev) => [...prev, city]);
                    } else {
                      setSelectedCities((prev) =>
                        prev.filter((c) => c !== city)
                      );
                    }
                  }}
                />
                <span>{city}</span>
              </div>
            ))}
          </div>
        </div>
        <Card className="overflow-x-auto rounded-xl border shadow-sm">
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
                : table.getRowModel().rows.map((rowData) => {
                    const isMissingAnyPriceData = !rowData.original.priceData;
                    return (
                      <TableRow
                        key={rowData.original.itemId}
                        className={cn(isMissingAnyPriceData && "opacity-25")}
                      >
                        {(columns as ColumnDef<PriceComparisonRowData>[]).map(
                          (column) => {
                            // Safely access cell value for accessor columns
                            const isAccessorColumn =
                              "accessorKey" in column && column.accessorKey;
                            const cellValue = isAccessorColumn
                              ? column.accessorKey!.includes(".")
                                ? column
                                    .accessorKey!.split(".")
                                    .reduce(
                                      (obj, key) =>
                                        obj
                                          ? obj[key as keyof typeof obj]
                                          : undefined,
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
                                {column.id === "itemId" ? (
                                  <div className="flex items-center gap-2">
                                    {renderItemImage(
                                      rowData.original.itemId,
                                      itemTranslations[
                                        rowData.original.itemId
                                      ] || rowData.original.itemId
                                    )}
                                  </div>
                                ) : (
                                  flexRender(column.cell, {
                                    getValue: () => cellValue,
                                    row: rowData,
                                    column: { id: column.id },
                                    table: {},
                                  } as any)
                                )}
                              </TableCell>
                            );
                          }
                        )}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  );
}
