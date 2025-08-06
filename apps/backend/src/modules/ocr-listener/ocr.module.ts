import { Module } from '@nestjs/common';
import { PricesModule } from '../prices/prices.module';
import { OcrController } from './ocr.controller';

@Module({
  imports: [PricesModule],
  controllers: [OcrController],
  providers: [],
  exports: [],
})
export class OcrModule {}
