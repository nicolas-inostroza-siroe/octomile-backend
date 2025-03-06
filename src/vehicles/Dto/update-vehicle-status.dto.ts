import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoVehiculo } from '../entities/vehicles.entity';

export class UpdateVehicleStatusDto {
  @ApiProperty({ 
    description: 'ID del propietario del vehículo',
    required: false 
  })
  @IsString()
  @IsOptional()
  id_propietario?: string;

  @ApiProperty({ 
    description: 'Estado del vehículo',
    enum: EstadoVehiculo,
    required: false
  })
  @IsEnum(EstadoVehiculo)
  @IsOptional()
  estado?: EstadoVehiculo;
}