import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  rut: string;

  @Column({ type: 'varchar' })
  razonSocial: string;

  @Column({ type: 'varchar'})
  direccion: string;

  @Column({ type: 'varchar'})
  comuna: string;

  @Column({ type: 'varchar'})
  telefono: string;

  @Column({ type: 'varchar'})
  correo: string;

  @Column({ type: 'varchar' })
  banco: string;

  @Column({ type: 'varchar'})
  tipoCuenta: string;

  @Column({ type: 'varchar'})
  numeroCuenta: string;

  @Column({ type: 'varchar' })
  titular: string;

  @Column({ type: 'varchar' })
  rutTitular: string;

  @Column({ type: 'varchar' })
  rutRepresentante: string;

  @Column({ type: 'varchar' })
  nombreRepresentante: string;

  @Column({ type: 'varchar' })
  direccionRepresentante: string;

  @Column({ type: 'varchar'})
  comunaRepresentante: string;

  @Column({ type: 'varchar'})
  direccionFisica: string;

  @Column({ type: 'varchar'})
  status: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}