import { Module } from '@nestjs/common';
import { webSocketGateway } from './web-socket.gateway';




@Module({
imports: [webSocketGateway],

})
export class WebSocketModule {}
