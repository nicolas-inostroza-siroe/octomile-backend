import { col } from "sequelize";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ShipmentLoadEntity } from "./shipment-load.entity";

@Entity('initial_load')
export class InitialLoadEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        unique: true
    })
    trackingID: number;

    @Column('int')
    consecutive: number;

    @Column('varchar', {
        unique: true
    })
    carrierReferenceID: string;

    @Column('varchar')
    shipperName: string;

    @Column('varchar')
    shipperCity: string;

    @Column('varchar')
    shipperCountry: string;

    @Column('varchar')
    consigneeName: string;

    @Column('varchar')
    consigneeAddress: string;

    @Column('varchar')
    consigneeState: string;

    @Column('varchar')
    consigneeCity: string;

    @Column('varchar')
    consigneeCountry: string;

    @Column('varchar')
    consigneePhone: string;

    @Column('varchar')
    consigneeEMail: string;

    @Column('varchar')
    contentDescription: string;

    @Column('float')
    declaredValueUSD: number;

    @Column('float')
    grossWeightKilos: number;

    @Column('int')
    pieces: number;

    @Column('varchar')
    consigneeTaxID: string;

    @Column('int')
    codArancel: number;

    @Column('float')
    freightValue: number;

    @Column('varchar')
    idExterno: string;

    @Column('varchar')
    productUrl: string;

    @Column('varchar')
    bagId: string;

    @Column('bool', {
        default: false
    })
    isConfirm: boolean;

    @Column('varchar', {
        default: '0000',
    })
    statusCode: string

    @ManyToOne(
        () => ShipmentLoadEntity,
        (shipmentLoad) => shipmentLoad.initialLoad
    )
    shipmentLoad: ShipmentLoadEntity
}