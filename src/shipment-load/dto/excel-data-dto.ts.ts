import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";


export class ExcelDataDto {
    @ApiProperty({
        description: 'The consecutive number',
        minimum: 1,
        type: 'number',
    })
    @IsNumber()
    @IsPositive()
    consecutive: number;

    @ApiProperty({
        description: 'The trackingId number',
        minimum: 1,
        type: 'number',
    })
    @IsNumber()
    @IsPositive()
    trackingID: number;

    @ApiProperty({
        description: 'The carrier Reference ID',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    carrierReferenceID: string;

    @ApiProperty({
        description: 'The Shipper Name',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    shipperName: string;

    @ApiProperty({
        description: 'The Shipper City',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    shipperCity: string;

    @ApiProperty({
        description: 'The Shipper Country',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    shipperCountry: string;

    @ApiProperty({
        description: 'The Consignee Name',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    consigneeName: string;

    @ApiProperty({
        description: 'The Consignee Address',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    consigneeAddress: string;

    @ApiProperty({
        description: 'The Consignee State',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    consigneeState: string;

    @ApiProperty({
        description: 'The Consignee City',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    consigneeCity: string;

    @ApiProperty({
        description: 'The Consignee Country',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    consigneeCountry: string;

    @ApiProperty({
        description: 'The Consignee Country',
        minLength: 1,
        type: 'number',
    })
    @Type(() => String)
    @IsString()
    @MinLength(1)
    consigneePhone: string;

    @ApiProperty({
        description: 'The consignee Email',
        minLength: 1,
        type: 'number',
    })
    @IsString()
    @MinLength(1)
    consigneeEMail: string;

    @ApiProperty({
        description: 'The Content Description',
        minLength: 1,
        type: 'number',
    })
    @IsString()
    @MinLength(1)
    contentDescription: string;


    @ApiProperty({
        description: 'The Content Description',
        minLength: 1,
        type: 'number',
    })
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'declaredValueUSD must be a number' })
    declaredValueUSD: number;

    @ApiProperty({
        description: 'The grossWeightKilos',
        minLength: 1,
        example: '0,1',
        type: 'string',
    })
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'grossWeightKilos must be a number' })
    grossWeightKilos: number;

    @ApiProperty({
        description: 'The Content Description',
        minLength: 1,
        type: 'number',
    })
    @IsNumber()
    @IsPositive()
    pieces: number;

    @ApiProperty({
        description: 'The Content Description',
        minLength: 1,
        type: 'number',
    })
    @IsString()
    @MinLength(1)
    consigneeTaxID: string;

    @ApiProperty({
        description: 'The cod Arancel number',
        minLength: 1,
        type: 'number',
    })
    @IsNumber()
    @IsPositive()
    codArancel: number;

    @ApiProperty({
        description: 'The freightValue number',
        minLength: 1,
        example: '0,1',
        type: 'string',
    })
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'freightValue must be a number' })
    freightValue: number;

    @ApiProperty({
        description: 'The idExterno ',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    idExterno: string;

    @ApiProperty({
        description: 'The producturl Description',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    productUrl: string;

    @ApiProperty({
        description: 'The bagId Description',
        minLength: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    bagId: string;
}