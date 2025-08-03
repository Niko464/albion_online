import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection } from 'nats';
import { ABDMarketOrderMessageSchema } from '@/utils/zod/ABDMarketOrderSchema';
import { allRessourceIds } from '@/utils/types';
import { PrismaService } from '../prisma/prisma.service';
import { getLocationName } from '@/utils/getLocationName';
import z from 'zod';

@Injectable()
export class NatsListenerService implements OnModuleInit {
  private nc: NatsConnection | null = null;

  constructor(private prismaService: PrismaService) {}

  async onModuleInit() {
    // Initialize NATS connection
    this.nc = await connect({
      servers:
        'nats://public:thenewalbiondata@nats.albion-online-data.com:34222',
      user: 'public',
      pass: 'thenewalbiondata',
    });

    console.log('Connected to NATS server');

    // Start message processing without blocking
    this.startProcessing();
  }

  private async startProcessing() {
    if (!this.nc) {
      throw new Error('NATS connection not initialized');
    }

    const sub = this.nc.subscribe('marketorders.ingest');

    for await (const msg of sub) {
      try {
        const raw = msg.data.toString();
        const parsed: unknown = JSON.parse(raw);
        const result = ABDMarketOrderMessageSchema.safeParse(parsed);

        if (!result.success) {
          console.warn(
            'Invalid market order message:',
            z.treeifyError(result.error),
          );
          continue;
        }

        const orders = result.data.Orders;

        if (orders.length === 0) {
          continue;
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
          console.log('Skipping non-resource item:', itemTypeId);
          continue;
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
          throw new Error(
            `Inconsistent auction types for item type ${itemTypeId}`,
          );
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
      } catch (err: any) {
        console.warn(
          'Failed to process message:',
          err instanceof Error ? err.message : err,
        );
        continue;
      }
    }
  }

  async onModuleDestroy() {
    if (this.nc) {
      await this.nc.close();
      console.log('NATS connection closed');
    }
  }
}
