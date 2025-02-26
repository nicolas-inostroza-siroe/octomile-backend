import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsOptional, IsString, ValidateNested } from "class-validator";
import { sessionDeliveryRoutesDto } from "./sessionDeliveryRoute.dto";
import { Type } from "class-transformer";



export class CreateSesionDeliveryDto{

    @ApiProperty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsDate()
    fecha: Date;

    @ApiProperty()
    @IsString()
    propietario: string;

    @ApiProperty({ type: [sessionDeliveryRoutesDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => sessionDeliveryRoutesDto)
    routes: sessionDeliveryRoutesDto[];

}