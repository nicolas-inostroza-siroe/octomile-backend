import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShipmentMasterEntity } from "./shipment-master.entity";


@Entity('shipment_load')
export class ShipmentLoadEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {
        unique: true,
    })
    idSistema: number;

    @Column('varchar')
    masterVuelo: string;

    @Column('varchar')
    masterTransportista: string;

    @Column('varchar')
    masterNro: string;

    @Column('varchar')
    masterFecha: string;

    @Column('int')
    nroManifiesto: number;

    @Column('int')
    viaTransporte: number;

    @Column('varchar')
    fechaArribo: string;

    @Column('float')
    pesoDeclarado: number;

    @Column('varchar')
    locacionEmbarque: string;

    @Column('varchar')
    locacionDesembarque: string;

    @Column('varchar')
    locacionEntrega: string;

    @Column('varchar')
    locacionRecepcion: string;

    @Column('varchar')
    hawb: string;

    @Column('varchar')
    fechaIngreso: string;

    @Column('varchar')
    codigoBarra: string;

    @Column('varchar')
    destinatarioNombre: string;

    @Column('varchar')
    destinatarioDireccion: string;

    @Column('varchar')
    destinatarioCiudad: string;

    @Column('varchar')
    destinatarioPais: string;

    @Column('varchar')
    destinatarioTelefono: string;

    @Column('varchar')
    destinatarioEmail: string;

    @Column('varchar')
    destinatarioRut: string;

    @Column('varchar')
    contenido: string;

    @Column('float')
    valorUsd: number;

    @Column('float')
    pesoBruto: number;

    @Column('int')
    cantidad: number;

    @Column('varchar')
    estado: string;

    @Column('varchar')
    estadoCorto: string;

    @Column('float')
    flete: number;

    @Column('varchar')
    idExterno: string;

    @Column({ type: 'boolean', default: false })
    isConfirm: boolean;

    @Column({ type: 'boolean', default: true })
    isActive: boolean

    @Column('varchar', {
        default: '0000',
    })
    statusCode: string

    @Column('varchar')
    @ManyToOne(
        () => ShipmentMasterEntity,
        (shipmentMaster) => shipmentMaster.shipmentLoad,
        { eager: false }
    )
    shipmentMaster: string;


}