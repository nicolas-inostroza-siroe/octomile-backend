import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class DeliveryContainDto{
    @ApiProperty({ description: 'Numero de producto' })
    @IsOptional()
    @IsString()
    n_producto: string;

    @ApiProperty({ description: 'Bind producto' })
    @IsOptional()
    @IsString()
    Bind_producto: string;

    @ApiProperty({ description: 'Patente producto' })
    @IsOptional()
    @IsString()
    patente_producto: string;

    @ApiProperty({ description: 'Codigo producto' })
    @IsOptional()
    @IsString()
    codigo_producto: string;


}