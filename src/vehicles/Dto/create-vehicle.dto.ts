import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsInt, IsDecimal } from 'class-validator';
import { EstadoVehiculo, TipoVehiculo } from '../entities/vehicles.entity';

export class CreateVehicleDto {
  @ApiProperty({ description: 'ID de la empresa' })
  @IsInt()
  @IsOptional()
  id_empresa?: number;

  @ApiProperty({ description: 'ID del propietario del vehículo' })
  @IsInt()
  @IsOptional()
  id_propietario?: number;

  @ApiProperty({ description: 'ID de la póliza asociada al vehículo' })
  @IsInt()
  @IsOptional()
  id_poliza?: number;

  @ApiProperty({ description: 'Patente o matrícula del vehículo' })
  @IsString()
  patente: string;

  @ApiProperty({ description: 'Tipo de vehículo', enum: TipoVehiculo })
  @IsEnum(TipoVehiculo)
  tipo_vehiculo: TipoVehiculo;

  @ApiProperty({ description: 'Capacidad de carga en kilogramos' })
  @IsDecimal()
  @IsOptional()
  capacidad_carga_kg?: number;

  @ApiProperty({ description: 'Capacidad de volumen en metros cúbicos' })
  @IsDecimal()
  @IsOptional()
  volumen_carga_m3?: number;

  @ApiProperty({ description: 'Marca del vehículo' })
  @IsString()
  marca: string;

  @ApiProperty({ description: 'Modelo del vehículo' })
  @IsString()
  modelo: string;

  @ApiProperty({ description: 'Año de fabricación' })
  @IsInt()
  ano_fabricacion: number;

  @ApiProperty({ description: 'Largo del vehículo en metros' })
  @IsDecimal()
  @IsOptional()
  largo_m?: number;

  @ApiProperty({ description: 'Ancho del vehículo en metros' })
  @IsDecimal()
  @IsOptional()
  ancho_m?: number;

  @ApiProperty({ description: 'Alto del vehículo en metros' })
  @IsDecimal()
  @IsOptional()
  alto_m?: number;

  @ApiProperty({ description: 'Fecha de vencimiento de la revisión técnica' })
  @IsString()
  @IsOptional()
  fecha_venc_revision_tecnica?: Date;

  @ApiProperty({ description: 'Fecha de vencimiento del permiso de circulación' })
  @IsString()
  @IsOptional()
  fecha_venc_permiso_circulacion?: Date;

  @ApiProperty({ description: 'Fecha de vencimiento del seguro obligatorio' })
  @IsString()
  @IsOptional()
  fecha_venc_seguro_obligatorio?: Date;

  @ApiProperty({ description: 'Estado del vehículo', enum: EstadoVehiculo })
  @IsEnum(EstadoVehiculo)
  @IsOptional()
  estado?: EstadoVehiculo = EstadoVehiculo.ACTIVO;

  @ApiProperty({ description: 'Indica si el vehículo tiene GPS activo' })
  @IsBoolean()
  @IsOptional()
  gps_activo?: boolean = false;

  @ApiProperty({ description: 'URL o ruta a la fotografía 1 del vehículo' })
  @IsString()
  @IsOptional()
  fotografia1?: string;

  @ApiProperty({ description: 'URL o ruta a la fotografía 2 del vehículo' })
  @IsString()
  @IsOptional()
  fotografia2?: string;

  @ApiProperty({ description: 'URL o ruta a la fotografía 3 del vehículo' })
  @IsString()
  @IsOptional()
  fotografia3?: string;

  @ApiProperty({ description: 'URL o ruta a la fotografía 4 del vehículo' })
  @IsString()
  @IsOptional()
  fotografia4?: string;

  @ApiProperty({ description: 'Documentos adicionales en formato JSON' })
  @IsOptional()
  documentos?: Record<string, string>;

  @ApiProperty({ description: 'Usuario que crea el registro del vehículo' })
  @IsString()
  creado_por: string;
}