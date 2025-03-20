import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateOwnerDto } from './create-owner.dto';

export class UpdateOwnerDto extends PartialType(CreateOwnerDto) {
  @ApiProperty({ 
    description: 'ID del propietario a modificar', 
    example: 1,
    required: true
  })
  @IsNumber()
  id_propietario: number;

  @ApiProperty({
    description: 'Nombre completo del propietario',
    example: 'Juan Pérez González',
    required: false
  })
  @IsString()
  @IsOptional()
  nombre_completo?: string;

  @ApiProperty({
    description: 'Tipo de identificación (RUT, DNI, etc.)',
    example: 'RUT',
    required: false
  })
  @IsString()
  @IsOptional()
  tipo_identificacion?: string;

  @ApiProperty({
    description: 'Número de identificación',
    example: '12.345.678-9',
    required: false
  })
  @IsString()
  @IsOptional()
  numero_identificacion?: string;

  @ApiProperty({
    description: 'Número telefónico del propietario',
    example: '+56 9 1234 5678',
    required: false
  })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty({
    description: 'Dirección física del propietario',
    example: 'Av. Providencia 1500, Santiago',
    required: false
  })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiProperty({
    description: 'Estado del propietario',
    example: 'Activo',
    required: false
  })
  @IsString()
  @IsOptional()
  estado?: string;
}
