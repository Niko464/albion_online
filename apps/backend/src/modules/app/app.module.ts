import { Module } from '@nestjs/common';
import { PricesModule } from '../prices/prices.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NatsModule } from '../nats-listener/nats.module';

@Module({
  imports: [PrismaModule, PricesModule, NatsModule],
})
export class AppModule {}
