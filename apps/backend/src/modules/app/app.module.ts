import { Module } from '@nestjs/common';
import { PricesModule } from '../prices/prices.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NatsModule } from '../nats-listener/nats.module';
import { ClientListenerModule } from '../client-listener/client-listener.module';
import { CronJobModule } from '../cronjobs/cronjob.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OcrModule } from '../ocr-listener/ocr.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    PricesModule,
    NatsModule,
    ClientListenerModule,
    CronJobModule,
    OcrModule,
  ],
})
export class AppModule {}
