import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class pinchazoDisDto {
    @ApiProperty()
    @IsNumber()
    idSession: number;

    @ApiProperty()
    @IsString()
    codigoProducto: string;


    @ApiProperty({ required: false, nullable: true })
    @IsString()
    @IsOptional()
    pinchadoPor: string;
}