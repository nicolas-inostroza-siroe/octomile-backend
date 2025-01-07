import { IsString, MinLength } from "class-validator";


export class RequestShipmentDto {

    @IsString()
    @MinLength(1)
    mawb: string;
}