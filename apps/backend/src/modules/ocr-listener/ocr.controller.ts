import { OCRPriceUpdate } from '@/utils/zod/OCRPriceUpdateSchema';
import { Body, Controller, Post } from '@nestjs/common';
import { PricesService } from '../prices/prices.service';

@Controller()
export class OcrController {
  constructor(private pricesService: PricesService) {}

  @Post('update-ocr-prices')
  async handleOcrPriceUpdate(@Body() body: OCRPriceUpdate) {
    console.log(
      'Received OCR Price Update for ids:',
      body.map((el) => el.itemId),
    );
    return this.pricesService.ocrPriceUpdate(body);
  }
}
