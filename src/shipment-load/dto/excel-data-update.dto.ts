import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";


export class ExcelDataUpdateDto {

    @ApiProperty({
        description: 'The idSistema',
        minimum: 1,
        type: 'number',
    })
    @IsNumber()
    @IsPositive()
    idSistema: number;

    @ApiProperty({
        description: 'The master Vuelo',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    masterVuelo: string;

    @ApiProperty({
        description: 'The master Transportista',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    masterTransportista: string;

    @ApiProperty({
        description: 'The masterNro',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    masterNro: string;

    @ApiProperty({
        description: 'The master fecha',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    masterFecha: string;

    @ApiProperty({
        description: 'The n manifiesto',
        minimum: 1,
        type: 'number',
    })
    @IsNumber()
    @IsPositive()
    nroManifiesto: number;

    @ApiProperty({
        description: 'via Transporte',
        minimum: 1,
        type: 'number',
    })
    @IsNumber()
    @IsPositive()
    viaTransporte: number;

    @ApiProperty({
        description: 'The fecha arribo',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    fechaArribo: string;

    @ApiProperty({
        description: 'The pesoDeclarado',
        minimum: 1,
        example: '0,2',
        type: 'string',
    })
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'declaredValueUSD must be a number' })
    pesoDeclarado: number;

    @ApiProperty({
        description: 'The locacion embarque',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    locacionEmbarque: string;

    @ApiProperty({
        description: 'The locacion desembarque',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    locacionDesembarque: string;

    @ApiProperty({
        description: 'The locacion entrega',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    locacionEntrega: string;

    @ApiProperty({
        description: 'The locacion Recepcion',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    locacionRecepcion: string;


    @ApiProperty({
        description: 'The consecutive number',
        minimum: 1,
        type: 'string',
    })
    @Type(() => String)
    @IsString()
    @MinLength(1)
    hawb: string;

    @ApiProperty({
        description: 'The fecha ingreso',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    fechaIngreso: string;

    @ApiProperty({
        description: 'The codigo barra',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    codigoBarra: string;

    @ApiProperty({
        description: 'The destinario Nombre',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    destinatarioNombre: string;

    @ApiProperty({
        description: 'The destinatario Direccion',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    destinatarioDireccion: string;

    @ApiProperty({
        description: 'The destinatario Ciudad',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    destinatarioCiudad: string;

    @ApiProperty({
        description: 'The destinatario Pais',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    destinatarioPais: string;


    @ApiProperty({
        description: 'The destinatario Telefono',
        minimum: 1,
        type: 'string',
    })
    @Type(() => String)
    @IsString()
    @MinLength(1)
    destinatarioTelefono: string;

    @ApiProperty({
        description: 'The destinatario Email',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    destinatarioEmail: string;

    @ApiProperty({
        description: 'The destinatario rut',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    destinatarioRut: string;

    @ApiProperty({
        description: 'contenido',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    contenido: string;

    @ApiProperty({
        description: 'valor usd',
        minimum: 1,
        example: '10,5',
        type: 'string',
    })
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'declaredValueUSD must be a number' })
    valorUsd: number;

    @ApiProperty({
        description: 'valor usd',
        minimum: 1,
        example: '10,5',
        type: 'string',
    })
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'declaredValueUSD must be a number' })
    pesoBruto: number;

    @ApiProperty({
        description: 'the cantidad',
        minimum: 1,
        type: 'number',
    })
    @IsNumber()
    @IsPositive()
    cantidad: number;

    @ApiProperty({
        description: 'The consecutive number',
        minimum: 1,
        type: 'number',
    })
    @IsString()
    @MinLength(1)
    estado: string;

    @ApiProperty({
        description: 'The consecutive number',
        minimum: 1,
        type: 'number',
    })
    @IsString()
    @MinLength(1)
    estadoCorto: string;

    @ApiProperty({
        description: 'The consecutive number',
        minimum: 1,
        type: 'number',
    })
    @Transform(({ value }) => parseFloat(`${value}`.replace(',', '.')))
    @IsNumber({}, { message: 'declaredValueUSD must be a number' })
    flete: number;

    @ApiProperty({
        description: 'The id Externo',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    idExterno: string;

    @ApiProperty({
        description: 'the bagId ',
        minimum: 1,
        type: 'string',
    })
    @IsString()
    @MinLength(1)
    bAGID: string;

}