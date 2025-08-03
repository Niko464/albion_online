import { Module } from '@nestjs/common';

import { CronJobService } from './cronjob.service';

@Module({
  imports: [],
  providers: [CronJobService],
})
export class CronJobModule {}
