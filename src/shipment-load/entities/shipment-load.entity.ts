
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, BeforeUpdate } from "typeorm";
import { InitialLoadEntity } from "./initial-load.entity";
import { ShipmentUpdateEntity } from './shipment-update.entity';


@Entity('shipment_load')
export class ShipmentLoadEntity {

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
        () => InitialLoadEntity,
        (initialLoad) => initialLoad.shipmentLoad,
        { cascade: true, eager: false }
    )
    initialLoad: InitialLoadEntity[];


    @OneToMany(
        () => ShipmentUpdateEntity,
        (shipmentUpdate) => shipmentUpdate.initialUpdate,
        { cascade: true, eager: false }
    )
    updateLoad: ShipmentUpdateEntity[];


    @BeforeInsert()
    setTime() {
        this.initialLoadDate = new Date();
    }

    @BeforeUpdate()
    updateTime() {
        this.lastUpdateDate = new Date();
    }

}
