import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { sessionDeliveryRoutesDto } from "./sessionDeliveryRoute.dto";
import { Type } from "class-transformer";



export class CreateSesionDeliveryDto{

    @ApiProperty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    fecha: string;

    @ApiProperty()
    @IsString()
    propietario: string;

    @ApiProperty()
    @IsNumber()
    sessionId: number;

    @ApiProperty({ type: [sessionDeliveryRoutesDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => sessionDeliveryRoutesDto)
    routes: sessionDeliveryRoutesDto[];
}