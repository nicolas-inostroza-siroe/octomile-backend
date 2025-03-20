import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";


export class PinchazoDto {
    @ApiProperty()
    @IsString()
    codigoProducto: string;
    
    @ApiProperty()
    @IsInt()
    idRoute: number;

    @ApiProperty()
    @IsString()
    pinchadoPorName: string;

    @IsString()
    pinchadoPorId: string;

}