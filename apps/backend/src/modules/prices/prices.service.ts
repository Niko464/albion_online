import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  GetPricesDto,
  GetPricesResponse,
  GetSoldHistoryResponse,
} from '@albion_online/common';
import { ABDMarketOrderMessage } from '@/utils/zod/ABDMarketOrderSchema';
import { getLocationName } from '@/utils/getLocationName';

import allRessourceIds from '../../watch_list.json';
import axios from 'axios';
import { ABD_ENDPOINT } from '@albion_online/common';
import { ABDGetPricesResponse } from '@/utils/zod/ABDGetPricesSchema';
import { OCRPriceUpdate } from '@/utils/zod/OCRPriceUpdateSchema';
import { ABDGetHistoryResponse } from '@/utils/zod/ABDGetHistorySchema';
import { calculateMarketStats } from '@/utils/weightedAverage';
import { getABDLocationIds } from '@/utils/getABDLocationIds';

@Injectable()
export class PricesService {
  constructor(private prismaService: PrismaService) {}

  async getPrices(dto: GetPricesDto): Promise<GetPricesResponse> {
    const itemParam = dto.itemIds.join(',');
    const cityParam = getABDLocationIds(dto.cities).join(',');
    const abdPrices = await axios.get<ABDGetPricesResponse>(
      `${ABD_ENDPOINT}/api/v2/stats/prices/${itemParam}?locations=${cityParam}&qualities=1`,
    );

    const prices = await this.prismaService.marketOrder.findMany({
      where: {
        itemId: {
          in: dto.itemIds,
        },
        locationName: {
          in: dto.cities,
        },
        enchantmentLevel: 0,
        quality: 1,
      },
    });
    const ocrPrices = await this.prismaService.ocrPrice.findMany({
      where: {
        itemId: {
          in: dto.itemIds,
        },
        quality: {
          in: [0, 1],
        },
        location: {
          in: dto.cities,
        },
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
      for (const city of dto.cities) {
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
      // NOTE: here we check if ocr has fresher prices than ABD or prisma
      for (const city of dto.cities) {
        const ocrPriceData = ocrPrices
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .find((el) => el.itemId === itemId && el.location === city);

        if (!ocrPriceData) {
          continue;
        }
        const currentPrice = marketsToPush.markets.find((el) =>
          el.locationName.includes(city),
        );

        // if (itemId === 'T7_MEAL_ROAST_FISH@3') {
        //   console.log('DEBUG WW avalon stuff', ocrPriceData, currentPrice);
        // }

        if (!currentPrice) {
          marketsToPush.markets.push({
            locationName: city,
            offerOrders: [
              {
                id: 'N/A - OCR',
                marketOrderId: 'N/A - OCR',
                itemId,
                price: ocrPriceData.price,
                receivedAt: ocrPriceData.createdAt,
                amount: 1,
                enchantmentLevel: 0,
                quality: 1,
                expiresAt: ocrPriceData.createdAt,
                type: 'offer',
                locationName: city,
              },
            ],
            requestOrders: [],
          });
        } else if (
          (currentPrice.offerOrders.length > 0 &&
            ocrPriceData.createdAt.getTime() >
              currentPrice.offerOrders[0].receivedAt.getTime()) ||
          currentPrice.offerOrders.length === 0
        ) {
          // If OCR price is fresher than the current offer price, update it
          currentPrice.offerOrders = [
            {
              id: 'N/A - OCR',
              marketOrderId: 'N/A - OCR',
              itemId,
              price: ocrPriceData.price,
              receivedAt: ocrPriceData.createdAt,
              amount: 1,
              enchantmentLevel: 0,
              quality: 1,
              expiresAt: ocrPriceData.createdAt,
              type: 'offer',
              locationName: city,
            },
          ];
        }
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

  async ocrPriceUpdate(dto: OCRPriceUpdate) {
    for (const el of dto) {
      await this.prismaService.ocrPrice.deleteMany({
        where: {
          itemId: el.itemId,
          location: el.location,
          quality: el.quality,
        },
      });
      await this.prismaService.ocrPrice.create({
        data: {
          itemId: el.itemId,
          location: el.location,
          price: el.price,
          quality: el.quality,
        },
      });
    }
  }

  async averageSoldPerDay(dto: GetPricesDto): Promise<GetSoldHistoryResponse> {
    const itemParam = dto.itemIds.join(',');
    const cityParam = getABDLocationIds(dto.cities).join(',');
    const abdHistory = await axios.get<ABDGetHistoryResponse>(
      `${ABD_ENDPOINT}/api/v2/stats/history/${itemParam}?locations=${cityParam}&qualities=1&time-scale=24`,
    );

    const result: GetSoldHistoryResponse = {
      histories: [],
    };

    console.log('DEBUG avg stuff', abdHistory.data);
    for (const itemId of dto.itemIds) {
      const historyItems = abdHistory.data.filter(
        (el) => el.item_id === itemId,
      );
      const newHistoryItem: GetSoldHistoryResponse['histories'][number] = {
        itemId,
        markets: [],
      };
      for (const city of dto.cities) {
        const priceData = historyItems.find(
          (el) => el.location.replace(' ', '') === city,
        );

        if (!priceData) {
          continue;
        }
        const { avgItemCount, weightedAvgPrice, weightedStdDev } =
          calculateMarketStats(priceData.data);
        newHistoryItem.markets.push({
          location: city,
          avgAmount: avgItemCount,
          avgPrice: weightedAvgPrice,
          stdDev: weightedStdDev,
        });
      }
      result.histories.push(newHistoryItem);
    }
    return result;
  }
}
