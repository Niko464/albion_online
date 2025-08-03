import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection } from 'nats';
import { WebsocketGatewayService } from '../websocket-gateway/websocket-gateway.gateway';

@Injectable()
export class NatsListenerService implements OnModuleInit {
  private nc: NatsConnection;

  constructor(private wsGateway: WebsocketGatewayService) {}

  async onModuleInit() {
    this.nc = await connect({
      servers:
        'nats://public:thenewalbiondata@nats.albion-online-data.com:34222',
      user: 'public',
      pass: 'thenewalbiondata',
    });

    console.log('Connected to NATS server');

    const sub = this.nc.subscribe('marketorders.ingest');
    for await (const msg of sub) {
      const data = JSON.parse(msg.data.toString());

      console.log('Received market order:');
      // if (data.ItemTypeId?.includes('HIDE')) {
      //   this.wsGateway.broadcastHideData(data);
      // }
    }
  }
}
