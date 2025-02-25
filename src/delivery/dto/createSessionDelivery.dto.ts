import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";



export class CreateSesionDeliveryDto{

    @ApiProperty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsOptional()
    fecha: Date;

    @ApiProperty()
    @IsString()
    propietario: string;

}