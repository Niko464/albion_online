import { TableCell, TableRow } from "@/components/ui/table";
import { memo } from "react";
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

export const RecipeRow = memo(
  ({
    recipe,
    priceData,
    selections,
    useInstantSell,
    expanded,
    toggleRow,
    handleSelectionChange,
  }: {
    recipe: Recipe;
    priceData: GetPricesResponse | undefined;
    selections: Record<string, string>;
    useInstantSell: boolean;
    expanded: boolean;
    toggleRow: (recipeId: string) => void;
    handleSelectionChange: (itemId: string, value: string) => void;
  }) => {
    const calculateRecipeCost = (recipe: Recipe) => {
      if (!priceData) return 0;
      return recipe.ingredients.reduce((total, ingredient) => {
        const selectedCity = selections[ingredient.itemId];
        const itemData = priceData.prices.find(
          (el) => el.itemId === ingredient.itemId
        );
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
      const selectedCity = selections[recipe.recipeId];
      const recipeData = priceData.prices.find(
        (el) => el.itemId === recipe.recipeId
      );
      let sellPrice = 0;
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
      const profit = sellPrice * recipe.quantity - recipeCost;
      const percentage = recipeCost > 0 ? (profit / recipeCost) * 100 : 0;
      return { profit, percentage };
    };

    const { profit, percentage } = calculateRecipeProfit(recipe);

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
            </CollapsibleTrigger>
          </TableCell>
          <TableCell>
            {calculateRecipeCost(recipe).toLocaleString()} Silver
          </TableCell>
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
            <Select
              value={selections[recipe.recipeId] || ""}
              onValueChange={(value) =>
                handleSelectionChange(recipe.recipeId, value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sell city" />
              </SelectTrigger>
              <SelectContent>
                {priceData?.prices
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
                          ...market.requestOrders.map((order) => order.price)
                        )
                      : Math.min(
                          ...market.offerOrders.map((order) => order.price)
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
                    useInstantSell ? b.price - a.price : a.price - b.price
                  )
                  .map((market) => (
                    <SelectItem
                      key={`${market.locationName}-${recipe.recipeId}`}
                      value={market.locationName}
                    >
                      {market.price} Silver, {market.locationName},{" "}
                      {market.minutesAgo} min ago
                    </SelectItem>
                  )) || (
                  <SelectItem value="no-data">No data available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>
        <CollapsibleContent>
          {/* <TableRow>
            <TableCell colSpan={4} className="bg-muted"> */}
          <div className="flex flex-wrap gap-4 p-4">
            {recipe.ingredients.map((ingredient, i) => {
              const itemData = priceData?.prices.find(
                (el) => el.itemId === ingredient.itemId
              );
              const selectedCity = selections[ingredient.itemId] || "";
              return (
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
                  <Select
                    value={selectedCity}
                    onValueChange={(value) =>
                      handleSelectionChange(ingredient.itemId, value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select market" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemData?.markets
                        .filter((market) => market.offerOrders?.length > 0)
                        .map((market) => ({
                          ...market,
                          minPrice: Math.min(
                            ...market.offerOrders.map((order) => order.price)
                          ),
                          minutesAgo: getMinutesAgo(
                            market.offerOrders[0].receivedAt
                          ),
                        }))
                        .sort((a, b) => a.minPrice - b.minPrice)
                        .map((market) => (
                          <SelectItem
                            key={`${market.locationName}-${ingredient.itemId}`}
                            value={market.locationName}
                          >
                            {market.minPrice} Silver, {market.locationName},{" "}
                            {market.minutesAgo} min ago
                          </SelectItem>
                        )) || (
                        <SelectItem value="no-data">
                          No data available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
          {/* </TableCell>
          </TableRow> */}
        </CollapsibleContent>
      </Collapsible>
    );
  }
);
