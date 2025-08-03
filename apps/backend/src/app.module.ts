import { Module } from '@nestjs/common';
import { NatsListenerService } from './nats-listener/nats-listener.service';
import { WebsocketGatewayService } from './websocket-gateway/websocket-gateway.gateway';

@Module({
  providers: [NatsListenerService, WebsocketGatewayService],
})
export class AppModule {}
