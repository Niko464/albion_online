import { TableCell, TableRow } from "@/components/ui/table";
import { memo, useMemo } from "react";
import { type GetPricesResponse, type Recipe } from "@albion_online/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getMinutesAgo } from "@/utils/getMinutesAgo";

interface RecipeRowProps {
  recipe: Recipe;
  priceData: GetPricesResponse;
  selections: Record<string, string>;
  useInstantSell: boolean;
  expanded: boolean;
  toggleRow: (recipeId: string) => void;
  handleSelectionChange: (itemId: string, value: string) => void;
}

interface MarketData {
  locationName: string;
  price: number;
  minutesAgo: number;
}

// Utility to get market data for an item
const getMarketData = (
  itemId: string,
  priceData: GetPricesResponse,
  useInstantSell: boolean,
  selectedCity: string
): MarketData | null => {
  const itemData = priceData?.prices.find((el) => el.itemId === itemId);
  const market = itemData?.markets.find((m) => m.locationName === selectedCity);
  if (
    !market ||
    (!market.offerOrders?.length && !market.requestOrders?.length)
  ) {
    return null;
  }

  const orders = useInstantSell ? market.requestOrders : market.offerOrders;
  if (!orders || orders.length === 0) return null;

  const price = orders[0].price;
  const minutesAgo = getMinutesAgo(orders[0].receivedAt);

  return { locationName: selectedCity, price, minutesAgo };
};

// Utility to calculate recipe cost
const calculateRecipeCost = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: Record<string, string>
): number => {
  if (!priceData) return 0;
  return recipe.ingredients.reduce((total, ingredient) => {
    const marketData = getMarketData(
      ingredient.itemId,
      priceData,
      false,
      selections[ingredient.itemId] || ""
    );
    if (!marketData) {
      throw new Error(
        `No market data found for ingredient ${ingredient.itemId} in city ${selections[ingredient.itemId] || ""}`
      );
    }
    return marketData ? total + marketData.price * ingredient.quantity : total;
  }, 0);
};

// Utility to calculate recipe profit
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

// Utility to get the oldest component age
const getOldestComponentAge = (
  recipe: Recipe,
  priceData: GetPricesResponse,
  selections: Record<string, string>,
  useInstantSell: boolean
): number => {
  const ages: number[] = [];

  // Recipe age
  const recipeMarket = getMarketData(
    recipe.recipeId,
    priceData,
    useInstantSell,
    selections[recipe.recipeId] || ""
  );
  if (recipeMarket) ages.push(recipeMarket.minutesAgo);

  // Ingredients ages
  recipe.ingredients.forEach((ingredient) => {
    const marketData = getMarketData(
      ingredient.itemId,
      priceData,
      false,
      selections[ingredient.itemId] || ""
    );
    if (marketData) ages.push(marketData.minutesAgo);
  });

  return ages.length > 0 ? Math.max(...ages) : 0;
};

// Utility to render item image with tooltip
const renderItemImage = (itemId: string) => (
  <div className="relative group">
    <img
      src={`https://render.albiononline.com/v1/item/${itemId}.png`}
      alt={itemId}
      className="w-16 h-16 object-contain"
    />
    <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-8">
      {itemId}
    </span>
  </div>
);

// Utility to render market select
const renderMarketSelect = (
  itemId: string,
  priceData: GetPricesResponse,
  selections: Record<string, string>,
  useInstantSell: boolean,
  handleSelectionChange: (itemId: string, value: string) => void,
  placeholder: string,
  widthClass: string = "w-full"
) => {
  const itemData = priceData?.prices.find((el) => el.itemId === itemId);
  const markets = itemData?.markets
    .filter((market) =>
      useInstantSell ? market.requestOrders?.length : market.offerOrders?.length
    )
    .map((market) => ({
      locationName: market.locationName,
      price: useInstantSell
        ? Math.max(
            ...(market.requestOrders?.map((order) => order.price) || [0])
          )
        : Math.min(...(market.offerOrders?.map((order) => order.price) || [0])),
      minutesAgo: getMinutesAgo(
        (useInstantSell ? market.requestOrders?.[0] : market.offerOrders?.[0])
          ?.receivedAt
      ),
    }))
    .filter((market) => market.price && market.minutesAgo !== undefined)
    .sort((a, b) => (useInstantSell ? b.price - a.price : a.price - b.price));

  return (
    <Select
      value={selections[itemId] || ""}
      onValueChange={(value) => handleSelectionChange(itemId, value)}
    >
      <SelectTrigger className={widthClass}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {markets?.length ? (
          markets.map((market) => (
            <SelectItem
              key={`${market.locationName}-${itemId}`}
              value={market.locationName}
            >
              {market.price} Silver, {market.locationName}, {market.minutesAgo}{" "}
              min ago
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-data">No data available</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export const RecipeRow = memo(
  ({
    recipe,
    priceData,
    selections,
    useInstantSell,
    expanded,
    toggleRow,
    handleSelectionChange,
  }: RecipeRowProps) => {
    const { profit, percentage, recipeCost } = useMemo(() => {
      return calculateRecipeProfit(
        recipe,
        priceData,
        selections,
        useInstantSell
      );
    }, [recipe, priceData, selections, useInstantSell]);

    const oldestAge = useMemo(() => {
      return getOldestComponentAge(
        recipe,
        priceData,
        selections,
        useInstantSell
      );
    }, [recipe, priceData, selections, useInstantSell]);

    return (
      <Collapsible
        key={recipe.recipeId}
        open={expanded}
        onOpenChange={() => toggleRow(recipe.recipeId)}
      >
        <TableRow>
          <TableCell className="w-[100px] flex items-center gap-2">
            <CollapsibleTrigger className="flex items-center gap-2">
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {renderItemImage(recipe.recipeId)}
            </CollapsibleTrigger>
          </TableCell>
          <TableCell>
            {oldestAge ? `${oldestAge} min ago` : "No data"}
          </TableCell>
          <TableCell>{recipeCost.toLocaleString()} Silver</TableCell>
          <TableCell
            className={`w-[150px] ${
              profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {percentage >= 0 ? "+" : "-"}
            {Math.abs(percentage).toFixed(2)}% ({profit.toLocaleString()}{" "}
            Silver)
          </TableCell>
          <TableCell>
            {renderMarketSelect(
              recipe.recipeId,
              priceData,
              selections,
              useInstantSell,
              handleSelectionChange,
              "Select sell city"
            )}
          </TableCell>
        </TableRow>
        <CollapsibleContent>
          <div className="flex flex-wrap gap-4 p-4">
            {recipe.ingredients.map((ingredient, i) => (
              <div key={i} className="flex items-center gap-2">
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
                {renderMarketSelect(
                  ingredient.itemId,
                  priceData,
                  selections,
                  false,
                  handleSelectionChange,
                  "Select market",
                  "w-40"
                )}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
);
