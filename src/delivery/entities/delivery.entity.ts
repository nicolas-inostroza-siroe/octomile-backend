import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DeliveryContainEntity } from "./delivery-contain.entity";


@Entity('delivery')
export class DeliveryEntity { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar'})
    patente_generica: string;

    @Column({ type: 'varchar'})
    patente_real: string;

    @Column({ type: 'varchar'})
    conductor: string;

    @Column({ type: 'varchar'})
    empresa_asociada: string;

    @Column({ type: 'varchar'})
    destino_ruta: string;

    @Column({ type: 'varchar'})
    guias: string;
    

    @Column({ type: 'varchar'})
    status: string;

    @Column({ type: 'varchar'})
    gestor:string;


    @OneToMany(() => DeliveryContainEntity, (deliveryContain) => deliveryContain.id)
    deliveryContains: DeliveryContainEntity[];

}