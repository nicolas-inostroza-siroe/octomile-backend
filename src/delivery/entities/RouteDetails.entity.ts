import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('RouteDetails') 
export class RouteDetailsEntity { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sessionDeliveryRoutesId: number;

    @Column()
    numProduct:number;

    @Column()
    bindProduct: string;

    @Column()
    patenteProducto: string;

    @Column()
    codigoProducto: string;

    @Column()
    fuePinchado:string;

    @Column()
    fechaPinchado: Date;

    @Column()
    codigoPinchazo: string;

    @Column()
    pinchadoPor: string;

    @Column()
    estado: string;

    @Column()
    user: string;

    @Column()
    userName: string;

    @Column()
    pinchadoPorName: string;

}