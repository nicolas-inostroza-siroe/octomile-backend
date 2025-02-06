import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('drivers')
export class DriversEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({ type: 'varchar'})
    nombre_apellido: string;
  
    @Column({ type: 'varchar'})
    usuario: string;
  
    @Column({ type: 'varchar'})
    conductor_nombre_geosort: string;
  
    @Column({ type: 'varchar'})
    empresa: string;
  
    @Column({ type: 'varchar'})
    patente: string;
  
    @Column({ type: 'varchar'})
    tipo: string;
  
    @Column({ type: 'varchar'})
    permiso_circulacion: string;

    @Column({ type: 'varchar'})
    fecha_de_vencimiento_permiso_circulacion: string;
  
    @Column({ type: 'varchar'})
    revision_tecnica: string;
    
    @Column({ type: 'varchar'})
    fecha_de_vencimiento_revision_tecnica: string;

    @Column({ type: 'varchar'})
    soap_al_dia: string;

    @Column({ type: 'varchar'})
    fecha_de_vencimiento_soap: string;


    @Column({ type: 'varchar'})
    fotografia1: string;
  
    @Column({ type: 'varchar'})
    fotografia2: string;
    
    @Column({ type: 'varchar'})
    fotografia3: string;
  
    @Column({ type: 'varchar'})
    fotografia4: string;


    @Column({ type: 'varchar'})
    ancho_vehiculo: string;
  
    @Column({ type: 'varchar'})
    largo_vehiculo: string;

    @Column({ type: 'varchar'})
    alto_vehiculo: string;

    @Column({ type: 'varchar'})
    Carnet_de_identidad_vigente: string;

    @Column({ type: 'varchar'})
    fecha_de_vencimiento_carnet_de_identidad: string;
  
    @Column({ type: 'varchar'})
    licencia_conductor_vigente: string;
  
    @Column({ type: 'varchar'})
    fecha_de_vencimiento_licencia_conductor: string;

    @Column({ type: 'varchar'})
    certificado_anotaciones_vigente: string;
    
    @Column({ type: 'varchar'})
    certificado_antecedentes_vigente: string;

    @Column('json', { nullable: true })

    documents: Record<string, string>;

    @Column({type: 'varchar'})
    status: string;

}

