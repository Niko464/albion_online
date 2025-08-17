import { Module } from '@nestjs/common';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { SellHistoryController } from './sell-history.controller';

@Module({
  imports: [],
  controllers: [PricesController, SellHistoryController],
  providers: [PricesService],
  exports: [PricesService],
})
export class PricesModule {}
