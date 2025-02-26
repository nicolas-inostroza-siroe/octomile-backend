import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('RouteDetails') 
export class RouteDetailsEntity { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sessionDeliveryRoutesId: number;

    @Column('float')
    numProduct:number;

    @Column('varchar')
    bindProduct: string;

    @Column('varchar')
    patenteProducto: string;

    @Column('varchar')
    codigoProducto: string;

    @Column({ type: 'bool', default: false })
    fuePinchado: boolean;

    @Column({ type: 'varchar', nullable: true, default: null })
    fechaPinchado: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    codigoPinchazo: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    pinchadoPor: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    estado: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    userId: string;
}