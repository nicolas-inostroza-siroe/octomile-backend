import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './entities/vehicles.entity';
import { PropietarioVehiculoEntity } from './entities/prop-vehicles.entity';

@Module({
  imports:[TypeOrmModule.forFeature([VehicleEntity,PropietarioVehiculoEntity])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
