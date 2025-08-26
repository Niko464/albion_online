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
import { allCities } from "@albion_online/common";
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

  const branchNames: string[] = useMemo(() => {
    return allRecipes.reduce((acc, curr) => {
      const branchName = curr.specializationBranchName;
      if (branchName && !acc.includes(branchName)) {
        acc.push(branchName);
      }
      return acc;
    }, [] as string[]);
  }, [allRecipes]);

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

  const [simulateMaxSpec, setSimulateMaxSpec] = useState<boolean>(false);
  const { playerSpec, updateSpecialization, setMaxSpec } = usePlayerSpecHelper(
    craftingCategory,
    branchNames
  );

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

  const debouncedUpdate = useMemo(
    () => debounce((cities: string[]) => setSelectedCities(cities), 1500),
    []
  );

  useEffect(() => {
    debouncedUpdate(uiSelectedCities);
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
      <div className="p-6 gap-6 flex flex-col">
        <div className="flex items-center gap-4 ">
          <h1 className="text-3xl font-bold">{craftingCategory} Recipes</h1>
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
        <Card className="flex flex-col gap-4 p-4 rounded-md">
          <h1 className="text-xl font-bold">City</h1>
          <div className="flex flex-row gap-4">
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
