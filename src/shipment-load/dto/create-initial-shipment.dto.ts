import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { ExcelDataDto } from "./excel-data-dto.ts";
import { Type } from "class-transformer";


export class CreateInitialShipmentDto {

    @IsString()
    @MinLength(1)
    client: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    idFolio?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExcelDataDto)
    excel: ExcelDataDto[];
}