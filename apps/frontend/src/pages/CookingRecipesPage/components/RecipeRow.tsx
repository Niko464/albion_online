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

interface RecipeRowProps {
  recipe: Recipe;
  priceData: GetPricesResponse;
  selections: Record<string, string>;
  useInstantSell: boolean;
  expanded: boolean;
  toggleRow: (recipeId: string) => void;
  handleSelectionChange: (itemId: string, value: string) => void;
  // precomputed values
  recipeCost: number;
  profit: number;
  percentage: number;
  oldestAge: number;
}

const renderItemImage = (itemId: string) => (
  <a
    href={`https://europe.albiononline2d.com/en/item/id/${itemId}`}
    target="_blank"
    rel="noopener noreferrer"
  >
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
  </a>
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
    recipeCost,
    profit,
    percentage,
    oldestAge,
  }: RecipeRowProps) => {
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
            className={`w-[120px] ${
              profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {percentage >= 0 ? "+" : "-"}
            {Math.abs(percentage).toFixed(2)}%
          </TableCell>
          <TableCell
            className={`w-[150px] ${
              profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {profit.toLocaleString()}
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
