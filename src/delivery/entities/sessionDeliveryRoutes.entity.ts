import { DriversEntity } from "src/drivers/entities/drivers.entity";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RouteDetailsEntity } from "./RouteDetails.entity";
import { User } from "src/auth/entities/user.entity";




@Entity('sessionDeliveryRoutes')
export class sessionDeliveryRoutesEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numero: string;

    @Column()
    patente: string;

    @Column()
    sessionDelivery_id: number;

    @Column()
    status: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    gestor: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    gestion: string;

    @Column({ type: 'int', nullable: true })
    driverId: number;

    @Column()
    bind:string;

    @ManyToOne(() => DriversEntity)
    @JoinColumn({ name: 'driverId' })
    driver: DriversEntity;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'gestor' })
    user: User

    @OneToMany(() => RouteDetailsEntity, detail => detail.sessionDeliveryRoute)
    routeDetails: RouteDetailsEntity[];
}


