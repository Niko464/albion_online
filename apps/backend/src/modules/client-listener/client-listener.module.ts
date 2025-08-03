import { Module } from '@nestjs/common';
import { ClientListenerController } from './client-listener.controller';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [PricesModule],
  controllers: [ClientListenerController],
  providers: [],
  exports: [],
})
export class ClientListenerModule {}
