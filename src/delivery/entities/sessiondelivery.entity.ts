import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('sessionDelivery')
export class sessionDeliveryEntity { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    fecha: Date;

    @Column()
    propietario: string
}