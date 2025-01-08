import { Module } from '@nestjs/common';
import { ShipmentLoadService } from './shipment-load.service';
import { ShipmentLoadController } from './shipment-load.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentLoadEntity, ShipmentMasterEntity } from './entities';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [ShipmentLoadController],
  providers: [ShipmentLoadService],
  imports: [
    TypeOrmModule.forFeature([ShipmentMasterEntity, ShipmentLoadEntity]),
    AuthModule
  ],
  exports: [TypeOrmModule, ShipmentLoadService]
})
export class ShipmentLoadModule { }
