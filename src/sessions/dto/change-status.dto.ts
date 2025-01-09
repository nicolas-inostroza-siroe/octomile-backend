import { Type } from "class-transformer";
import { IsArray, IsNumber, IsPositive, IsString, MinLength, ValidateNested } from "class-validator";


export class ChangeStatusDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArrayStatusDto)
    changeStatus: ArrayStatusDto[]
}

class ArrayStatusDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @MinLength(1)
    status: string;
}