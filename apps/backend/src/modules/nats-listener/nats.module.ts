import { Module } from '@nestjs/common';
import { NatsListenerService } from './nats-listener.service';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [PricesModule],
  providers: [NatsListenerService],
})
export class NatsModule {}
