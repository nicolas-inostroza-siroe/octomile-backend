import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";




@Entity('delivery_contain')
export class DeliveryContainEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar'})
    n_producto: string;

    @Column({ type: 'varchar'})
    Bind_producto: string;

    @Column({ type: 'varchar'})
    patente_producto: string;

    @Column({ type: 'varchar'})
    codigo_producto: string; 
}


