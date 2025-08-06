import { ABDMarketOrderMessage } from '@/utils/zod/ABDMarketOrderSchema';
import { All, Body, Controller, Post, Res } from '@nestjs/common';
import { PricesService } from '../prices/prices.service';
import { Response } from 'express';

@Controller()
export class ClientListenerController {
  constructor(private pricesService: PricesService) {}

  @Post('marketorders.ingest')
  async handleMarketOrders(@Body() body: ABDMarketOrderMessage) {
    console.log('Received CUSTOM market orders:', body.Orders.length);
    await this.pricesService.receivedOrders(body, true);
  }

  @Post('markethistories')
  async handleMarketHistories() {
    console.log('Received CUSTOM market histories');
  }

  @Post('goldprices')
  async handleGoldPrices() {
    console.log('Received CUSTOM gold prices');
  }

  @Post('mapdata')
  async handleMapData() {
    console.log('Received CUSTOM map data');
  }
}
