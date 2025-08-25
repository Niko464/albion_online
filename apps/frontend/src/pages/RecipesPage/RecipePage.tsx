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
import {
  allCities,
  type PlayerSpecializationStats,
} from "@albion_online/common";
import recipesJSON from "../../utils/recipes.json";

import { Checkbox } from "@/components/ui/checkbox";

import { MarketPricesSheet } from "./components/MarketPricesSheet";
import { RecipeRow } from "./components/RecipeRow";
import {
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

// -------------------- Utility functions (memoized calculations) --------------------
import { useRecipeColumns } from "./hooks/useRecipeColumns";
import type { RecipeRowData } from "@/utils/types";
import { calculateRecipeProfit } from "./utils/calculateRecipeProfit";
import { getOldestComponentAge } from "./utils/getOldestComponentAge";
import { getEffectiveFocusCost } from "./utils/calculateEffectiveFocusCost";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuantitySoldHistory } from "@/hooks/useQuantitySoldHistory";
import { useItemTranslations } from "@/hooks/useItemTranslations";
import { useParams } from "react-router-dom";

const playerSpec: PlayerSpecializationStats = {
  mastery: 100,
  // specializations: {
  //   Soup: 29,
  //   Salad: 13,
  //   Pie: 54,
  //   Roast: 19,
  //   Omelette: 2,
  //   Stew: 64,
  //   Sandwich: 29,
  //   Ingredient: 8,
  //   Butcher: 51,
  // },
  // specializations: {
  //   Soup: 50,
  //   Salad: 50,
  //   Pie: 50,
  //   Roast: 50,
  //   Omelette: 50,
  //   Stew: 50,
  //   Sandwich: 50,
  //   Ingredient: 50,
  //   Butcher: 50,
  // },
  specializations: {
    Soup: 100,
    Salad: 100,
    Pie: 100,
    Roast: 100,
    Omelette: 100,
    Stew: 100,
    Sandwich: 100,
    Ingredient: 100,
    Butcher: 100,
  },
};

export type CitySelectionsType = Record<string, string | null>;

// TODO: solve the bug where for some reason some lines that have opacity at 100
// which means that they have no missing prices, don't render a marketSelect (which should only happen if no selection is set)
// which should only happen if no price is found

// TODO: make the specialization customizable

