import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmpty, IsISO8601, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Column } from "typeorm";


export class CreateDriverDto {

    @ApiProperty({ description: 'Nombre del conductor' })
    @IsString()
    @IsNotEmpty()
    nombre_apellido: string;

    @ApiProperty({ 
        description: 'Tipo de identificación',
        required: false
    })
    @IsString()
    @IsOptional()
    tipo_identificacion?: string;

    @ApiProperty({ 
        description: 'Dirección del conductor',
        required: false
    })
    @IsString()
    @IsOptional()
    direccion?: string;

    @ApiProperty({ 
        description: 'Teléfono del conductor',
        required: false
    })
    @IsString()
    @IsOptional()
    telefono?: string;

    @ApiProperty({ 
        description: 'Correo electrónico del conductor',
        required: false
    })
    @IsString()
    @IsOptional()
    correo_electronico?: string;

    @ApiProperty({ 
        description: 'Clase de licencia de conducir',
        required: false
    })
    @IsString()
    @IsOptional()
    clase_licencia?: string;

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
    @IsEmpty()
    patente: string;

    @ApiProperty({ description: 'Tipo' })
    @IsString()
    @IsEmpty()
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

    @ApiProperty({ type: 'string'})
    @IsOptional()
    rut: string;
   
    @ApiProperty({ type: 'string', format: 'binary' })
    licencia_conductor_vigente: string;

    @ApiProperty({ type: 'string' })
    @IsOptional()
    fecha_de_vencimiento_licencia_conductor: String;

    @ApiProperty({ type: 'string' })
    @IsOptional()
    creado_por: string;
    
    @ApiProperty({ type: 'string', format: 'binary' })
    certificado_antecedentes_vigente: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    certificado_anotaciones_vigente: string;

    
}