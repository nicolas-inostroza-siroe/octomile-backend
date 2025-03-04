import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SessionDetailEntity } from "./sessionDetails.entity";
import { sessionDeliveryEntity } from "src/delivery/entities/sessiondelivery.entity";


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

    @OneToMany(() => sessionDeliveryEntity, sessionDelivery => sessionDelivery.session)
    sessionDelivery: sessionDeliveryEntity[];
}
