export type GetSoldHistoryResponse = {
  histories: {
    itemId: string;
    location: string;
    avgPrice: number;
    avgAmount: number;
    stdDev: number;
  }[];
};
