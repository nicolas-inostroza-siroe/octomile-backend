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
    fuePinchado:boolean;

    @Column({nullable:true})
    fechaPinchado: string;

    @Column({nullable:true})
    codigoPinchazo: string;

    @Column({nullable:true})
    pinchadoPor: string;

    @Column({nullable:true})
    estado: string;

    @Column({nullable:true})
    userId: string;

}