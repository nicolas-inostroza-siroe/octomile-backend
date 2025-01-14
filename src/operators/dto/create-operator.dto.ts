import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsString, MinLength,ValidateNested,} from "class-validator";

class ZoneDto {
    @ApiProperty()
    @IsString()
    zone:string

    @ApiProperty()
    @IsString()
    name:string 

    @ApiProperty()
    @IsString()
    enabled:string
    
    @ApiProperty()
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber()
    min: number;

    @ApiProperty()
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber()
    max: number;
    
    @ApiProperty()
    @IsString()
    routes:string
}

class ConfigItemDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ type: [ZoneDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ZoneDto)
    data: ZoneDto[];
}

export class CreateOpertorDto {




@ApiProperty({
    description: 'The name of the operator',
    minimum: 1,
    type: 'string',
})
@IsString()
@MinLength(1)
name: string;

@ApiProperty({
    description: 'The config direct exit',
    minimum: 1,
    type: 'string',
 })
 @IsString()
 @MinLength(1)
configDirectExit: string;


@ApiProperty({
    description: 'The quantity of routes',
    minimum: 1,
    type: 'string',})
@IsString()
@MinLength(1)
qtyRoutes: string;


@ApiProperty({
    description: 'The minimum value',
    minimum: 1,
    type: 'number',})
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
@IsNumber()
min: number;

@ApiProperty({  
    description: 'The maximum value',
    minimum: 1,
    type: 'number',})
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber()
max: number;

@ApiProperty({
    description: 'The config',
    minimum: 1,
    type: ConfigItemDto,
    })
    @ValidateNested()
    @Type(() => ConfigItemDto)
    config: ConfigItemDto[];



}


