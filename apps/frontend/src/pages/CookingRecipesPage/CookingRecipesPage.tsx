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
import type { Recipe } from "@albion_online/common";
import {
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

// -------------------- Utility functions (memoized calculations) --------------------
import { type GetPricesResponse } from "@albion_online/common";
import { getMinutesAgo } from "@/utils/getMinutesAgo";

interface MarketData {
  locationName: string;
  price: number;
  minutesAgo: number;
}

const getMarketData = (
  itemId: string,
  priceData: GetPricesResponse,
  useInstantSell: boolean,
  selectedCity: string
): MarketData | null => {
  const itemData = priceData?.prices.find((el) => el.itemId === itemId);
  const market = itemData?.markets.find((m) => m.locationName === selectedCity);
  if (!market || (!market.offerOrders?.length && !market.requestOrders?.length)) {
    return null;
  }

  const orders = useInstantSell ? market.requestOrders : market.offerOrders;
  if (!orders || orders.length === 0) return null;

  const price = orders[0].price;
  const minutesAgo = getMinutesAgo(orders[0].receivedAt);

  return { locationName: selectedCity, price, minutesAgo };
};

const calculateRecipeCost = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: Record<string, string>
): number => {
  return recipe.ingredients.reduce((total, ingredient) => {
    const marketData = getMarketData(
      ingredient.itemId,
      priceData,
      false,
      selections[ingredient.itemId] || ""
    );
    if (!marketData) return total;
    return total + marketData.price * ingredient.quantity;
  }, 0);
};

const calculateRecipeProfit = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: Record<string, string>,
  useInstantSell: boolean
): { profit: number; percentage: number; recipeCost: number } => {
  const recipeCost = calculateRecipeCost(recipe, priceData, selections);
  const marketData = getMarketData(
    recipe.recipeId,
    priceData,
    useInstantSell,
    selections[recipe.recipeId] || ""
  );
  if (!marketData) {
    return { profit: -recipeCost, percentage: -100, recipeCost };
  }
  const sellPrice = marketData.price;
  const profit = sellPrice * recipe.quantity - recipeCost;
  const percentage = recipeCost > 0 ? (profit / recipeCost) * 100 : 0;
  return { profit, percentage, recipeCost };
};

const getOldestComponentAge = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: Record<string, string>,
  useInstantSell: boolean
): number => {
  const ages: number[] = [];
  const recipeMarket = getMarketData(
    recipe.recipeId,
    priceData,
    useInstantSell,
    selections[recipe.recipeId] || ""
  );
  if (recipeMarket) ages.push(recipeMarket.minutesAgo);
  recipe.ingredients.forEach((ingredient) => {
    const marketData = getMarketData(
      ingredient.itemId,
      priceData,
      false,
      selections[ingredient.itemId] || ""
    );
    if (marketData) ages.push(marketData.minutesAgo);
  });
  return ages.length ? Math.max(...ages) : 0;
};

// -------------------- Main Component --------------------
export function CookingRecipesPage() {
  const ingredientIds = useMemo(() => {
    return allCookingRecipes.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.itemId)
    );
  }, []);
  const recipeIds = useMemo(() => {
    return allCookingRecipes.map((recipe) => recipe.recipeId);
  }, []);

  const {
    data: priceData,
    isLoading,
    error,
  } = useCustomPrices([...new Set([...ingredientIds, ...recipeIds])]);

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

  // ---------------- TanStack Table Setup ----------------
  type RowData = {
    recipe: Recipe;
    recipeCost: number;
    profit: number;
    profitPercentage: number;
    oldestAge: number;
  };

  const data: RowData[] = useMemo(() => {
    if (!priceData) return [];
    return allCookingRecipes.map((recipe) => {
      const { profit, percentage, recipeCost } = calculateRecipeProfit(
        recipe,
        priceData,
        selections,
        useInstantSell
      );
      const oldestAge = getOldestComponentAge(
        recipe,
        priceData,
        selections,
        useInstantSell
      );
      return {
        recipe,
        recipeCost,
        profit,
        profitPercentage: percentage,
        oldestAge,
      };
    });
  }, [priceData, selections, useInstantSell]);

  const columns = useMemo<ColumnDef<RowData>[]>(
    () => [
      {
        accessorKey: "recipe",
        header: "Recipe",
        sortingFn: "alphanumeric",
      },
      {
        accessorKey: "recipeCost",
        header: "Recipe Cost",
        cell: (info) => (info.getValue<number>() as number).toLocaleString(),
      },
      {
        accessorKey: "profitPercentage",
        header: "Profit %",
        cell: (info) => {
          const value = info.getValue<number>() as number;
          const sign = value >= 0 ? "+" : "-";
          return `${sign}${Math.abs(value).toFixed(2)}%`;
        },
      },
      {
        accessorKey: "profit",
        header: "Profit (Silver)",
        cell: (info) => (info.getValue<number>() as number).toLocaleString(),
      },
    ],
    []
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
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer select-none"
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
                  <TableHead>Sell City</TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="w-[200px]">
                        <Skeleton className="w-24 h-6" />
                      </TableCell>
                      <TableCell className="w-[150px]">
                        <Skeleton className="w-16 h-6" />
                      </TableCell>
                      <TableCell className="w-[150px]">
                        <Skeleton className="w-16 h-6" />
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <Skeleton className="w-32 h-8" />
                      </TableCell>
                    </TableRow>
                  ))
                : table.getRowModel().rows.map(({ original: row }) => (
                    <RecipeRow
                      key={row.recipe.recipeId}
                      recipe={row.recipe}
                      priceData={priceData}
                      selections={selections}
                      useInstantSell={useInstantSell}
                      expanded={!!expandedRows[row.recipe.recipeId]}
                      toggleRow={toggleRow}
                      handleSelectionChange={handleSelectionChange}
                      recipeCost={row.recipeCost}
                      profit={row.profit}
                      percentage={row.profitPercentage}
                      oldestAge={row.oldestAge}
                    />
                  ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  );
}
