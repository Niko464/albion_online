import type { GetPricesResponse } from "@albion_online/common";

type Market = GetPricesResponse["prices"][number]["markets"][number];

/**
 * Finds the market with the median offer price.
 * Keeps the same structure as original min/max version for easy rollback.
 *
 * @param itemId - The ID of the item (e.g., "T1_CARROT" or "T1_MEAL_SOUP")
 * @param priceData - The price data containing market information
 * @param returnMaxPrice - Ignored in this version, kept for compatibility
 * @returns The best market object or null if no valid market is found
 */
export function getBestMarket(
  itemId: string,
  priceData: GetPricesResponse | undefined,
  returnMaxPrice: boolean = false
): Market | null {
  if (!priceData) {
    return null;
  }

  const itemData = priceData.prices.find((item) => item.itemId === itemId);
  if (!itemData || !itemData.markets) {
    return null;
  }

  // Filter markets with valid offer orders
  const validMarkets = itemData.markets.filter(
    (market) => market.offerOrders?.length > 0
  );

  if (validMarkets.length === 0) {
    return null;
  }

  return findMarketWithBestPrice(validMarkets, returnMaxPrice);
}

/**
 * Finds the market with the median offer price among valid markets.
 * Structure kept close to original.
 */
function findMarketWithBestPrice(
  markets: Market[],
  returnMaxPrice: boolean // kept but unused
): Market | null {
  // Sort markets by median price
  const sorted = [...markets].sort((a, b) => {
    const priceA = getExtremePrice(a, false); // now returns median
    const priceB = getExtremePrice(b, false);
    if (priceA === priceB) {
      return isMoreRecent(a, b) ? -1 : 1;
    }
    return priceA - priceB;
  });

  // Pick median market
  const medianIndex = Math.floor((sorted.length - 1) / 2);
  return sorted[medianIndex] || null;
}

/**
 * Gets the median offer price from a market's offer orders.
 * Param kept as 'isRecipe' for compatibility.
 */
function getExtremePrice(market: Market, isRecipe: boolean): number {
  const orders = market.offerOrders;
  if (!orders?.length) {
    return Infinity;
  }
  const prices = orders.map((order) => order.price).sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  return prices.length % 2 === 0
    ? (prices[mid - 1] + prices[mid]) / 2
    : prices[mid];
}

/**
 * Compares two markets to determine which has the more recent offer order.
 */
function isMoreRecent(marketA: Market, marketB: Market): boolean {
  const timeA = marketA.offerOrders[0]?.receivedAt
    ? new Date(marketA.offerOrders[0].receivedAt).getTime()
    : 0;
  const timeB = marketB.offerOrders[0]?.receivedAt
    ? new Date(marketB.offerOrders[0].receivedAt).getTime()
    : 0;
  return timeA > timeB;
}
