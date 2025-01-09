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

    @ManyToOne(
        () => SessionEntity,
        (SessionEntity) => SessionEntity.sessionDetail,
        { eager: false }
    )
    idSesion: SessionEntity


}