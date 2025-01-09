import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionDetailEntity, SessionEntity } from './entities';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  imports: [
    TypeOrmModule.forFeature([SessionEntity, SessionDetailEntity]),
    CommonModule
  ]
})
export class SessionsModule { }
