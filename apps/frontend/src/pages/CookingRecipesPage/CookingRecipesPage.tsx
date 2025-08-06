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
      const bestMarket = getBestMarket(itemId, priceData);
      initial[itemId] = bestMarket ? bestMarket.locationName : "";
    });
    [...new Set(recipeIds)].forEach((itemId) => {
      const bestMarket = getBestMarket(itemId, priceData, useInstantSell);
      initial[itemId] = bestMarket ? bestMarket.locationName : "";
    });
    return initial;
  }, [priceData, useInstantSell, ingredientIds, recipeIds]);

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
              <TableRow>
                <TableHead>Recipe</TableHead>
                <TableHead>Recipe Cost</TableHead>
                <TableHead>Recipe Profit</TableHead>
                <TableHead>Sell City</TableHead>
              </TableRow>
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
                : allCookingRecipes.map((recipe) => (
                    <RecipeRow
                      key={recipe.recipeId}
                      recipe={recipe}
                      priceData={priceData}
                      selections={selections}
                      useInstantSell={useInstantSell}
                      expanded={!!expandedRows[recipe.recipeId]}
                      toggleRow={toggleRow}
                      handleSelectionChange={handleSelectionChange}
                    />
                  ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  );
}
