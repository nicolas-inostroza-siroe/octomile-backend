import { IsArray, IsEnum, IsString, minLength, MinLength } from "class-validator";


export class UploadStatusDto {

    @IsString()
    @MinLength(1)
    mawb: string

    @IsArray()
    @MinLength(1)
    @IsString({ each: true })
    hawb: string[];

    @IsString()
    @MinLength(1)
    status: string;

}