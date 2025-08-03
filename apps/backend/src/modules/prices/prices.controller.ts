import { Body, Controller, Patch } from '@nestjs/common';
import { PricesService } from './prices.service';
import { GetPricesDto } from '@albion_online/common';

@Controller('prices')
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @Patch()
  async getPrices(@Body() dto: GetPricesDto) {
    return this.pricesService.getPrices(dto);
  }
}
