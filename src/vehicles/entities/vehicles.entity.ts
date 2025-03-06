import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PropietarioVehiculoEntity } from "./prop-vehicles.entity";
import { DriversEntity } from "src/drivers/entities/drivers.entity";

export enum TipoVehiculo {
  AUTO = 'Auto',
  FURGON = 'Furgon',
  CAMION = 'Camion',
  TRACTO = 'Tracto',
  RAMPLA = 'Rampla'
}

export enum EstadoVehiculo {
  ACTIVO = 'Activo',
  INACTIVO = 'Inactivo',
  MANTENIMIENTO = 'Mantenimiento'
}

@Entity('vehiculos')
export class VehicleEntity {
  @PrimaryGeneratedColumn()
  id_vehiculo: number;

  @Column({ type: 'int', nullable: true })
  id_empresa: number;

  @Column({ type: 'int' })
  id_propietario: number;

  @Column({ type: 'int', nullable: true })
  id_poliza: number;

  @Column({ type: 'varchar', unique: true })
  patente: string;

  @Column({
    type: 'enum',
    enum: TipoVehiculo,
    default: TipoVehiculo.CAMION
  })
  tipo_vehiculo: TipoVehiculo;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  capacidad_carga_kg: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  volumen_carga_m3: number;

  @Column({ type: 'varchar' })
  marca: string;

  @Column({ type: 'varchar' })
  modelo: string;

  @Column({ type: 'int' })
  ano_fabricacion: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  largo_m: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ancho_m: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  alto_m: number;

  @Column({ type: 'date', nullable: true })
  fecha_venc_revision_tecnica: Date;

  @Column({ type: 'date', nullable: true })
  fecha_venc_permiso_circulacion: Date;

  @Column({ type: 'date', nullable: true })
  fecha_venc_seguro_obligatorio: Date;

  @Column({
    type: 'enum',
    enum: EstadoVehiculo,
    default: EstadoVehiculo.ACTIVO
  })
  estado: EstadoVehiculo;

  @Column({ type: 'boolean', default: false })
  gps_activo: boolean;

  @Column({ type: 'varchar', nullable: true })
  fotografia1: string;

  @Column({ type: 'varchar', nullable: true })
  fotografia2: string;

  @Column({ type: 'varchar', nullable: true })
  fotografia3: string;

  @Column({ type: 'varchar', nullable: true })
  fotografia4: string;

  @Column('json', { nullable: true })
  documentos: Record<string, string>;

  @Column({ type: 'varchar' })
  creado_por: string;

  @CreateDateColumn()
  fecha_registro: Date;
  
  @UpdateDateColumn()
  fecha_actualizacion: Date;

  // Relaciones
  @ManyToOne(() => PropietarioVehiculoEntity, propietario => propietario.vehiculos)
  @JoinColumn({ name: 'id_propietario' })
  propietario: PropietarioVehiculoEntity;

}