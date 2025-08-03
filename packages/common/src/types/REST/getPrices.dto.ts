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
        orderId: string;
        price: number;
        quantity: number;
        time: string;
      }[];
    }[];
  }[];
};
