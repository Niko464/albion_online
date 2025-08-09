import { getMinutesAgo } from "@/utils/getMinutesAgo";
import type { MarketData } from "@/utils/types";
import type { GetPricesResponse } from "@albion_online/common";

export const getMarketData = (
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