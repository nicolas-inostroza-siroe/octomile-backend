import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { sessionDeliveryRoutesEntity } from "./sessionDeliveryRoutes.entity";


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



}