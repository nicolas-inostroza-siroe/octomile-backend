import { Module } from '@nestjs/common';
import { SortingService } from './sorting.service';
import { SortingController } from './sorting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenhafferApiModule } from '../senhaffer-api/senhaffer-api.module';
import { ShipmentLoadModule } from '../shipment-load/shipment-load.module';

@Module({
  controllers: [SortingController],
  providers: [SortingService],
  imports: [TypeOrmModule, SenhafferApiModule, ShipmentLoadModule]
})
export class SortingModule { }
