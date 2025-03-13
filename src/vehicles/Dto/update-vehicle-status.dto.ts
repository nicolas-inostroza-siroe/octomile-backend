import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateVehicleStatusDto {
    @ApiProperty({ description: 'ID del propietario', required: false })
    @IsString()
    @IsOptional()
    id_propietario?: string;

    @ApiProperty({ description: 'Estado del vehículo', required: false })
    @IsString()
    @IsOptional()
    estado?: string;
}