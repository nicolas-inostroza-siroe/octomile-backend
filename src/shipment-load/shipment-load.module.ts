import { Module } from '@nestjs/common';
import { ShipmentLoadService } from './shipment-load.service';
import { ShipmentLoadController } from './shipment-load.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitialLoadEntity, ShipmentLoadEntity } from './entities';


@Module({
  controllers: [ShipmentLoadController],
  providers: [ShipmentLoadService],
  imports: [
    TypeOrmModule.forFeature([ShipmentLoadEntity, InitialLoadEntity])
  ]
})
export class ShipmentLoadModule { }
