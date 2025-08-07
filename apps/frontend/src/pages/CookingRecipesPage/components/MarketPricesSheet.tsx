import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { getMinutesAgo } from "@/utils/getMinutesAgo";
import type { GetPricesResponse } from "@albion_online/common";
import { memo, useCallback, useMemo } from "react";

type Props = {
  ingredientIds: string[];
  priceData: GetPricesResponse | undefined;
  selections: Record<string, string>;
  handleSelectionChange: (itemId: string, value: string) => void;
  recipeIds: string[];
  useInstantSell: boolean;
};

const ItemRow = memo(
  ({
    itemId,
    priceData,
    selections,
    handleSelectionChange,
    useInstantSell,
    isRecipe,
  }: {
    itemId: string;
    priceData: GetPricesResponse | undefined;
    selections: Record<string, string>;
    handleSelectionChange: (itemId: string, value: string) => void;
    useInstantSell: boolean;
    isRecipe: boolean;
  }) => {
    const itemData = priceData?.prices.find((el) => el.itemId === itemId);
    const onValueChange = useCallback(
      (value: string) => handleSelectionChange(itemId, value),
      [itemId, handleSelectionChange]
    );

    return (
      <div className="flex items-center gap-4 overflow-x-hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <img
              src={`https://render.albiononline.com/v1/item/${itemId}.png`}
              alt={itemId}
              className="w-16 h-16 object-contain"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white text-xs rounded py-1 px-2">
            {itemId}
          </TooltipContent>
        </Tooltip>
        <Select value={selections[itemId] || ""} onValueChange={onValueChange}>
          <SelectTrigger className="max-w-full">
            <SelectValue placeholder="Select market" />
          </SelectTrigger>
          <SelectContent>
            {itemData?.markets
              .filter((market) =>
                isRecipe
                  ? useInstantSell
                    ? market.requestOrders?.length > 0
                    : market.offerOrders?.length > 0
                  : market.offerOrders?.length > 0
              )
              .map((market) => ({
                ...market,
                price: isRecipe
                  ? useInstantSell
                    ? Math.max(
                        ...market.requestOrders!.map((order) => order.price)
                      )
                    : Math.min(
                        ...market.offerOrders!.map((order) => order.price)
                      )
                  : Math.min(
                      ...market.offerOrders!.map((order) => order.price)
                    ),
                minutesAgo: getMinutesAgo(
                  (isRecipe && useInstantSell
                    ? market.requestOrders?.[0]
                    : market.offerOrders?.[0]
                  )?.receivedAt
                ),
              }))
              .filter(
                (market) =>
                  market.price !== undefined && market.minutesAgo !== undefined
              )
              .sort((a, b) =>
                isRecipe && useInstantSell
                  ? b.price - a.price
                  : a.price - b.price
              )
              .map((market) => (
                <SelectItem
                  key={`${market.locationName}-${itemId}`}
                  value={market.locationName}
                >
                  {market.price} Silver, {market.locationName},{" "}
                  {market.minutesAgo} min ago
                </SelectItem>
              )) || <SelectItem value="no-data">No data available</SelectItem>}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

// TODO: T5_FISH_SALTWATER_ALL_RARE does it mean multiple fish are valid ?
export function MarketPricesSheet({
  ingredientIds,
  priceData,
  selections,
  handleSelectionChange,
  recipeIds,
  useInstantSell,
}: Props) {
  const oldestIngredient = useMemo(() => {
    let oldest: {
      itemId: string;
      minutesAgo: number;
      location: string;
    } | null = null;
    [...new Set(ingredientIds)].forEach((itemId) => {
      const selectedCity = selections[itemId];
      const itemData = priceData?.prices.find((el) => el.itemId === itemId);
      const market = itemData?.markets.find(
        (m) => m.locationName === selectedCity
      );
      if (market?.offerOrders?.length) {
        const minutesAgo = getMinutesAgo(market.offerOrders[0].receivedAt);
        if (
          minutesAgo !== undefined &&
          (!oldest || minutesAgo > oldest.minutesAgo)
        ) {
          oldest = { itemId, minutesAgo, location: selectedCity };
        }
      }
    });
    return oldest;
  }, [ingredientIds, priceData, selections]);

  const oldestRecipe = useMemo(() => {
    let oldest: {
      itemId: string;
      minutesAgo: number;
      location: string;
    } | null = null;
    [...new Set(recipeIds)].forEach((itemId) => {
      const selectedCity = selections[itemId];
      const itemData = priceData?.prices.find((el) => el.itemId === itemId);
      const market = itemData?.markets.find(
        (m) => m.locationName === selectedCity
      );
      if (
        market &&
        (useInstantSell
          ? market.requestOrders?.length
          : market.offerOrders?.length)
      ) {
        const minutesAgo = getMinutesAgo(
          (useInstantSell ? market.requestOrders?.[0] : market.offerOrders?.[0])
            ?.receivedAt
        );
        if (
          minutesAgo !== undefined &&
          (!oldest || minutesAgo > oldest.minutesAgo)
        ) {
          oldest = { itemId, minutesAgo, location: selectedCity };
        }
      }
    });
    return oldest;
  }, [recipeIds, priceData, selections, useInstantSell]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Set Market Cities</Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[640px] px-2">
        <SheetHeader>
          <SheetTitle>Select Market Cities</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {oldestIngredient && (
            <div className="items-center gap-2 text-sm flex-col">
              <span className="font-semibold">Oldest Selected Ingredient Market:</span>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img
                      src={`https://render.albiononline.com/v1/item/${oldestIngredient.itemId}.png`}
                      alt={oldestIngredient.itemId}
                      className="w-12 h-12 object-contain"
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-white text-xs rounded py-1 px-2">
                    {oldestIngredient.itemId}
                  </TooltipContent>
                </Tooltip>
                <span>
                  {oldestIngredient.location}, {oldestIngredient.minutesAgo} min
                  ago
                </span>
              </div>
            </div>
          )}
          {oldestRecipe && (
            <div className="items-center gap-2 text-sm flex-col">
              <span className="font-semibold">Oldest Selected Recipe Market:</span>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img
                      src={`https://render.albiononline.com/v1/item/${oldestRecipe.itemId}.png`}
                      alt={oldestRecipe.itemId}
                      className="w-12 h-12 object-contain"
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-white text-xs rounded py-1 px-2">
                    {oldestRecipe.itemId}
                  </TooltipContent>
                </Tooltip>
                <span>
                  {oldestRecipe.location}, {oldestRecipe.minutesAgo} min ago
                </span>
              </div>
            </div>
          )}
        </div>
        <Tabs defaultValue="ingredients" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients">
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {[...new Set(ingredientIds)].map((itemId) => (
                <ItemRow
                  key={itemId}
                  itemId={itemId}
                  priceData={priceData}
                  selections={selections}
                  handleSelectionChange={handleSelectionChange}
                  useInstantSell={useInstantSell}
                  isRecipe={false}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="recipes">
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {[...new Set(recipeIds)].map((itemId) => (
                <ItemRow
                  key={itemId}
                  itemId={itemId}
                  priceData={priceData}
                  selections={selections}
                  handleSelectionChange={handleSelectionChange}
                  useInstantSell={useInstantSell}
                  isRecipe={true}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
