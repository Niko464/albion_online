import { IsArray, ArrayNotEmpty, IsString } from "class-validator";

export class GetPricesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  itemIds!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  cities!: string[];
}

export type Order = {
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
};
export type GetPricesResponse = {
  prices: {
    itemId: string;
    markets: {
      locationName: string;
      offerOrders: Order[];
      requestOrders: Order[];
    }[];
  }[];
};
