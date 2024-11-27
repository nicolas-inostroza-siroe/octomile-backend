import { Transform, Type } from "class-transformer";
import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";


export class ExcelDataDto {

    @IsNumber()
    @IsPositive()
    consecutive: number;

    @IsNumber()
    @IsPositive()
    trackingID: number;

    @IsString()
    @MinLength(1)
    carrierReferenceID: string;

    @IsString()
    @MinLength(1)
    shipperName: string;

    @IsString()
    @MinLength(1)
    shipperCity: string;

    @IsString()
    @MinLength(1)
    shipperCountry: string;

    @IsString()
    @MinLength(1)
    consigneeName: string;

    @IsString()
    @MinLength(1)
    consigneeAddress: string;

    @IsString()
    @MinLength(1)
    consigneeState: string;

    @IsString()
    @MinLength(1)
    consigneeCity: string;

    @IsString()
    @MinLength(1)
    consigneeCountry: string;

    @Type(() => String)
    @IsString()
    @MinLength(1)
    consigneePhone: string;

    @IsString()
    @MinLength(1)
    consigneeEMail: string;

    @IsString()
    @MinLength(1)
    contentDescription: string;


    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'declaredValueUSD must be a number' })
    declaredValueUSD: number;

    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'grossWeightKilos must be a number' })
    grossWeightKilos: number;

    @IsNumber()
    @IsPositive()
    pieces: number;

    @IsString()
    @MinLength(1)
    consigneeTaxID: string;

    @IsNumber()
    @IsPositive()
    codArancel: number;

    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'freightValue must be a number' })
    freightValue: number;

    @IsString()
    @MinLength(1)
    idExterno: string;

    @IsString()
    @MinLength(1)
    productUrl: string;

    @IsString()
    @MinLength(1)
    bagId: string;
}