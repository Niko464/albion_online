import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomPrices } from "@/hooks/useCustomPrices";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getBestMarket } from "./getBestMarket";
import { allCities } from "@albion_online/common";

import { Checkbox } from "@/components/ui/checkbox";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import { useRecipeColumns } from "./hooks/useRecipeColumns";
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
import debounce from "lodash.debounce";
import { useRecipeData } from "./hooks/useRecipeData";
import { usePlayerSpecHelper } from "./hooks/usePlayerSpecHelper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RecipeTable } from "./components/RecipeTable";
import { useFavoriteRecipes } from "./hooks/useFavoriteRecipes";
import { ShoppingCartWindow } from "@/features/ShoppingCart/ShoppingCartWindow/ShoppingCartWindow";
import { useShoppingCart } from "@/features/ShoppingCart/useShoppingCart";
import { useRecipes } from "./hooks/useRecipes";
import { cn } from "@/utils/utils";

export type CitySelectionsType = Record<string, string | null>;

// TODO: solve the bug where for some reason some lines that have opacity at 100
// which means that they have no missing prices, don't render a marketSelect (which should only happen if no selection is set)
// which should only happen if no price is found

// TODO: add favorite recipes

// TODO: add calculated for how many I want to craft of something

// TODO: have an export watch list button

