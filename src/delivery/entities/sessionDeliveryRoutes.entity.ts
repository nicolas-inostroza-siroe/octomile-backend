import { DriversEntity } from "src/drivers/entities/drivers.entity";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RouteDetailsEntity } from "./RouteDetails.entity";
import { User } from "src/auth/entities/user.entity";
import { sessionDeliveryEntity } from "./sessiondelivery.entity";
import { VehicleEntity } from "src/vehicles/entities/vehicles.entity";




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

    @Column({type: 'int', nullable: true})
    patenteId: number;

    @Column()
    bind:string;

    @ManyToOne(() => DriversEntity)
    @JoinColumn({ name: 'driverId' })
    driver: DriversEntity;

    @ManyToOne(() => VehicleEntity)
    @JoinColumn({ name: 'patenteId'})
    Patente: VehicleEntity;


    @ManyToOne(() => User)
    @JoinColumn({ name: 'gestor' })
    user: User

    @ManyToOne(() => sessionDeliveryEntity, sessionDelivery => sessionDelivery.routes)
    @JoinColumn({ name: 'sessionDelivery_id' })
    sessionDelivery: sessionDeliveryEntity;

    @OneToMany(() => RouteDetailsEntity, detail => detail.sessionDeliveryRoute)
    routeDetails: RouteDetailsEntity[];
}


