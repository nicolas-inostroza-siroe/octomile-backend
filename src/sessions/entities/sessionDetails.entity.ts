import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { SessionEntity } from "./session.entity";


@Entity('Session-details')
export class SessionDetailEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('float')
    numProduct: number;

    @Column('varchar')
    bindProduct: string;

    @Column('varchar')
    patenteProducto: string;

    @Column('varchar')
    codigoProducto: string;

    @Column('bool', {
        default: false
    })
    fuePinchado: boolean;


    @Column('varchar', {
        default: null
    })
    fechaPinchado?: Date


    @Column('varchar', {
        default: null
    })
    codigoPinchazo?: string
     
    @Column('uuid', {
        nullable: false
    })
    PinchadoPor: string;


    @ManyToOne(
        () => SessionEntity,
        (SessionEntity) => SessionEntity.sessionDetail,
        { eager: false }
    )
    idSesion: SessionEntity


}