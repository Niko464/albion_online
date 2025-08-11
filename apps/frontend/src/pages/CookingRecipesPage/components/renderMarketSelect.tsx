import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMinutesAgo } from "@/utils/getMinutesAgo";
import type { GetPricesResponse } from "@albion_online/common";
import type { CitySelectionsType } from "../CookingRecipesPage";

export const renderMarketSelect = (
  itemId: string,
  priceData: GetPricesResponse,
  selections: CitySelectionsType,
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
              {market.price.toLocaleString()} Silver, {market.locationName},{" "}
              {market.minutesAgo} min ago
            </SelectItem>
          ))
        ) : (
          <SelectItem value="" disabled>
            No market data available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};
