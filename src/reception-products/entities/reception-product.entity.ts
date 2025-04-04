import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('receptionProduct')
export class ReceptionProduct {
    @PrimaryGeneratedColumn()
    id:number;

    @Column('varchar')
    guia: string;
    
    @Column({type: 'varchar', nullable: true})
    codigo: string;
    
    @Column({type: 'varchar', nullable: true})
    codigoDos: string;
    
    @Column({type: 'varchar', nullable: true})
    empresa: string;
    
    @Column({type: 'varchar', nullable: true})
    conductor: string;

    @Column({type: 'varchar', nullable: true})
    patente: string;

    @Column({type: 'date', nullable: true})
    fechaCreacion: Date;

    @Column({type: 'date', nullable: true})
    fechaSalida: Date;

    @Column({type: 'datetime', nullable: true})
    fechaGestion: Date;

    @Column({type: 'int'})
    diasAtraso: number;

    @Column({type: 'varchar', nullable: true})
    origen: string;

    @Column({type: 'text', nullable: true})
    motivo: string;

    @Column({type: 'varchar', nullable: true})
    estado: string;

    @Column({type: 'varchar', nullable: true})
    gestorId: string;

    @Column({type: 'varchar', nullable: true})
    destino: string;

    @Column({type: 'text', nullable: true})
    lugarFisico: string;

    @Column({type: 'varchar', nullable: true})
    estadoPorGestor: string;

    @Column({type: 'datetime', nullable: true})
    fechaIngreso: Date;

}
