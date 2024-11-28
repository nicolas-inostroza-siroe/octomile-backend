import { Transform, Type } from "class-transformer";
import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";


export class ExcelDataUpdateDto {

    @IsNumber()
    @IsPositive()
    idSistema: number;

    @IsString()
    @MinLength(1)
    masterVuelo: string;

    @IsString()
    @MinLength(1)
    masterTransportista: string;

    @IsString()
    @MinLength(1)
    masterNro: string;

    @IsString()
    @MinLength(1)
    masterFecha: string;

    @IsNumber()
    @IsPositive()
    nroManifiesto: number;

    @IsNumber()
    @IsPositive()
    viaTransporte: number;

    @IsString()
    @MinLength(1)
    fechaArribo: string;

    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'declaredValueUSD must be a number' })
    pesoDeclarado: number;

    @IsString()
    @MinLength(1)
    locacionEmbarque: string;

    @IsString()
    @MinLength(1)
    locacionDesembarque: string;

    @IsString()
    @MinLength(1)
    locacionEntrega: string;

    @IsString()
    @MinLength(1)
    locacionRecepcion: string;

    @Type(() => String)
    @IsString()
    @MinLength(1)
    hawb: string;

    @IsString()
    @MinLength(1)
    fechaIngreso: string;

    @IsString()
    @MinLength(1)
    codigoBarra: string;

    @IsString()
    @MinLength(1)
    destinatarioNombre: string;

    @IsString()
    @MinLength(1)
    destinatarioDireccion: string;

    @IsString()
    @MinLength(1)
    destinatarioCiudad: string;

    @IsString()
    @MinLength(1)
    destinatarioPais: string;

    @Type(() => String)
    @IsString()
    @MinLength(1)
    destinatarioTelefono: string;

    @IsString()
    @MinLength(1)
    destinatarioEmail: string;

    @IsString()
    @MinLength(1)
    destinatarioRut: string;

    @IsString()
    @MinLength(1)
    contenido: string;

    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'declaredValueUSD must be a number' })
    valorUsd: number;

    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'declaredValueUSD must be a number' })
    pesoBruto: number;

    @IsNumber()
    @IsPositive()
    cantidad: number;

    @IsString()
    @MinLength(1)
    estado: string;

    @IsString()
    @MinLength(1)
    estadoCorto: string;

    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'declaredValueUSD must be a number' })
    flete: number;

    @IsString()
    @MinLength(1)
    idExterno: string;

    @IsString()
    @MinLength(1)
    bAGID: string;

}