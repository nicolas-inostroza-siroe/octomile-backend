import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShipmentLoadEntity } from "./shipment-load.entity";

@Entity('shipment_update')
export class ShipmentUpdateEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
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

    // @Column('varchar')
    @ManyToOne(
        () => ShipmentLoadEntity,
        (shipmentLoad) => shipmentLoad.updateLoadId
    )
    bAGID: string;


}