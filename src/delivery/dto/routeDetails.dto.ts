import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDate, IsBoolean } from 'class-validator';

export class RouteDetailsDto {
    @ApiProperty()
    @IsNumber()
    numProduct: number;

    @ApiProperty()
    @IsString()
    bindProduct: string;

    @ApiProperty()
    @IsString()
    patenteProducto: string;

    @ApiProperty()
    @IsString()
    codigoProducto: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    fuePinchado: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    fechaPinchado: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    codigoPinchazo: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    PinchadoPor: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    estado: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    userId: string;
}