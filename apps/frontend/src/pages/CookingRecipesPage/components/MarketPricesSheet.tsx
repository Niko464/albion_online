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
import { memo, useCallback } from "react";

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

export function MarketPricesSheet({
  ingredientIds,
  priceData,
  selections,
  handleSelectionChange,
  recipeIds,
  useInstantSell,
}: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Set Market Cities</Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[640px] px-2">
        <SheetHeader>
          <SheetTitle>Select Market Cities</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="ingredients" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients">
            <div className="mt-4 space-y-4 max-h-[80vh] overflow-y-auto">
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
            <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto">
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
