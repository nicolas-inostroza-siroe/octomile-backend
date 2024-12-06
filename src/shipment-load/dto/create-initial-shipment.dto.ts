import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { ExcelDataDto } from "./excel-data-dto.ts";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class CreateInitialShipmentDto {

    @ApiProperty({
        description: 'The client folio',
        title: 'Client',
        minLength: 1,
        type: 'string',
        example: '489-12345678'
    })
    @IsString()
    @MinLength(1)
    client: string;

    @ApiPropertyOptional({
        title: 'IdFolio',
        description: 'The idFolio',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    @IsOptional()
    idFolio?: string;

    @ApiProperty({
        title: 'Excel Array DTO',
        description: 'All initial-shipments',
        type: [ExcelDataDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExcelDataDto)
    excel: ExcelDataDto[];
}