import { IsArray, IsString, MinLength, ValidateNested } from "class-validator";
import { ExcelDataDto } from "./excel-data-dto.ts";
import { Type } from "class-transformer";


export class CreateInitialShipmentDto {

    @IsString()
    @MinLength(1)
    client: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExcelDataDto)
    excel: ExcelDataDto[];
}