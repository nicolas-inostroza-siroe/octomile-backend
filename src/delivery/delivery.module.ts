import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sessionDeliveryEntity } from './entities/sessiondelivery.entity';
import { sessionDeliveryRoutesEntity } from './entities/sessionDeliveryRoutes.entity';
import { DriversEntity } from 'src/drivers/entities/drivers.entity';
import { RouteDetailsEntity } from './entities/RouteDetails.entity';
import { SessionDetailEntity } from 'src/sessions/entities';
import { webSocketGateway } from 'src/web-socket/web-socket.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([sessionDeliveryEntity,sessionDeliveryRoutesEntity,RouteDetailsEntity,DriversEntity,SessionDetailEntity]),AuthModule],
  controllers: [DeliveryController],
  providers: [DeliveryService,webSocketGateway]
})
export class DeliveryModule {}
