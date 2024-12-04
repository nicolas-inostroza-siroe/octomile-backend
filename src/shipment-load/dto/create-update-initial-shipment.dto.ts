import { Type } from "class-transformer";
import { ExcelDataUpdateDto } from "./excel-data-update.dto";
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";


export class CreateUpdateInitialUpdateDto {

    @IsString()
    @MinLength(1)
    client: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    idFolio?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExcelDataUpdateDto)
    excel: ExcelDataUpdateDto[];
}