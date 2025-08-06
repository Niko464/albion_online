interface Market {
  locationName: string;
  offerOrders: { price: number; receivedAt: string }[];
  requestOrders: { price: number; receivedAt: string }[];
}

interface PriceData {
  prices: { itemId: string; markets: Market[] }[];
}

/**
 * Finds the market with the best price for an item.
 * For ingredients, returns the market with the lowest offer price.
 * For recipes, returns the market with the highest request price.
 * Ties are resolved by selecting the market with the most recent data.
 *
 * @param itemId - The ID of the item (e.g., "T1_CARROT" or "T1_MEAL_SOUP")
 * @param isRecipe - Whether the item is a recipe (true) or ingredient (false)
 * @returns The best market object or null if no valid market is found
 */
export function getBestMarket(itemId: string, priceData: PriceData | undefined, isRecipe: boolean = false): Market | null {
  // Return null if no price data is available
  if (!priceData) {
    return null;
  }

  // Find the item data for the given itemId
  const itemData = priceData.prices.find((item) => item.itemId === itemId);
  if (!itemData || !itemData.markets) {
    return null;
  }

  // Filter markets with valid orders (offerOrders for ingredients, requestOrders for recipes)
  const validMarkets = itemData.markets.filter((market) =>
    isRecipe
      ? market.requestOrders?.length > 0
      : market.offerOrders?.length > 0
  );
  if (validMarkets.length === 0) {
    return null;
  }

  // Find the market with the best price
  return findMarketWithBestPrice(validMarkets, isRecipe);
}

/**
 * Finds the market with the best price among valid markets.
 * For ingredients, selects the lowest price; for recipes, selects the highest price.
 * Resolves ties by choosing the market with the most recent order.
 *
 * @param markets - Array of markets with valid orders
 * @param isRecipe - Whether to look for requestOrders (recipes) or offerOrders (ingredients)
 * @returns The market with the best price or the first market in case of no valid prices
 */
function findMarketWithBestPrice(markets: Market[], isRecipe: boolean): Market {
  return markets.reduce((bestMarket, currentMarket) => {
    const currentPrice = getExtremePrice(
      currentMarket,
      isRecipe ? "requestOrders" : "offerOrders",
      isRecipe
    );
    const bestPrice = bestMarket
      ? getExtremePrice(bestMarket, isRecipe ? "requestOrders" : "offerOrders", isRecipe)
      : isRecipe
      ? -Infinity
      : Infinity;

    // If prices are equal, compare timestamps
    if (currentPrice === bestPrice) {
      return isMoreRecent(currentMarket, bestMarket, isRecipe) ? currentMarket : bestMarket;
    }

    // Return the market with the better price (higher for recipes, lower for ingredients)
    return isRecipe
      ? currentPrice > bestPrice
        ? currentMarket
        : bestMarket
      : currentPrice < bestPrice
      ? currentMarket
      : bestMarket;
  }, markets[0]);
}

/**
 * Gets the extreme price (min for offerOrders, max for requestOrders) from a market's orders.
 *
 * @param market - The market to analyze
 * @param orderType - The type of orders to check ("offerOrders" or "requestOrders")
 * @param isMax - Whether to find the maximum price (true) or minimum price (false)
 * @returns The extreme price or Infinity/-Infinity if no orders exist
 */
function getExtremePrice(
  market: Market,
  orderType: "offerOrders" | "requestOrders",
  isMax: boolean
): number {
  const orders = market[orderType];
  if (!orders?.length) {
    return isMax ? -Infinity : Infinity;
  }
  return isMax
    ? Math.max(...orders.map((order) => order.price))
    : Math.min(...orders.map((order) => order.price));
}

/**
 * Compares two markets to determine which has the more recent order.
 *
 * @param marketA - First market to compare
 * @param marketB - Second market to compare
 * @param isRecipe - Whether to check requestOrders (true) or offerOrders (false)
 * @returns True if marketA has a more recent order than marketB
 */
function isMoreRecent(marketA: Market, marketB: Market, isRecipe: boolean): boolean {
  const orderType = isRecipe ? "requestOrders" : "offerOrders";
  const timeA = new Date(marketA[orderType][0].receivedAt).getTime();
  const timeB = marketB ? new Date(marketB[orderType][0].receivedAt).getTime() : 0;
  return timeA > timeB;
}