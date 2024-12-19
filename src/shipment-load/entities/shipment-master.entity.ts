
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, BeforeUpdate } from "typeorm";
import { ShipmentLoadEntity } from "./shipment-load.entity";



@Entity('shipment_master')
export class ShipmentMasterEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('date', {
        name: 'initial_load_date',
    })
    initialLoadDate: Date;

    @Column('date', {
        name: 'last_update_date',
        nullable: true
    })
    lastUpdateDate?: Date;

    @Column('date', {
        name: 'entry_date',

    })
    entryDate: Date;

    @Column('varchar', {
        name: 'folio',
        unique: true
    })
    folio: string;


    @Column('varchar', {
        name: 'cliente',
    })
    cliente: string


    @OneToMany(
        () => ShipmentLoadEntity,
        (shipmentLoad) => shipmentLoad.shipmentMaster,
        { cascade: true, eager: false }
    )
    shipmentLoad: ShipmentLoadEntity[];


    // @BeforeInsert()
    // setTime() {
    //     this.initialLoadDate = new Date();
    // }



}
