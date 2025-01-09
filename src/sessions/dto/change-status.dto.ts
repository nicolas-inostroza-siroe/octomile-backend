import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";


export class ChangeStatusDto {

    @IsNumber()
    @IsPositive()
    idSession: number;

    @IsString()
    @MinLength(1)
    status: string;

}