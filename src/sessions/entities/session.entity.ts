import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SessionDetailEntity } from "./sessionDetails.entity";


@Entity('sessions')
export class SessionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('varchar')
    tipo: string

    @Column('date')
    fecha: Date;

    @Column('varchar')
    status: string;

    @Column('varchar')
    propietario: string;

    @OneToMany(
        () => SessionDetailEntity,
        (detailSession) => detailSession.idSesion,
        { cascade: true, eager: false }
    )
    sessionDetail: SessionDetailEntity[]

}
