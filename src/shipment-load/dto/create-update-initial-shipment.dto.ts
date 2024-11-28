import { Type } from "class-transformer";
import { ExcelDataUpdateDto } from "./excel-data-update.dto";
import { IsArray, IsString, MinLength, ValidateNested } from "class-validator";


export class CreateUpdateInitialUpdateDto {

    @IsString()
    @MinLength(1)
    client: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExcelDataUpdateDto)
    excel: ExcelDataUpdateDto[];
}