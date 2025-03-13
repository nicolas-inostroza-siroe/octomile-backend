import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class UpdateStatusDto {
    @ApiProperty({ description: 'ID de la empresa', required: false })
    @IsNumber()
    @IsOptional()
    id?: number;

    @ApiProperty({ description: 'RUT de la empresa', required: false })
    @IsString()
    @IsOptional()
    rut?: string;

    @ApiProperty({ description: 'Razón social de la empresa', required: false })
    @IsString()
    @IsOptional()
    razonSocial?: string;

    @ApiProperty({ description: 'Teléfono de la empresa', required: false })
    @IsString()
    @IsOptional()
    telefono?: string;

    @ApiProperty({ description: 'Correo de la empresa', required: false })
    @IsString()
    @IsOptional()
    correo?: string;

    @ApiProperty({ description: 'Dirección de la empresa', required: false })
    @IsString()
    @IsOptional()
    direccion?: string;

    @ApiProperty({ description: 'Comuna de la empresa', required: false })
    @IsString()
    @IsOptional()
    comuna?: string;

    @ApiProperty({ description: 'Banco de la empresa', required: false })
    @IsString()
    @IsOptional()
    banco?: string;

    @ApiProperty({ description: 'Tipo de cuenta bancaria', required: false })
    @IsString()
    @IsOptional()
    tipoCuenta?: string;

    @ApiProperty({ description: 'Número de cuenta bancaria', required: false })
    @IsString()
    @IsOptional()
    numeroCuenta?: string;

    @ApiProperty({ description: 'Titular de la cuenta', required: false })
    @IsString()
    @IsOptional()
    titular?: string;

    @ApiProperty({ description: 'RUT del titular', required: false })
    @IsString()
    @IsOptional()
    rutTitular?: string;

    @ApiProperty({ description: 'RUT del representante legal', required: false })
    @IsString()
    @IsOptional()
    rutRepresentante?: string;

    @ApiProperty({ description: 'Nombre del representante legal', required: false })
    @IsString()
    @IsOptional()
    nombreRepresentante?: string;

    @ApiProperty({ description: 'Dirección del representante legal', required: false })
    @IsString()
    @IsOptional()
    direccionRepresentante?: string;

    @ApiProperty({ description: 'Comuna del representante legal', required: false })
    @IsString()
    @IsOptional()
    comunaRepresentante?: string;

    @ApiProperty({ description: 'Estado de la empresa' })
    @IsString()
    @IsNotEmpty()
    status: string;
}