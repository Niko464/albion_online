import z from 'zod';

export const ABDGetPricesResponseSchema = z.array(
  z.object({
    item_id: z.string(),
    city: z.string(),
    quality: z.number().int().min(1).max(6),
    sell_price_min: z.number().int().nonnegative(),
    sell_price_min_date: z.string().datetime(),
    sell_price_max: z.number().int().nonnegative(),
    sell_price_max_date: z.string().datetime(),
    buy_price_min: z.number().int().nonnegative(),
    buy_price_min_date: z.string().datetime(),
    buy_price_max: z.number().int().nonnegative(),
    buy_price_max_date: z.string().datetime(),
  }),
);

export type ABDGetPricesResponse = z.infer<typeof ABDGetPricesResponseSchema>;