import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { SessionEntity, SessionDetailEntity } from './entities';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { webSocketGateway } from 'src/web-socket/web-socket.gateway';
import { WebSocketModule } from 'src/web-socket/web-socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SessionEntity,
      SessionDetailEntity
    ]),
    AuthModule,
    CommonModule,
    WebSocketModule,
  ],
  providers: [SessionsService],
  controllers: [SessionsController],
  exports: [SessionsService]
})
export class SessionsModule {}
