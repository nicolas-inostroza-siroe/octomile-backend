import { DriversEntity } from "src/drivers/entities/drivers.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";




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


    @ManyToOne(() => DriversEntity)
    @JoinColumn({ name: 'driverId' })
    driver: DriversEntity;

}


