import type { GetPricesResponse } from "@albion_online/common";

type Market = GetPricesResponse["prices"][number]["markets"][number];
/**
 * Finds the market with the best price for an item.
 * For ingredients, returns the market with the lowest offer price (cheapest to buy).
 * For recipes, returns the market with the highest offer price (best to sell).
 * Ties are resolved by selecting the market with the most recent data.
 *
 * @param itemId - The ID of the item (e.g., "T1_CARROT" or "T1_MEAL_SOUP")
 * @param priceData - The price data containing market information
 * @param returnMaxPrice - Whether we try to maximise or minimise
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
 * Finds the market with the best price among valid markets.
 * For ingredients, selects the lowest offer price; for recipes, selects the highest offer price.
 * Resolves ties by choosing the market with the most recent order.
 *
 * @param markets - Array of markets with valid offer orders
 * @param isRecipe - Whether to look for the highest (recipes) or lowest (ingredients) offer price
 * @returns The market with the best price or null if no valid prices
 */
function findMarketWithBestPrice(
  markets: Market[],
  isRecipe: boolean
): Market | null {
  return markets.reduce((bestMarket: Market | null, currentMarket) => {
    const currentPrice = getExtremePrice(currentMarket, isRecipe);
    const bestPrice = bestMarket
      ? getExtremePrice(bestMarket, isRecipe)
      : isRecipe
      ? -Infinity
      : Infinity;

    // If no best market yet, take current
    if (!bestMarket) {
      return currentMarket;
    }

    // If prices are equal, compare timestamps
    if (currentPrice === bestPrice) {
      return isMoreRecent(currentMarket, bestMarket)
        ? currentMarket
        : bestMarket;
    }

    // Return the market with the better price (higher for recipes, lower for ingredients)
    return isRecipe
      ? currentPrice > bestPrice
        ? currentMarket
        : bestMarket
      : currentPrice < bestPrice
      ? currentMarket
      : bestMarket;
  }, null);
}

/**
 * Gets the extreme price from a market's offer orders.
 * For ingredients, returns the minimum offer price (cheapest to buy).
 * For recipes, returns the maximum offer price (best to sell).
 *
 * @param market - The market to analyze
 * @param isRecipe - Whether to find the maximum (recipes) or minimum (ingredients) offer price
 * @returns The extreme price or Infinity/-Infinity if no orders exist
 */
function getExtremePrice(market: Market, isRecipe: boolean): number {
  const orders = market.offerOrders;
  if (!orders?.length) {
    return isRecipe ? -Infinity : Infinity;
  }
  return isRecipe
    ? Math.max(...orders.map((order) => order.price))
    : Math.min(...orders.map((order) => order.price));
}

/**
 * Compares two markets to determine which has the more recent offer order.
 *
 * @param marketA - First market to compare
 * @param marketB - Second market to compare
 * @returns True if marketA has a more recent offer order than marketB
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
