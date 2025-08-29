import { getMinutesAgo } from "@/utils/getMinutesAgo";
import type { GetPricesResponse } from "@albion_online/common";
import { useMemo } from "react";

export const getListMarketsForItemId = (
  itemId: string,
  priceData: GetPricesResponse,
  useInstantSell: boolean
) => {
  const itemData = priceData?.prices.find((el) => el.itemId === itemId);
  return (
    itemData?.markets
      .filter((market) =>
        useInstantSell
          ? market.requestOrders?.length
          : market.offerOrders?.length
      )
      .map((market) => ({
        locationName: market.locationName,
        price: useInstantSell
          ? Math.max(
              ...(market.requestOrders?.map((order) => order.price) || [0])
            )
          : Math.min(
              ...(market.offerOrders?.map((order) => order.price) || [0])
            ),
        minutesAgo: getMinutesAgo(
          (useInstantSell ? market.requestOrders?.[0] : market.offerOrders?.[0])
            ?.receivedAt
        ),
      }))
      .filter((market) => market.price && market.minutesAgo !== undefined)
      .sort((a, b) =>
        useInstantSell ? b.price - a.price : a.price - b.price
      ) || []
  );
};

export const useListMarketsForItemId = (
  itemId: string,
  priceData: GetPricesResponse,
  useInstantSell: boolean
) => {
  const markets = useMemo(() => {
    return getListMarketsForItemId(itemId, priceData, useInstantSell);
  }, [itemId, priceData, useInstantSell]);

  return markets;
};
