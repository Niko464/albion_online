import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetPricesDto, GetPricesResponse } from '@albion_online/common';
import { ABDMarketOrderMessage } from '@/utils/zod/ABDMarketOrderSchema';
import { allRessourceIds } from '@/utils/types';
import { getLocationName } from '@/utils/getLocationName';

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
          const offerOrders = itemOrders
            .filter(
              (order) =>
                order.locationName === locationName && order.type === 'offer',
            )
            .sort((a, b) => {
              if (a.price !== b.price) {
                return a.price - b.price; // Sort by price ascending
              }
              return (
                new Date(a.expiresAt).getTime() -
                new Date(b.expiresAt).getTime()
              );
            });

          const requestOrders = itemOrders
            .filter(
              (order) =>
                order.locationName === locationName && order.type === 'request',
            )
            .sort((a, b) => {
              if (a.price !== b.price) {
                return b.price - a.price; // Sort by price descending
              }
              return (
                new Date(a.expiresAt).getTime() -
                new Date(b.expiresAt).getTime()
              );
            });

          return {
            locationName,
            offerOrders: offerOrders.map((el) => ({
              ...el,
              price: el.price / 10000,
            })),
            requestOrders: requestOrders.map((el) => ({
              ...el,
              price: el.price / 10000,
            })),
          };
        }),
      });

      // NOTE: now sort so that the first market is the cheapest offer
      result.prices.sort((a, b) => {
        const aMinPrice = Math.min(
          ...a.markets.map((market) =>
            market.offerOrders.length > 0
              ? market.offerOrders[0].price
              : Infinity,
          ),
        );
        const bMinPrice = Math.min(
          ...b.markets.map((market) =>
            market.offerOrders.length > 0
              ? market.offerOrders[0].price
              : Infinity,
          ),
        );
        return aMinPrice - bMinPrice;
      });
    }
    return result;
  }

  async receivedOrders(dto: ABDMarketOrderMessage) {
    const orders = dto.Orders;

    if (orders.length === 0) {
      return;
    }

    const itemTypeId = orders[0].ItemTypeId;
    const enchantmentLevel = orders[0].EnchantmentLevel;
    const qualityLevel = orders[0].QualityLevel;
    const locationId = orders[0].LocationId;
    const auctionType = orders[0].AuctionType;

    const allSameEnchantmentLevel = orders.every(
      (order) => order.EnchantmentLevel === enchantmentLevel,
    );

    const allSameQuality = orders.every(
      (order) => order.QualityLevel === qualityLevel,
    );

    const allSameLocation = orders.every(
      (order) => order.LocationId === locationId,
    );
    const allSameAuctionType = orders.every(
      (order) => order.AuctionType === auctionType,
    );

    if (!allRessourceIds.includes(itemTypeId)) {
      // console.log('Skipping non-resource item:', itemTypeId);
      return;
    }

    if (!allSameEnchantmentLevel) {
      throw new Error(
        `Inconsistent enchantment levels for item type ${itemTypeId}`,
      );
    }

    if (!allSameQuality) {
      throw new Error(
        `Inconsistent quality levels for item type ${itemTypeId}`,
      );
    }

    if (!allSameLocation) {
      throw new Error(`Inconsistent locations for item type ${itemTypeId}`);
    }

    if (!allSameAuctionType) {
      throw new Error(`Inconsistent auction types for item type ${itemTypeId}`);
    }

    const marketOrderIds = orders.map((order) => order.Id.toString());
    const locationName = getLocationName(locationId.toString());

    // Delete existing market orders for the item type
    await this.prismaService.marketOrder.deleteMany({
      where: {
        itemId: itemTypeId,
        marketOrderId: {
          notIn: marketOrderIds,
        },
        enchantmentLevel,
        quality: qualityLevel,
        locationName,
        type: auctionType,
      },
    });

    // Insert new market orders
    await this.prismaService.marketOrder.createMany({
      data: orders.map((el) => ({
        marketOrderId: el.Id.toString(),
        itemId: el.ItemTypeId,
        enchantmentLevel: el.EnchantmentLevel,
        quality: el.QualityLevel,
        locationName,
        type: auctionType,
        price: el.UnitPriceSilver,
        amount: el.Amount,
        expiresAt: new Date(el.Expires),
      })),
    });

    console.log('Processed market orders for item:', itemTypeId, {
      enchantmentLevel,
      qualityLevel,
      locationName,
      auctionType,
      count: orders.length,
    });
  }
}
