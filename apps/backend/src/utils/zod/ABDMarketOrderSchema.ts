import { z } from 'zod';

export const ABDMarketOrderSchema = z.object({
  Id: z.number(),
  ItemTypeId: z.string(),
  ItemGroupTypeId: z.string(),
  LocationId: z.number(),
  QualityLevel: z.number(),
  EnchantmentLevel: z.number(),
  UnitPriceSilver: z.number(),
  Amount: z.number(),
  AuctionType: z.enum(['offer', 'request']),
  Expires: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Expires must be a valid ISO date string',
  }),
});

export type ABDMarketOrder = z.infer<typeof ABDMarketOrderSchema>;

export const ABDMarketOrderMessageSchema = z.object({
  Orders: z.array(ABDMarketOrderSchema),
});

export type ABDMarketOrderMessage = z.infer<typeof ABDMarketOrderMessageSchema>;
