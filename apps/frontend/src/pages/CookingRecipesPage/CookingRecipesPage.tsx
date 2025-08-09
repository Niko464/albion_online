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
import { useState, useEffect, useCallback, useMemo } from "react";
import { getBestMarket } from "./getBestMarket";
import { allCookingRecipes } from "@albion_online/common";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { MarketPricesSheet } from "./components/MarketPricesSheet";
import { RecipeRow } from "./components/RecipeRow";
import {
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import itemTranslationsJSON from "./parsed_items.json";

// -------------------- Utility functions (memoized calculations) --------------------
import { useRecipeColumns } from "./hooks/useRecipeColumns";
import type { RecipeRowData } from "@/utils/types";
import { calculateRecipeProfit } from "./utils/calculateRecipeProfit";
import { getOldestComponentAge } from "./utils/getOldestComponentAge";
import { getEffectiveFocusCost } from "./utils/calculateEffectiveFocusCost";

// -------------------- Main Component --------------------
export function CookingRecipesPage() {
  const ingredientIds = useMemo(() => {
    return [
      ...new Set(
        allCookingRecipes.flatMap((recipe) =>
          recipe.ingredients.map((ingredient) => ingredient.itemId)
        )
      ),
    ];
  }, []);

  const recipeIds = useMemo(() => {
    return allCookingRecipes.map((recipe) => recipe.recipeId);
  }, []);

  const allIds = useMemo(() => {
    return [...new Set([...ingredientIds, ...recipeIds])];
  }, [ingredientIds, recipeIds]);

  const itemTranslations = useMemo(() => {
    return allIds.reduce((acc, id) => {
      const foundItem = itemTranslationsJSON.find(
        (item) => item.UniqueName === id
      );
      if (foundItem) {
        acc[id] = foundItem.LocalizedName;
      } else {
        acc[id] = id;
      }
      return acc;
    }, {} as Record<string, string>);
  }, [allIds]);

  const { data: priceData, isLoading, error } = useCustomPrices(allIds);

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [useInstantSell, setUseInstantSell] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [initialized, setInitialized] = useState(false);

  const initializeSelections = useCallback(() => {
    const initial: Record<string, string> = {};
    [...new Set(ingredientIds)].forEach((itemId) => {
      const bestMarket = getBestMarket(itemId, priceData, false);
      if (!bestMarket) {
        throw new Error(`No market data found for ingredient ${itemId}`);
      }
      initial[itemId] = bestMarket ? bestMarket.locationName : "";
    });
    [...new Set(recipeIds)].forEach((itemId) => {
      const bestMarket = getBestMarket(itemId, priceData, true);
      if (!bestMarket) {
        throw new Error(`No market data found for recipe ${itemId}`);
      }
      initial[itemId] = bestMarket ? bestMarket.locationName : "";
    });
    console.log("Initialized selections:", initial);
    return initial;
  }, [priceData, ingredientIds, recipeIds]);

  useEffect(() => {
    if (priceData && !initialized) {
      setSelections(initializeSelections());
      setInitialized(true);
    }
  }, [priceData, initialized, initializeSelections]);

  const handleSelectionChange = useCallback((itemId: string, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  }, []);

  const toggleRow = useCallback((recipeId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  }, []);

  const data: RecipeRowData[] = useMemo(() => {
    if (!priceData) return [];
    return allCookingRecipes.map((recipe) => {
      const withoutFocusRecipeStats = calculateRecipeProfit(
        recipe,
        priceData,
        selections,
        useInstantSell,
        // TODO: not make this hardcoded
        900,
        false
      );
      const withFocusRecipeStats = calculateRecipeProfit(
        recipe,
        priceData,
        selections,
        useInstantSell,
        // TODO: not make this hardcoded
        900,
        true
      );
      const oldestAge = getOldestComponentAge(
        recipe,
        priceData,
        selections,
        useInstantSell
      );
      const effectiveFocus = getEffectiveFocusCost(recipe);

      return {
        recipe,
        withFocusRecipeStats,
        withoutFocusRecipeStats,
        oldestAge,
        silverPerFocus:
          (withFocusRecipeStats.profit - withoutFocusRecipeStats.profit) /
          effectiveFocus,
      };
    });
  }, [priceData, selections, useInstantSell]);

  const columns = useRecipeColumns(
    itemTranslations,
    priceData,
    selections,
    useInstantSell,
    handleSelectionChange
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!priceData || isLoading || !initialized) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Cooking Recipes</h1>
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
          <h1 className="text-3xl font-bold">Cooking Recipes</h1>
          <Label className="flex items-center gap-2">
            <Checkbox
              checked={useInstantSell}
              onCheckedChange={(checked) => setUseInstantSell(!!checked)}
            />
            <span>Use Instant Sell</span>
          </Label>
          <MarketPricesSheet
            handleSelectionChange={handleSelectionChange}
            selections={selections}
            ingredientIds={ingredientIds}
            priceData={priceData}
            useInstantSell={useInstantSell}
            recipeIds={recipeIds}
          />
        </div>
        <Card className="overflow-x-auto rounded-xl border shadow-sm">
          <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`cursor-pointer select-none ${
                        header.column.columnDef.meta?.align || "left"
                      }`}
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
                          className={column.meta?.align || "left"}
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
                        expanded={!!expandedRows[row.original.recipe.recipeId]}
                        toggleRow={toggleRow}
                        handleSelectionChange={handleSelectionChange}
                        rowData={row.original}
                        itemTranslations={itemTranslations}
                        columns={columns}
                      />
                    ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  );
}
