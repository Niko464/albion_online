import { Module } from "@nestjs/common";
import { NatsListenerService } from "./nats-listener.service";


@Module({
  providers: [NatsListenerService]
})
export class NatsModule {}