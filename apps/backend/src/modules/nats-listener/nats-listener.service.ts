import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection } from 'nats';
import { ABDMarketOrderMessageSchema } from '@/utils/zod/ABDMarketOrderSchema';
import z from 'zod';
import { PricesService } from '../prices/prices.service';

@Injectable()
export class NatsListenerService implements OnModuleInit {
  private nc: NatsConnection | null = null;

  constructor(private pricesService: PricesService) {}

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
        let raw: string;
        if (msg.data instanceof Uint8Array || Buffer.isBuffer(msg.data)) {
          raw = Buffer.from(msg.data).toString('utf-8').trim();
        } else {
          console.warn(
            'Unexpected type for msg.data:',
            typeof msg.data,
            msg.data,
          );
          continue; // Skip if msg.data is not a Uint8Array or Buffer
        }

        const parsed: unknown = JSON.parse(raw);
        const result = ABDMarketOrderMessageSchema.safeParse(parsed);

        if (!result.success) {
          console.warn(
            'Invalid market order message:',
            z.treeifyError(result.error),
          );
          continue;
        }

        await this.pricesService.receivedOrders(result.data);
      } catch (err: any) {
        console.warn(
          'Failed to process message:',
          err instanceof Error ? err.message : err,
          'Raw message:',
          msg.data,
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
