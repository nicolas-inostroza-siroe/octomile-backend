import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity('drivers')
export class DriversEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({ type: 'varchar',nullable: true})
    rut: string;

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

    @Column({ type: 'varchar', nullable: true })
    tipo_identificacion: string;

    @Column({ type: 'varchar', nullable: true })
    direccion: string;

    @Column({ type: 'varchar', nullable: true })
    telefono: string;

    @Column({ type: 'varchar', nullable: true })
    correo_electronico: string;

    @Column({ type: 'varchar', nullable: true })
    clase_licencia: string;
  
    @Column({ type: 'varchar',nullable: true})
    permiso_circulacion: string;

    @Column({ type: 'varchar', nullable: true})
    fecha_de_vencimiento_permiso_circulacion: string;
  
    @Column({ type: 'varchar', nullable: true})
    revision_tecnica: string;
    
    @Column({ type: 'varchar', nullable: true})
    fecha_de_vencimiento_revision_tecnica: string;

    @Column({ type: 'varchar', nullable : true})
    soap_al_dia: string;

    @Column({ type: 'varchar' , nullable: true})
    fecha_de_vencimiento_soap: string;


    @Column({ type: 'varchar' , nullable: true})
    fotografia1: string;
  
    @Column({ type: 'varchar' , nullable: true})
    fotografia2: string;
    
    @Column({ type: 'varchar' , nullable: true})
    fotografia3: string;
  
    @Column({ type: 'varchar' , nullable: true})
    fotografia4: string;


    @Column({ type: 'varchar', nullable: true})
    ancho_vehiculo: string;
  
    @Column({ type: 'varchar',nullable: true})
    largo_vehiculo: string;

    @Column({ type: 'varchar',nullable: true})
    alto_vehiculo: string;

    @Column({ type: 'varchar', nullable: true})
    Carnet_de_identidad_vigente: string;

    @Column({ type: 'varchar', nullable: true})
    fecha_de_vencimiento_carnet_de_identidad: string;
  
    @Column({ type: 'varchar', nullable: true})
    licencia_conductor_vigente: string;
  
    @Column({ type: 'varchar', nullable: true})
    fecha_de_vencimiento_licencia_conductor: string;

    @Column({ type: 'varchar', nullable: true})
    certificado_anotaciones_vigente: string;
    
    @Column({ type: 'varchar', nullable: true})
    certificado_antecedentes_vigente: string;

    @Column('json', { nullable: true })

    documents: Record<string, string>;

    @Column({type: 'varchar'})
    status: string;

    @Column({type: 'varchar'})
    creado_por: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

}

