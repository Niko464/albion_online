import { IsArray, ArrayNotEmpty, IsString } from "class-validator";

export class GetPricesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  itemIds!: string[];
}

export type GetPricesResponse = {
  prices: {
    itemId: string;
    markets: {
      locationName: string;
      orders: {
        id: string;
        marketOrderId: string;
        itemId: string;
        locationName: string;
        quality: number;
        enchantmentLevel: number;
        type: string;
        amount: number;
        price: number;
        expiresAt: Date;
        receivedAt: Date;
      }[];
    }[];
  }[];
};
