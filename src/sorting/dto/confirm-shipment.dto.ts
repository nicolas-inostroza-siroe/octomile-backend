import { IsArray, IsDate, IsString, MinLength } from "class-validator";



export class ConfirmShiptmentDto {

    @IsString()
    @MinLength(1)
    mawb: string;

    @IsArray({ each: true })
    hawbs: string[];

    @IsString()
    @MinLength(1)
    batchId: string;

    @IsDate()
    checkpointDate: Date;
}