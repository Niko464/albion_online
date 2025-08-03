import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CronJobService {
  constructor(private readonly prismaService: PrismaService) {}

  @Cron('*/1 * * * *')
  async autoArchiveMeetings() {
    // Step 1: Find duplicate marketOrderIds (with more than one entry)
    const duplicates = await this.prismaService.marketOrder.groupBy({
      by: ['marketOrderId'],
      having: {
        marketOrderId: {
          _count: {
            gt: 1,
          },
        },
      },
    });

    const duplicateIds = duplicates.map((d) => d.marketOrderId);

    if (duplicateIds.length !== 0) {
      console.log('WARN');
      console.log('WARN');
      console.log('WARN');
      console.warn(
        'Found duplicate marketOrderIds ',
        duplicateIds.length,
        duplicateIds,
      );
      console.log('WARN');
      console.log('WARN');
      console.log('WARN');
    } else {
      console.log('No duplicate marketOrderIds found');
    }

    for (const orderId of duplicateIds) {
      // Step 2: Find all entries for this marketOrderId, ordered by receivedAt DESC
      const orders = await this.prismaService.marketOrder.findMany({
        where: { marketOrderId: orderId },
        orderBy: { receivedAt: 'desc' },
      });

      // Step 3: Keep the first (latest), delete the rest
      const toDelete = orders.slice(1).map((order) => order.id);

      if (toDelete.length > 0) {
        await this.prismaService.marketOrder.deleteMany({
          where: { id: { in: toDelete } },
        });
      }
    }
  }
}
