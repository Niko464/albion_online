import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Special value used to trigger manual price entry
const MANUAL_OPTION_VALUE = "__manual_price__";
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

  const currentSelection = selections[itemId] || "";
  const isManualSelection = currentSelection.startsWith("manual:");

  return (
    <Select
      value={currentSelection}
      onValueChange={(value) => {
        if (value === MANUAL_OPTION_VALUE) {
          const manualPrice = window.prompt("Enter price in silver", "0");
          if (manualPrice && !isNaN(Number(manualPrice)) && Number(manualPrice) > 0) {
            handleSelectionChange(itemId, `manual:${manualPrice}`);
          }
          return;
        }
        handleSelectionChange(itemId, value);
      }}
    >
      <SelectTrigger className={widthClass}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* If a manual price is currently selected, make sure the option is visible */}
        {isManualSelection && (
          <SelectItem value={currentSelection} key="manual-selected">
            {Number(currentSelection.split(":")[1]).toLocaleString()} Silver (Manual)
          </SelectItem>
        )}
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
        {/* Option to enter a manual price */}
        <SelectItem value={MANUAL_OPTION_VALUE} key="manual-enter">
          Enter manual price...
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
