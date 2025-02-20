import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryEntity } from './entities/delivery.entity';
import { DeliveryContainEntity } from './entities/delivery-contain.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DeliveryEntity,DeliveryContainEntity])],
  controllers: [DeliveryController],
  providers: [DeliveryService]
})
export class DeliveryModule {}
