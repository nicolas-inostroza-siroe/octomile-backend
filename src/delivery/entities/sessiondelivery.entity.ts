import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/auth/entities/user.entity";
import { SessionEntity } from "src/sessions/entities/session.entity"; // Asegúrate de importar correctamente
import { sessionDeliveryRoutesEntity } from "./sessionDeliveryRoutes.entity";
import { SessionDetailEntity } from "src/sessions/entities/sessionDetails.entity";

@Entity('sessionDelivery')
export class sessionDeliveryEntity { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    fecha: string;

    @Column()
    propietario: string;

    @ManyToOne(() => User, user => user.sessionDelivery)
    @JoinColumn({ name: 'propietario' })
    user: User;

    @ManyToOne(() => SessionEntity, session => session.sessionDelivery)
    @JoinColumn({ name: 'sessionId' })
    session: SessionEntity;

    @OneToMany(() => sessionDeliveryRoutesEntity, route => route.sessionDelivery)
    routes: sessionDeliveryRoutesEntity[];
}
