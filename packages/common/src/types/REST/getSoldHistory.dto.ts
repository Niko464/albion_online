export type GetSoldHistoryResponse = {
  histories: {
    itemId: string;
    markets: {
      location: string;
      avgPrice: number;
      avgAmount: number;
      stdDev: number;
    }[];
  }[];
};
