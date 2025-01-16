import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { SessionEntity } from "./session.entity";
import { User } from '../../auth/entities/user.entity';

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
        default: null
    })
    PinchadoPor: string;


    @ManyToOne(
        () => SessionEntity,
        (SessionEntity) => SessionEntity.sessionDetail,
        { eager: false }
    )
    idSesion: SessionEntity

    @ManyToOne(
        () => User,
        { eager: false }
    )
    user: User

}