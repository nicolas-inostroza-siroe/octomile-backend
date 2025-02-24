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

    //Parametros faltantes

   }


