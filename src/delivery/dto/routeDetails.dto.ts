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
    fuePinchado?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    fechaPinchado?: Date;

    @ApiProperty()
    @IsOptional()
    @IsString()
    codigoPinchazo?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    PinchadoPor?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    estado?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    user?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    userName?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    pinchadoPorName?: string;
}