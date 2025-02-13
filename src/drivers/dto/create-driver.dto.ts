import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsISO8601, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Column } from "typeorm";


export class CreateDriverDto {

    @ApiProperty({ description: 'Nombre del conductor' })
    @IsString()
    @IsNotEmpty()
    nombre_apellido: string;

    @ApiProperty({ description: 'Usuario' })
    @IsString()
    @IsNotEmpty()
    usuario: string;

    @ApiProperty({ description: 'Nombre del conductor en Geosort' })
    @IsString()
    @IsNotEmpty()
    conductor_nombre_geosort: string;

    @ApiProperty({ description: 'Empresa' })
    @IsString()
    @IsNotEmpty()
    empresa: string;

    @ApiProperty({ description: 'Patente' })
    @IsString()
    @IsNotEmpty()
    patente: string;

    @ApiProperty({ description: 'Tipo' })
    @IsString()
    @IsNotEmpty()
    tipo: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    permiso_circulacion: string;

    @ApiProperty({ type: 'string', })
    @IsOptional()
    fecha_de_vencimiento_permiso_circulacion: String;

  
    @ApiProperty({ type: 'string', format: 'binary' })
    revision_tecnica: string;

    @ApiProperty({ type: 'string', })
    @IsOptional()
    fecha_de_vencimiento_revision_tecnica: String;

   
    @ApiProperty({ type: 'string', format: 'binary' })
    soap_al_dia: string;

    @ApiProperty({ type: 'string'})
    @IsOptional()
    fecha_de_vencimiento_soap: string;

    
    @ApiProperty({ type: 'string', format: 'binary' })
    fotografia1: string;

    
    @ApiProperty({ type: 'string', format: 'binary' })
    fotografia2: string;

    
    @ApiProperty({ type: 'string', format: 'binary' })
    fotografia3: string;

   
    @ApiProperty({ type: 'string', format: 'binary' })
    fotografia4: string;

    @ApiProperty({ type: 'string'})
    ancho_vehiculo: string;

    @ApiProperty({ type: 'string'})
    largo_vehiculo: string;

    @Column({ type: 'varchar'})
    alto_vehiculo: string;


   
    @ApiProperty({ type: 'string', format: 'binary' })
    Carnet_de_identidad_vigente: string;

    @ApiProperty({ type: 'string'}) 
    @IsOptional()
    fecha_de_vencimiento_carnet_de_identidad: String;

   
    @ApiProperty({ type: 'string', format: 'binary' })
    licencia_conductor_vigente: string;

    @ApiProperty({ type: 'string' })
    @IsOptional()
    fecha_de_vencimiento_licencia_conductor: String;

    
    @ApiProperty({ type: 'string', format: 'binary' })
    certificado_antecedentes_vigente: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    certificado_anotaciones_vigente: string;

    
}