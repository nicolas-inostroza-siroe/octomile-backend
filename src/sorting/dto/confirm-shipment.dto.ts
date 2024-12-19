import { Transform } from "class-transformer";
import { IsArray, IsDate, IsNumber, IsOptional, IsString, MinLength } from "class-validator";



export class ConfirmShiptmentDto {

    @IsString()
    @MinLength(1)
    mawb: string;

    @IsArray()
    @IsString({ each: true })
    hawbs: string[];

    @IsString()
    @MinLength(1)
    batchId: string;

    @IsDate()
    @IsOptional()
    checkpointDate?: Date;
}