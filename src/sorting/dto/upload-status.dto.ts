import { IsEnum, IsString, minLength, MinLength } from "class-validator";


export class UploadStatusDto {

    @IsString()
    @MinLength(1)
    mawb: string;

    @IsString()
    @MinLength(1)
    status: string;

}