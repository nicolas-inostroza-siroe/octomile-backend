import { Module } from '@nestjs/common';
import { ShipmentLoadService } from './shipment-load.service';
import { ShipmentLoadController } from './shipment-load.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentLoadEntity, ShipmentMasterEntity } from './entities';
import { AuthModule } from '../auth/auth.module';
import { CommonService } from '../common/common.service';
import { CommonModule } from '../common/common.module';


@Module({
  controllers: [ShipmentLoadController],
  providers: [ShipmentLoadService],
  imports: [
    TypeOrmModule.forFeature([ShipmentMasterEntity, ShipmentLoadEntity]),
    AuthModule,
    CommonModule
  ],
  exports: [TypeOrmModule, ShipmentLoadService]
})
export class ShipmentLoadModule { }
