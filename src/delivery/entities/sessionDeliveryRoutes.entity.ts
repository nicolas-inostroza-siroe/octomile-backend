import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";




@Entity('sessionDeliveryRoutes')
export class sessionDeliveryRoutesEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numero: string;

    @Column()
    patente:string;

    @Column()
    sessionDelivery_id: number;

    @Column()
    status:string;

    @Column({ type: 'varchar', nullable: true, default: null })
    gestor:string;

    @Column({ type: 'varchar', nullable: true, default: null })
    gestion:string;



   }


