import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ description: 'RUT de la empresa' })
  @IsString()
  @IsNotEmpty()
  rut: string;

  @ApiProperty({ description: 'Razón social de la empresa' })
  @IsString()
  @IsNotEmpty()
  razonSocial: string;

  @ApiProperty({ description: 'Dirección de la empresa' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ description: 'Comuna de la empresa' })
  @IsString()
  @IsNotEmpty()
  comuna: string;

  @ApiProperty({ description: 'Teléfono de contacto' })
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({ description: 'Correo electrónico' })
  @IsString()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({ description: 'Nombre del banco' })
  @IsString()
  @IsNotEmpty()
  banco: string;

  @ApiProperty({ description: 'Tipo de cuenta bancaria' })
  @IsString()
  @IsNotEmpty()
  tipoCuenta: string;

  @ApiProperty({ description: 'Número de cuenta bancaria' })
  @IsString()
  @IsNotEmpty()
  numeroCuenta: string;

  @ApiProperty({ description: 'Nombre del titular' })
  @IsString()
  @IsNotEmpty()
  titular: string;

  @ApiProperty({ description: 'RUT del titular' })
  @IsString()
  @IsNotEmpty()
  rutTitular: string;

  @ApiProperty({ description: 'RUT del representante legal' })
  @IsString()
  @IsNotEmpty()
  rutRepresentante: string;

  @ApiProperty({ description: 'Nombre del representante legal' })
  @IsString()
  @IsNotEmpty()
  nombreRepresentante: string;

  @ApiProperty({ description: 'Dirección del representante legal' })
  @IsString()
  @IsNotEmpty()
  direccionRepresentante: string;

  @ApiProperty({ description: 'Comuna del representante legal' })
  @IsString()
  @IsNotEmpty()
  comunaRepresentante: string;

  @ApiProperty({ description: 'Dirección física de la empresa' })
  @IsString()
  @IsNotEmpty()
  direccionFisica: string;


}