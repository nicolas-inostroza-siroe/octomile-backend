import { forwardRef, Module } from '@nestjs/common';
import { webSocketGateway } from './web-socket.gateway';
import { SessionsModule } from 'src/sessions/sessions.module';
import { SessionsService } from 'src/sessions/sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/sessions/entities/session.entity';
import { SessionDetailEntity } from 'src/sessions/entities/sessionDetails.entity';




@Module({
    imports: [],
    providers: [
        webSocketGateway
    ],
    exports: [
        webSocketGateway,
    ]
})
export class WebSocketModule {}
