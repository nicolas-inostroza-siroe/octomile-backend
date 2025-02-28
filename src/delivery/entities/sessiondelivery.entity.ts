import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { sessionDeliveryRoutesEntity } from "./sessionDeliveryRoutes.entity";
import { User } from "src/auth/entities/user.entity";


@Entity('sessionDelivery')
export class sessionDeliveryEntity { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    fecha: string;

    @Column()
    propietario: string

    @ManyToOne(() => User, user => user.sessionDelivery)
    @JoinColumn({name: 'propietario'})
    user: User

}