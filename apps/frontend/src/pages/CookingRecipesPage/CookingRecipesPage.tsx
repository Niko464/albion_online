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
import { useState, useEffect } from "react";
import { getBestMarket } from "./getBestMarket";
import { allCookingRecipes, type Recipe } from "@albion_online/common";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CookingRecipesPage() {
  const ingredientIds = allCookingRecipes.flatMap((recipe) =>
    recipe.ingredients.map((ingredient) => ingredient.itemId)
  );
  const recipeIds = allCookingRecipes.map((recipe) => recipe.recipeId);
  const {
    data: priceData,
    isLoading,
    error,
  } = useCustomPrices([...new Set([...ingredientIds, ...recipeIds])]);

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [useInstantSell, setUseInstantSell] = useState(false);
  const [manualPrices, setManualPrices] = useState<
    Record<string, { useManual: boolean; price: number }>
  >({});
  const [tempManualPrices, setTempManualPrices] = useState<
    Record<string, { useManual: boolean; price: number }>
  >({});
  const [initialized, setInitialized] = useState(false);

  // Load manual prices from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("manualPrices");
    if (saved) {
      const parsed = JSON.parse(saved);
      setManualPrices(parsed);
      setTempManualPrices(parsed);
    }
  }, []);

  const getMinutesAgo = (receivedAt: Date) => {
    const minutesAgo = Math.floor(
      (Date.now() - new Date(receivedAt).getTime()) / 1000 / 60
    );
    return minutesAgo >= 0 ? minutesAgo : 0;
  };

  const initializeSelections = () => {
    const initial: Record<string, string> = {};
    allCookingRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient, index) => {
        const bestMarket = getBestMarket(ingredient.itemId, priceData);
        initial[`${recipe.recipeId}-ingredient-${index}`] = bestMarket
          ? bestMarket.locationName
          : "";
      });
      const bestMarket = getBestMarket(
        recipe.recipeId,
        priceData,
        useInstantSell
      );
      initial[`${recipe.recipeId}-sell`] = bestMarket
        ? bestMarket.locationName
        : "";
    });
    return initial;
  };

  if (priceData && !initialized) {
    setSelections(initializeSelections());
    setInitialized(true);
  }

  const handleSelectionChange = (key: string, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const handleManualPriceChange = (itemId: string, price: number) => {
    setTempManualPrices((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], price },
    }));
  };

  const handleUseManualChange = (itemId: string, useManual: boolean) => {
    setTempManualPrices((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], useManual, price: prev[itemId]?.price || 0 },
    }));
  };

  const handleSaveManualPrices = () => {
    setManualPrices(tempManualPrices);
    localStorage.setItem("manualPrices", JSON.stringify(tempManualPrices));
  };

  const calculateRecipeCost = (recipe: Recipe) => {
    if (!priceData) return 0;
    return recipe.ingredients.reduce((total, ingredient, index) => {
      const selectedCity = selections[`${recipe.recipeId}-ingredient-${index}`];
      const itemData = priceData.prices.find(
        (el) => el.itemId === ingredient.itemId
      );
      if (manualPrices[ingredient.itemId]?.useManual) {
        return (
          total + manualPrices[ingredient.itemId].price * ingredient.quantity
        );
      }
      if (!itemData || !itemData.markets || !selectedCity) return total;
      const market = itemData.markets.find(
        (m) => m.locationName === selectedCity
      );
      if (!market || !market.offerOrders?.length) return total;
      const minPrice = Math.min(
        ...market.offerOrders.map((order) => order.price)
      );
      return total + minPrice * ingredient.quantity;
    }, 0);
  };

  const calculateRecipeProfit = (recipe: Recipe) => {
    if (!priceData) return { profit: 0, percentage: 0 };
    const recipeCost = calculateRecipeCost(recipe);
    const selectedCity = selections[`${recipe.recipeId}-sell`];
    const recipeData = priceData.prices.find(
      (el) => el.itemId === recipe.recipeId
    );
    let sellPrice = 0;
    if (manualPrices[recipe.recipeId]?.useManual) {
      sellPrice = manualPrices[recipe.recipeId].price;
    } else {
      if (!recipeData || !recipeData.markets || !selectedCity) {
        return { profit: -recipeCost, percentage: -100 };
      }
      const market = recipeData.markets.find(
        (m) => m.locationName === selectedCity
      );
      if (!market) return { profit: -recipeCost, percentage: -100 };

      if (useInstantSell) {
        if (market.requestOrders?.length) {
          sellPrice = Math.max(
            ...market.requestOrders.map((order) => order.price)
          );
        }
      } else {
        if (market.offerOrders?.length) {
          sellPrice = Math.min(
            ...market.offerOrders.map((order) => order.price)
          );
        }
      }
    }
    const profit = sellPrice * recipe.quantity - recipeCost;
    const percentage = recipeCost > 0 ? (profit / recipeCost) * 100 : 0;
    return { profit, percentage };
  };

  const maxIngredients = Math.max(
    ...allCookingRecipes.map((recipe) => recipe.ingredients.length)
  );

  if (error) {
    return <div className="p-4 text-destructive">Error fetching prices</div>;
  }

  return (
    <TooltipProvider>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Cooking Recipes</h1>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useInstantSell}
              onChange={(e) => setUseInstantSell(e.target.checked)}
              className="h-4 w-4"
            />
            <span>Use Instant Sell</span>
          </label>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Set Manual Prices</Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Manual Prices</SheetTitle>
              </SheetHeader>
              <Tabs defaultValue="ingredients" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="recipes">Recipes</TabsTrigger>
                </TabsList>
                <TabsContent value="ingredients">
                  <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {[...new Set(ingredientIds)].map((itemId) => (
                      <div key={itemId} className="flex items-center gap-4">
                        <img
                          src={`https://render.albiononline.com/v1/item/${itemId}.png`}
                          alt={itemId}
                          className="w-8 h-8 object-contain"
                        />
                        <Checkbox
                          id={`manual-${itemId}`}
                          checked={tempManualPrices[itemId]?.useManual || false}
                          onCheckedChange={(checked) =>
                            handleUseManualChange(itemId, checked)
                          }
                        />
                        <Label htmlFor={`manual-${itemId}`} className="flex-1">
                          {itemId}
                        </Label>
                        <Input
                          type="number"
                          placeholder="Price"
                          value={tempManualPrices[itemId]?.price || ""}
                          onChange={(e) =>
                            handleManualPriceChange(
                              itemId,
                              Number(e.target.value)
                            )
                          }
                          disabled={!tempManualPrices[itemId]?.useManual}
                          className="w-24"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="recipes">
                  <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {[...new Set(recipeIds)].map((itemId) => (
                      <div key={itemId} className="flex items-center gap-4">
                        <img
                          src={`https://render.albiononline.com/v1/item/${itemId}.png`}
                          alt={itemId}
                          className="w-8 h-8 object-contain"
                        />
                        <Checkbox
                          id={`manual-${itemId}`}
                          checked={tempManualPrices[itemId]?.useManual || false}
                          onCheckedChange={(checked) =>
                            handleUseManualChange(itemId, checked)
                          }
                        />
                        <Label htmlFor={`manual-${itemId}`} className="flex-1">
                          {itemId}
                        </Label>
                        <Input
                          type="number"
                          placeholder="Price"
                          value={tempManualPrices[itemId]?.price || ""}
                          onChange={(e) =>
                            handleManualPriceChange(
                              itemId,
                              Number(e.target.value)
                            )
                          }
                          disabled={!tempManualPrices[itemId]?.useManual}
                          className="w-24"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <Button className="mt-4 w-full" onClick={handleSaveManualPrices}>
                Save Prices
              </Button>
            </SheetContent>
          </Sheet>
        </div>
        <Card className="overflow-x-auto rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipe (T)</TableHead>
                <TableHead>Recipe Cost</TableHead>
                <TableHead>Recipe Profit</TableHead>
                <TableHead>Sell City</TableHead>
                {Array.from({ length: maxIngredients }).map((_, i) => (
                  <TableHead key={i}>Ingredient {i + 1}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="w-24 h-6" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-16 h-6" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-16 h-6" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-32 h-8" />
                      </TableCell>
                      {Array.from({ length: maxIngredients }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="w-32 h-8" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : allCookingRecipes.map((recipe) => {
                    const { profit, percentage } =
                      calculateRecipeProfit(recipe);
                    return (
                      <TableRow key={recipe.recipeId}>
                        <TableCell className="flex items-center gap-2">
                          <div className="relative group">
                            <img
                              src={`https://render.albiononline.com/v1/item/${recipe.recipeId}.png`}
                              alt={recipe.recipeId}
                              className="w-16 h-16 object-contain"
                            />
                            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-8">
                              {recipe.recipeId}
                            </span>
                          </div>
                          {manualPrices[recipe.recipeId]?.useManual && (
                            <span className="text-xs text-blue-600">
                              [Manual]
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {calculateRecipeCost(recipe).toLocaleString()} Silver
                        </TableCell>
                        <TableCell
                          className={
                            profit >= 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {percentage >= 0 ? "+" : "-"}
                          {Math.abs(percentage).toFixed(2)}% (
                          {profit.toLocaleString()} Silver)
                        </TableCell>
                        <TableCell>
                          <select
                            className="border rounded-md px-2 py-1 text-sm bg-background hover:bg-accent max-w-xs"
                            value={selections[`${recipe.recipeId}-sell`] || ""}
                            onChange={(e) =>
                              handleSelectionChange(
                                `${recipe.recipeId}-sell`,
                                e.target.value
                              )
                            }
                          >
                            <option value="" disabled>
                              Select sell city
                            </option>
                            {manualPrices[recipe.recipeId]?.useManual ? (
                              <option value="manual">Manual Price</option>
                            ) : (
                              priceData?.prices
                                .find((el) => el.itemId === recipe.recipeId)
                                ?.markets.filter((market) =>
                                  useInstantSell
                                    ? market.requestOrders?.length > 0
                                    : market.offerOrders?.length > 0
                                )
                                .map((market) => ({
                                  ...market,
                                  price: useInstantSell
                                    ? Math.max(
                                        ...market.requestOrders.map(
                                          (order) => order.price
                                        )
                                      )
                                    : Math.min(
                                        ...market.offerOrders.map(
                                          (order) => order.price
                                        )
                                      ),
                                  minutesAgo: getMinutesAgo(
                                    (useInstantSell
                                      ? market.requestOrders?.[0]
                                      : market.offerOrders?.[0]
                                    )?.receivedAt
                                  ),
                                }))
                                .filter(
                                  (market) =>
                                    market.price !== undefined &&
                                    market.minutesAgo !== undefined
                                )
                                .sort((a, b) =>
                                  useInstantSell
                                    ? b.price - a.price
                                    : a.price - b.price
                                )
                                .map((market) => (
                                  <option
                                    key={`${market.locationName}-${recipe.recipeId}`}
                                    value={market.locationName}
                                  >
                                    {market.price} Silver, {market.locationName}
                                    , {market.minutesAgo} min ago
                                  </option>
                                )) || (
                                <option value="no-data">
                                  No data available
                                </option>
                              )
                            )}
                          </select>
                        </TableCell>
                        {Array.from({ length: maxIngredients }).map((_, i) => {
                          const ingredient = recipe.ingredients[i];
                          if (!ingredient) {
                            return <TableCell key={i} />;
                          }
                          const itemData = priceData?.prices.find(
                            (el) => el.itemId === ingredient.itemId
                          );
                          const selectedCity =
                            selections[`${recipe.recipeId}-ingredient-${i}`] ||
                            "";
                          return (
                            <TableCell key={i}>
                              <div className="flex items-center gap-2">
                                <span>{ingredient.quantity}x</span>
                                <div className="relative group">
                                  <img
                                    src={`https://render.albiononline.com/v1/item/${ingredient.itemId}.png`}
                                    alt={ingredient.itemId}
                                    className="min-w-12 min-h-12 max-w-12 max-h-12 object-contain"
                                  />
                                  <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-8">
                                    {ingredient.itemId}
                                  </span>
                                </div>
                                {manualPrices[ingredient.itemId]?.useManual && (
                                  <span className="text-xs text-blue-600">
                                    [Manual]
                                  </span>
                                )}
                                <select
                                  className="border rounded-md px-2 py-1 text-sm bg-background hover:bg-accent max-w-xs"
                                  value={selectedCity}
                                  onChange={(e) =>
                                    handleSelectionChange(
                                      `${recipe.recipeId}-ingredient-${i}`,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="" disabled>
                                    Select market
                                  </option>
                                  {manualPrices[ingredient.itemId]
                                    ?.useManual ? (
                                    <option value="manual">Manual Price</option>
                                  ) : (
                                    itemData?.markets
                                      .filter(
                                        (market) =>
                                          market.offerOrders?.length > 0
                                      )
                                      .map((market) => ({
                                        ...market,
                                        minPrice: Math.min(
                                          ...market.offerOrders.map(
                                            (order) => order.price
                                          )
                                        ),
                                        minutesAgo: getMinutesAgo(
                                          market.offerOrders[0].receivedAt
                                        ),
                                      }))
                                      .sort((a, b) => a.minPrice - b.minPrice)
                                      .map((market) => (
                                        <option
                                          key={`${market.locationName}-${ingredient.itemId}`}
                                          value={market.locationName}
                                        >
                                          {market.minPrice} Silver,{" "}
                                          {market.locationName},{" "}
                                          {market.minutesAgo} min ago
                                        </option>
                                      )) || (
                                      <option value="no-data">
                                        No data available
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                            </TableCell>
                          );
                        })}
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
