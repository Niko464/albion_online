import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetPricesDto, GetPricesResponse } from '@albion_online/common';
import { ABDMarketOrderMessage } from '@/utils/zod/ABDMarketOrderSchema';
import { getLocationName } from '@/utils/getLocationName';

import allRessourceIds from '../../watch_list.json';
import axios from 'axios';
import { ABD_ENDPOINT, allCities } from '@/config';
import { ABDGetPricesResponse } from '@/utils/zod/ABDGetPricesSchema';

@Injectable()
export class PricesService {
  constructor(private prismaService: PrismaService) {}

  async getPrices(dto: GetPricesDto): Promise<GetPricesResponse> {
    const itemParam = dto.itemIds.join(',');
    const cityParam = allCities.join(',');
    const abdPrices = await axios.get<ABDGetPricesResponse>(
      `${ABD_ENDPOINT}/api/v2/stats/prices/${itemParam}?locations=${cityParam}&qualities=1`,
    );

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

      const marketsToPush = {
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
      };

      // NOTE: now any market that we don't have data for will be filled with ABD data
      for (const city of allCities) {
        const cityPrices = marketsToPush.markets.find((el) =>
          el.locationName.includes(city),
        );

        if (cityPrices) {
          continue;
        }
        const abdPriceData = abdPrices.data.find((el) => {
          return el.item_id === itemId && el.city === city;
        });
        if (!abdPriceData) {
          continue;
        }
        marketsToPush.markets.push({
          locationName: city,
          offerOrders:
            abdPriceData.sell_price_max === 0
              ? []
              : [
                  {
                    id: 'N/A - Albion Online API',
                    marketOrderId: 'N/A - Albion Online API',
                    itemId,
                    price: abdPriceData.sell_price_max,
                    receivedAt: new Date(abdPriceData.sell_price_max_date),
                    amount: 1,
                    enchantmentLevel: 0,
                    quality: 1,
                    expiresAt: new Date(abdPriceData.sell_price_max_date),
                    type: 'offer',
                    locationName: city,
                  },
                ],
          requestOrders:
            abdPriceData.buy_price_min === 0
              ? []
              : [
                  {
                    id: 'N/A - Albion Online API',
                    marketOrderId: 'N/A - Albion Online API',
                    itemId,
                    price: abdPriceData.buy_price_min,
                    receivedAt: new Date(abdPriceData.buy_price_min_date),
                    amount: 1,
                    enchantmentLevel: 0,
                    quality: 1,
                    expiresAt: new Date(abdPriceData.buy_price_min_date),
                    type: 'request',
                    locationName: city,
                  },
                ],
        });
      }
      result.prices.push(marketsToPush);

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

  async receivedOrders(dto: ABDMarketOrderMessage, ignoreWatchList = false) {
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

    if (!ignoreWatchList && !allRessourceIds.includes(itemTypeId)) {
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
