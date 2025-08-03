import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetPricesDto, GetPricesResponse } from '@albion_online/common';

@Injectable()
export class PricesService {
  constructor(private prismaService: PrismaService) {}

  async getPrices(dto: GetPricesDto): Promise<GetPricesResponse> {
    const prices = await this.prismaService.marketOrder.findMany({
      where: {
        itemId: {
          in: dto.itemIds,
        },
        enchantmentLevel: 0,
        quality: 1,
      },
    });
    const result: GetPricesResponse = {
      prices: [],
    };

    for (const itemId of dto.itemIds) {
      const itemOrders = prices.filter((order) => order.itemId === itemId);
      const uniqueLocations = Array.from(
        new Set(itemOrders.map((order) => order.locationName)),
      );

      result.prices.push({
        itemId,
        markets: uniqueLocations.map((locationName) => {
          const orders = itemOrders.filter(
            (order) => order.locationName === locationName,
          );

          const sortedOrders = orders
            .map((el) => ({
              orderId: el.marketOrderId,
              price: el.price,
              quantity: el.amount,
              time: el.expiresAt.toISOString(),
            }))
            .sort((a, b) => a.price - b.price);
          return {
            locationName,
            orders: sortedOrders,
          };
        }),
      });
    }
    return result;
  }
}
