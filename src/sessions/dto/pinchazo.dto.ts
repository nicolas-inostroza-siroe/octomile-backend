import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";



export class PinchazoDto {

    @IsNumber()
    @IsPositive()
    idSession: number;

    @IsString()
    @MinLength(1)
    codigoProducto: string;

    @IsString()
    pinchadoPor: string;

}