// -------------------- Main Component --------------------
export function RecipeRecipesPage() {
  const { craftingCategory } = useParams();

  if (!craftingCategory) {
    throw new Error("No crafting category provided in URL");
  }

  const {
    cartItems,
    requiredMaterials,
    resetCart,
    addRecipeToCart,
    removeRecipeFromCart,
  } = useShoppingCart(craftingCategory);

  const { allRecipes, branchNames, ingredientIds, recipeIds, allIds } =
    useRecipes(craftingCategory);

  const [simulateMaxSpec, setSimulateMaxSpec] = useState<boolean>(false);
  const { playerSpec, updateSpecialization, setMaxSpec } = usePlayerSpecHelper(
    craftingCategory,
    branchNames
  );

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleExpandedRow = useCallback((recipeId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  }, []);

  const [uiSelectedCities, setUiSelectedCities] = useState<string[]>([
    // "Martlock",
    // "Bridgewatch",
    "Lymhurst",
    // `FortSterling`,
    // "Thetford",
  ]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const {
    data: priceData,
    isLoading: isLoadingPriceData,
    fetchStatus: priceDataFetchStatus,
    error,
    refetch: refetchPrices,
  } = useCustomPrices(allIds, selectedCities);
  const itemTranslations = useItemTranslations(allIds);
  const { data: soldHistoryData, isLoading: isLoadingSoldHistory } =
    useQuantitySoldHistory(recipeIds, selectedCities);

  const isLoading =
    isLoadingPriceData ||
    priceDataFetchStatus === "fetching" ||
    isLoadingSoldHistory;

  const [selections, setSelections] = useState<CitySelectionsType>({});
  const [useInstantSell, setUseInstantSell] = useState(false);
  const [branchFilter, setBranchFilter] = useState<string>("All");
  const [missingPriceDataItemIds, setMissingPriceDataItemIds] = useState<
    string[] | null
  >(null);

  const initializeSelections = useCallback(() => {
    console.log("DEBUG WW rerunning initializeSelections");
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
    if (priceData) {
      setSelections(initializeSelections());
    }
  }, [priceData, initializeSelections]);

  const handleSelectionChange = useCallback((itemId: string, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  }, []);

  const data = useRecipeData(
    priceData,
    selections,
    useInstantSell,
    allRecipes,
    soldHistoryData,
    missingPriceDataItemIds,
    playerSpec
  );

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const passesBranchCheck =
        branchFilter === "All" ||
        row.recipe.specializationBranchName === branchFilter;
      return passesBranchCheck;
      // && row.recipe.ingredients.find((el) => el.itemId === "T3_MEAT")
    });
  }, [data, branchFilter]);

  const { favoriteList, toggleFavorite } = useFavoriteRecipes(craftingCategory);

  const columns = useRecipeColumns(
    itemTranslations,
    priceData,
    selections,
    useInstantSell,
    handleSelectionChange,
    favoriteList,
    toggleFavorite,
    expandedRows,
    toggleExpandedRow,
    addRecipeToCart,
    removeRecipeFromCart
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

  const favoriteData = useMemo(() => {
    return filteredData.filter((row) =>
      favoriteList.includes(row.recipe.recipeId)
    );
  }, [filteredData, favoriteList]);

  const favoriteTable = useReactTable({
    data: favoriteData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const [selectedRow, setSelectedRow] = useState<RecipeRowData | null>(null);

  const selectedRowTableData = useMemo(() => {
    if (!selectedRow) return [];
    return [selectedRow];
  }, [selectedRow]);

  const selectedRowTable = useReactTable({
    data: selectedRowTableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const debouncedUpdate = useMemo(
    () => debounce((cities: string[]) => setSelectedCities(cities), 1500),
    []
  );

  useEffect(() => {
    debouncedUpdate(uiSelectedCities);
    return () => debouncedUpdate.cancel();
  }, [uiSelectedCities, debouncedUpdate]);

  if (!priceData || isLoading || !missingPriceDataItemIds) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{craftingCategory} Recipes</h1>
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
      <div className="p-6 gap-6 flex flex-col relative">
        <ShoppingCartWindow
          cartItems={cartItems}
          requiredMaterials={requiredMaterials}
          resetCart={resetCart}
          itemTranslations={itemTranslations}
          addToCart={addRecipeToCart}
          removeFromCart={removeRecipeFromCart}
          priceData={priceData}
          useInstantSell={useInstantSell}
          selections={selections}
        />
        <div className="flex items-center gap-4 ">
          <h1 className="text-3xl font-bold">{craftingCategory} Recipes</h1>
          {/* <Label className="flex items-center gap-2">
            <Checkbox
              checked={useInstantSell}
              onCheckedChange={(checked) => setUseInstantSell(!!checked)}
            />
            <span>Use Instant Sell</span>
          </Label> */}

          {/* <MarketPricesSheet
            handleSelectionChange={handleSelectionChange}
            selections={selections}
            ingredientIds={ingredientIds}
            priceData={priceData}
            useInstantSell={useInstantSell}
            recipeIds={recipeIds}
          /> */}

          <Select
            value={branchFilter}
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
        <Card className="flex flex-col gap-4 p-4 rounded-md">
          <h1 className="text-xl font-bold">City</h1>
          <div className="flex flex-row gap-4">
            <Button
              onClick={() => {
                refetchPrices();
              }}
              variant={"secondary"}
              size="sm"
            >
              Refresh prices
            </Button>
            {allCities.map((city) => (
              <div
                key={city}
                className="flex justify-center items-center gap-1"
              >
                <Checkbox
                  checked={uiSelectedCities.includes(city)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setUiSelectedCities((prev) => [...prev, city]);
                    } else {
                      setUiSelectedCities((prev) =>
                        prev.filter((c) => c !== city)
                      );
                    }
                  }}
                />
                <span>{city}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="flex flex-col gap-4 p-4 rounded-md">
          <div className="flex flex-row gap-4">
            <h1 className="text-xl font-bold">Specializations</h1>
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={simulateMaxSpec}
                onCheckedChange={(checked) => {
                  setMaxSpec(!!checked);
                  setSimulateMaxSpec(!!checked);
                }}
              />
              <span>Max Spec</span>
            </Label>
          </div>
          <div className="flex flex-wrap gap-4 max-w-[60%]">
            {["mastery", ...branchNames].map((el) => (
              <div key={el} className="flex justify-between w-40">
                <span>{el}</span>
                <Input
                  className="max-w-16"
                  type="number"
                  value={
                    el === "mastery"
                      ? playerSpec.mastery
                      : playerSpec.specializations[el]
                  }
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    updateSpecialization(el, Number(e.target.value))
                  }
                />
              </div>
            ))}
          </div>
        </Card>
        <Card className="overflow-x-auto rounded-md p-4 border shadow-sm">
          <RecipeTable
            table={favoriteTable}
            isLoading={isLoading}
            priceData={priceData}
            selections={selections}
            handleSelectionChange={handleSelectionChange}
            itemTranslations={itemTranslations}
            columns={columns}
            missingPriceDataItemIds={missingPriceDataItemIds}
            expandedRows={expandedRows}
            toggleExpandedRow={toggleExpandedRow}
            setSelectedRow={setSelectedRow}
          />
        </Card>
        <Card className="overflow-x-auto rounded-md p-4 border shadow-sm">
          <RecipeTable
            table={table}
            isLoading={isLoading}
            priceData={priceData}
            selections={selections}
            handleSelectionChange={handleSelectionChange}
            itemTranslations={itemTranslations}
            columns={columns}
            missingPriceDataItemIds={missingPriceDataItemIds}
            expandedRows={expandedRows}
            toggleExpandedRow={toggleExpandedRow}
            setSelectedRow={setSelectedRow}
          />
        </Card>
        {/* <div className={cn("fixed z-20 bottom-0 left-0 right-0 w-full bg-accent", selectedRow ? "block" : "hidden")}>
          <Card className="overflow-x-auto rounded-md p-4 border shadow-sm">
            <RecipeTable
              table={selectedRowTable}
              isLoading={isLoading}
              priceData={priceData}
              selections={selections}
              handleSelectionChange={handleSelectionChange}
              itemTranslations={itemTranslations}
              columns={columns}
              missingPriceDataItemIds={missingPriceDataItemIds}
              expandedRows={expandedRows}
              toggleExpandedRow={toggleExpandedRow}
              setSelectedRow={setSelectedRow}
            />
          </Card>
        </div> */}
      </div>
    </TooltipProvider>
  );
}
