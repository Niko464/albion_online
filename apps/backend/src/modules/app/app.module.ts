import { Module } from '@nestjs/common';
import { NatsListenerService } from '../nats-listener/nats-listener.service';
import { PricesModule } from '../prices/prices.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, PricesModule],
  providers: [NatsListenerService],
})
export class AppModule {}
