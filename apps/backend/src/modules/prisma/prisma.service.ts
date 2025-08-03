import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@/@generated/prisma-client';

@Injectable()
export class PrismaService extends PrismaClient {
  // constructor(private readonly configService: ConfigService) {
  //   super({
  //     log:
  //       configService.getOrThrow('ENVIRONNEMENT') === Environments.LOCAL
  //         ? ['query', 'info', 'warn', 'error']
  //         : ['error'],
  //   });
  // }
}
