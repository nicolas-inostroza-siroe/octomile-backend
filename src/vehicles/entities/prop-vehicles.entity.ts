import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { VehicleEntity } from "./vehicles.entity"; // Corregido a vehicles.entity

export enum TipoIdentificacion {
  RUT = 'RUT',
  CI = 'CI',
  PASAPORTE = 'Pasaporte',
  DNI = 'DNI'
}

@Entity('vehiculos_propietarios')
export class PropietarioVehiculoEntity {
  @PrimaryGeneratedColumn()
  id_propietario: number;

  @Column({ type: 'varchar' })
  nombre_completo: string;

  @Column({
    type: 'enum',
    enum: TipoIdentificacion,
    default: TipoIdentificacion.RUT
  })
  tipo_identificacion: TipoIdentificacion;

  @Column({ type: 'varchar' })
  numero_identificacion: string;

  @Column({ type: 'varchar' })
  telefono: string;

  @Column({ type: 'varchar' })
  correo_electronico: string;

  @Column({ type: 'varchar' })
  direccion: string;

  @Column({ type: 'varchar', nullable: true })
  comuna: string;

  @Column({ type: 'varchar', nullable: true })
  ciudad: string;

  @Column({ type: 'varchar' })
  status: string;
  
  @Column({ type: 'varchar' })
  creado_por: string;

  @CreateDateColumn()
  fecha_registro: Date;
  
  @UpdateDateColumn()
  fecha_actualizacion: Date;


}