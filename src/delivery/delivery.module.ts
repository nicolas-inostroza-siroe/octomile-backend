import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sessionDeliveryEntity } from './entities/sessiondelivery.entity';
import { sessionDeliveryRoutesEntity } from './entities/sessionDeliveryRoutes.entity';
import { DriversEntity } from 'src/drivers/entities/drivers.entity';

@Module({
  imports:[TypeOrmModule.forFeature([sessionDeliveryEntity,sessionDeliveryRoutesEntity,DriversEntity])],
  controllers: [DeliveryController],
  providers: [DeliveryService]
})
export class DeliveryModule {}
