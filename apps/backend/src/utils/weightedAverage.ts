interface MarketData {
  avg_price: number;
  item_count: number;
  timestamp: string;
}

export function calculateMarketStats(data: MarketData[]): {
  weightedAvgPrice: number;
  weightedStdDev: number;
  avgItemCount: number;
} {
  let totalWeightedPrice: number = 0;
  let totalItemCount: number = 0;
  let sumItemCount: number = 0;
  let dataPointCount: number = 0;

  // First pass: Collect sums for weighted average and average item count
  for (const entry of data) {
    totalWeightedPrice += entry.avg_price * entry.item_count;
    totalItemCount += entry.item_count;
    sumItemCount += entry.item_count;
    dataPointCount += 1;
  }

  // Avoid division by zero
  if (totalItemCount === 0 || dataPointCount === 0) {
    return {
      weightedAvgPrice: 0,
      weightedStdDev: 0,
      avgItemCount: 0,
    };
  }

  // Calculate weighted average price
  const weightedAvgPrice: number = totalWeightedPrice / totalItemCount;

  // Calculate average item count
  const avgItemCount: number = sumItemCount / dataPointCount;

  // Second pass: Calculate weighted variance for standard deviation
  let totalWeightedVariance: number = 0;
  for (const entry of data) {
    const deviation: number = entry.avg_price - weightedAvgPrice;
    totalWeightedVariance += entry.item_count * deviation ** 2;
  }

  // Calculate weighted standard deviation
  const weightedVariance: number = totalWeightedVariance / totalItemCount;
  const weightedStdDev: number = Math.sqrt(weightedVariance);

  return {
    weightedAvgPrice,
    weightedStdDev,
    avgItemCount,
  };
}
