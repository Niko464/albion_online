import { Body, Controller, Patch } from '@nestjs/common';
import { PricesService } from './prices.service';
import { GetPricesDto } from '@albion_online/common';

@Controller('sold-history')
export class SellHistoryController {
  constructor(private pricesService: PricesService) {}

  @Patch()
  async averageSoldPerDay(@Body() dto: GetPricesDto) {
    return await this.pricesService.averageSoldPerDay(dto);
  }
}