// TODO: the specialization bonuses should be configurable according to the crafting branch
// -------------------- Main Component --------------------
export function RecipeRecipesPage() {
  const { craftingCategory } = useParams();

  if (!craftingCategory) {
    throw new Error("No crafting category provided in URL");
  }

  const allRecipes = useMemo(() => {
    return recipesJSON.filter((el) => el.craftingCategory === craftingCategory);
  }, [craftingCategory]);

  const branchNames = useMemo(() => {
    return allRecipes.reduce((acc, curr) => {
      const branchName = curr.specializationBranchName;
      if (branchName && !acc.includes(branchName)) {
        acc.push(branchName);
      }
      return acc;
    }, [] as string[])
  }, [allRecipes]);

  console.log('DEBUG haha', branchNames);

  const ingredientIds = useMemo(() => {
    return [
      ...new Set(
        allRecipes.flatMap((recipe) =>
          recipe.ingredients.map((ingredient) => ingredient.itemId)
        )
      ),
    ];
  }, [allRecipes]);

  const recipeIds = useMemo(() => {
    return allRecipes.map((recipe) => recipe.recipeId);
  }, [allRecipes]);

  const allIds = useMemo(() => {
    return [...new Set([...ingredientIds, ...recipeIds])];
  }, [ingredientIds, recipeIds]);

  const [selectedCities, setSelectedCities] = useState<string[]>([
    // "Martlock",
    // "Bridgewatch",
    "Lymhurst",
    // `FortSterling`,
    // "Thetford",
  ]);
  const {
    data: priceData,
    isLoading: isLoadingPriceData,
    error,
  } = useCustomPrices(allIds, selectedCities);
  const itemTranslations = useItemTranslations(allIds);
  const { data: soldHistoryData, isLoading: isLoadingSoldHistory } =
    useQuantitySoldHistory(recipeIds, selectedCities);

  const isLoading = isLoadingPriceData || isLoadingSoldHistory;

  const [selections, setSelections] = useState<CitySelectionsType>({});
  const [useInstantSell, setUseInstantSell] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [branchFilter, setBranchFilter] = useState<string>("All");
  const [missingPriceDataItemIds, setMissingPriceDataItemIds] = useState<
    string[] | null
  >(null);

  const initializeSelections = useCallback(() => {
    const missingPriceDataItemIds: string[] = [];
    const initial: CitySelectionsType = {};
    [...new Set(ingredientIds)].forEach((itemId) => {
      const bestMarket = getBestMarket(itemId, priceData, false);
      if (!bestMarket) {
        missingPriceDataItemIds.push(itemId);
      }
      initial[itemId] = bestMarket ? bestMarket.locationName : null;
    });
    [...new Set(recipeIds)].forEach((itemId) => {
      const bestMarket = getBestMarket(itemId, priceData, true);
      if (!bestMarket) {
        missingPriceDataItemIds.push(itemId);
      }
      initial[itemId] = bestMarket ? bestMarket.locationName : null;
    });
    setMissingPriceDataItemIds(missingPriceDataItemIds);
    return initial;
  }, [priceData, ingredientIds, recipeIds]);

  useEffect(() => {
    if (priceData && !missingPriceDataItemIds) {
      setSelections(initializeSelections());
    }
  }, [priceData, missingPriceDataItemIds, initializeSelections]);

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
    if (!priceData || !soldHistoryData || !missingPriceDataItemIds) return [];
    return allRecipes.map((recipe) => {
      const withoutFocusRecipeStats = calculateRecipeProfit(
        recipe,
        priceData,
        selections,
        useInstantSell,
        // TODO: not make this hardcoded
        1000,
        false
      );
      const withFocusRecipeStats = calculateRecipeProfit(
        recipe,
        priceData,
        selections,
        useInstantSell,
        // TODO: not make this hardcoded
        1000,
        true
      );
      const oldestAge = getOldestComponentAge(
        recipe,
        priceData,
        selections,
        useInstantSell
      );
      const effectiveFocusWithoutSpecialization = getEffectiveFocusCost(
        recipe,
        null
      );
      const effectiveFocusWithSpecialization = getEffectiveFocusCost(
        recipe,
        playerSpec
      );

      // NOTE: the place where I can buy the recipe the cheapest at
      const cheapestMarketPrice = getBestMarket(
        recipe.recipeId,
        priceData,
        false
      );

      // if (!cheapestMarketPrice) {
      //   throw new Error(
      //     `No market data found for recipe ${recipe.recipeId} (cheapestMarketPrice)`
      //   );
      // }
      const famePerSilverInvestedSellCity =
        cheapestMarketPrice?.locationName || "Non existing";

      // TODO: I am trying to maximize fame, I need to make a list
      const famePerSilverInvested = recipe.fame
        ? (recipe.fame * 2.75) /
          ((cheapestMarketPrice?.offerOrders[0].price || 1) * recipe.quantity)
        : 0;

      const selectedCity = selections[recipe.recipeId];
      const selectedCityMarketStats = soldHistoryData.histories
        .find((el) => el.itemId === recipe.recipeId)
        ?.markets.find((el) => el.location === selectedCity);

      // if (!selectedCityMarketStats) {
      //   throw new Error("No market stats for selected sell city");
      // }

      return {
        recipe,
        sellCityMarketStats: selectedCityMarketStats,
        withFocusRecipeStats,
        withoutFocusRecipeStats,
        oldestAge,
        silverPerFocusWithoutSpecialization:
          (withFocusRecipeStats.profit - withoutFocusRecipeStats.profit) /
          effectiveFocusWithoutSpecialization,
        silverPerFocusWithSpecialization:
          (withFocusRecipeStats.profit - withoutFocusRecipeStats.profit) /
          effectiveFocusWithSpecialization,
        focusCostWithSpecialization: effectiveFocusWithSpecialization,
        famePerSilverInvested,
        famePerSilverInvestedSellCity,
        otherSilverPerFoca:
          withFocusRecipeStats.profit / effectiveFocusWithSpecialization,
      } satisfies RecipeRowData;
    });
  }, [
    priceData,
    soldHistoryData,
    missingPriceDataItemIds,
    selections,
    useInstantSell,
    allRecipes,
  ]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const passesBranchCheck =
        branchFilter === "All" ||
        row.recipe.specializationBranchName === branchFilter;
      return passesBranchCheck;
      // && row.recipe.ingredients.find((el) => el.itemId === "T3_MEAT")
    });
  }, [data, branchFilter]);

  const columns = useRecipeColumns(
    itemTranslations,
    priceData,
    soldHistoryData,
    selections,
    useInstantSell,
    handleSelectionChange
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!priceData || isLoading || !missingPriceDataItemIds) {
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
          {/* <Label className="flex items-center gap-2">
            <Checkbox
              checked={useInstantSell}
              onCheckedChange={(checked) => setUseInstantSell(!!checked)}
            />
            <span>Use Instant Sell</span>
          </Label> */}

          <MarketPricesSheet
            handleSelectionChange={handleSelectionChange}
            selections={selections}
            ingredientIds={ingredientIds}
            priceData={priceData}
            useInstantSell={useInstantSell}
            recipeIds={recipeIds}
          />
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
          <Select
            value={branchFilter ?? undefined}
            onValueChange={(value) => setBranchFilter(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Branches</SelectItem>
              {branchNames.map((branchName) => (
                <SelectItem key={branchName} value={branchName}>
                  {branchName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                        missingPriceDataItemIds={missingPriceDataItemIds}
                      />
                    ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  );
}
