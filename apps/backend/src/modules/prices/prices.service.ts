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
        type: 'offer',
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

          const sortedOrders = orders.sort((a, b) => {
            if (a.price !== b.price) {
              return a.price - b.price; // Sort by price ascending
            }
            return (
              new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
            );
          });
          return {
            locationName,
            orders: sortedOrders.map((el) => ({
              ...el,
              price: el.price / 10000,
            })),
          };
        }),
      });

      // NOTE: now sort so that the first market is the cheapest
      result.prices.sort((a, b) => {
        const aMinPrice = Math.min(
          ...a.markets.map((market) =>
            market.orders.length > 0 ? market.orders[0].price : Infinity,
          ),
        );
        const bMinPrice = Math.min(
          ...b.markets.map((market) =>
            market.orders.length > 0 ? market.orders[0].price : Infinity,
          ),
        );
        return aMinPrice - bMinPrice;
      });
    }
    return result;
  }
}
