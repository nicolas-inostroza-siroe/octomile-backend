import { IsArray, IsString, MinLength } from "class-validator";


export class UpdateStatusLoadDto {
    @IsString()
    @MinLength(1)
    mawb: string;

    @IsArray({ each: true })
    hawbs: string[];
}