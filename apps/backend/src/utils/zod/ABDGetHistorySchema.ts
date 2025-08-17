import z from 'zod';

export const ABDGetHistoryResponseSchema = z.array(
  z.object({
    item_id: z.string(),
    location: z.string(),
    quality: z.number(),
    data: z.array(
      z.object({
        avg_price: z.number(),
        item_count: z.number(),
        timestamp: z.string(),
      }),
    ),
  }),
);

export type ABDGetHistoryResponse = z.infer<typeof ABDGetHistoryResponseSchema>;
