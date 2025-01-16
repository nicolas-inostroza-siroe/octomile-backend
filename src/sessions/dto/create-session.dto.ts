import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsPositive, IsString, MinLength, ValidateNested } from "class-validator";

export class CreateSessionDto {

    @IsString()
    @MinLength(1)
    nombreSession: string;

    @IsString()
    @MinLength(1)
    propietario: string;

    @IsString()
    @MinLength(1)
    tipo: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductSessionDto)
    productsSessions: ProductSessionDto[];

}


class ProductSessionDto {

    @IsNumber()
    @IsPositive()
    numProduct: number;

    @IsString()
    @MinLength(1)
    bindProduct: string;

    @IsString()
    @MinLength(1)
    patenteProducto: string;

    @IsString()
    @MinLength(1)
    codigoProducto: string;

    
   


}


