import { Type } from "class-transformer";
import { IsArray, IsString, MinLength, ValidateNested } from "class-validator";

export class UpdateStatusShipmentDto {

    @IsString()
    @MinLength(1)
    mawb: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StatusShipmentDto)
    shipmentUpdate: StatusShipmentDto[]

}

class StatusShipmentDto {

    @IsString()
    @MinLength(1)
    trakingId: string;

    @IsString()
    @MinLength(1)
    statusCode: string


}