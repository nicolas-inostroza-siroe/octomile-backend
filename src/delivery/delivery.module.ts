import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryEntity } from './entities/delivery.entity';
import { DeliveryContainEntity } from './entities/delivery-contain.entity';
import { DriversEntity } from 'src/drivers/entities/drivers.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DeliveryEntity,DeliveryContainEntity,DriversEntity])],
  controllers: [DeliveryController],
  providers: [DeliveryService]
})
export class DeliveryModule {}
