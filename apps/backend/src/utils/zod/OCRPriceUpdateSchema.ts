import z from 'zod';

export const OCRPriceUpdateSchema = z.array(
  z.object({
    itemId: z.string(),
    location: z.string(),
    quality: z.number(),
    price: z.number().int().nonnegative(),
  }),
);

export type OCRPriceUpdate = z.infer<typeof OCRPriceUpdateSchema>;