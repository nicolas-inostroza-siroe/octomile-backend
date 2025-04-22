import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('receptionProduct')
export class ReceptionProduct {
    @PrimaryGeneratedColumn()
    id:number;

    @Column('varchar')
    guia: string;
    
    @Column({type: 'varchar', nullable: true})
    codigo: string;
    
    @Column({type: 'varchar', nullable: true})
    codigoDos: string;
    
    @Column({type: 'varchar', nullable: true})
    trackingId: string;

    @Column({type: 'varchar', nullable: true})
    referenceId: string;
    
    @Column({type: 'varchar', nullable: true})
    conductor: string;
    
    @Column({type: 'varchar', nullable: true})
    vehiculo: string;

    @Column({type: 'varchar', nullable: true})
    titulo: string;
    
    @Column({type: 'varchar', nullable: true})
    direccion: string;
    
    @Column({type: 'varchar', nullable: true})
    eta: Date;
    
    @Column({type: 'varchar', nullable: true})
    personaResponsable: string;

    @Column({type: 'varchar', nullable: true})
    tiempoEstimado: string;    
    
    @Column({type: 'varchar', nullable: true})
    tiempoReal: string;    
    
    @Column({type: 'varchar', nullable: true})
    avance: string;    
    @Column({type: 'varchar', nullable: true})
    retraso: string;    
    @Column({type: 'varchar', nullable: true})
    latitud: string;    
    @Column({type: 'varchar', nullable: true})
    longitud: string;    
    @Column({type: 'varchar', nullable: true})
    checkoutLatitud: string;    
    @Column({type: 'varchar', nullable: true})
    checkoutLongitud: string;    
    @Column({type: 'text', nullable: true})
    nota: string;    
    @Column({type: 'varchar', nullable: true})
    nombreContacto: string;    
    @Column({type: 'varchar', nullable: true})
    telefonoContacto: string;    
    @Column({type: 'varchar', nullable: true})
    correoContacto: string;    
    @Column({type: 'varchar', nullable: true})
    rutaId: string;
    
    @Column({type: 'varchar', nullable: true})
    origenId: string;
    @Column({type: 'varchar', nullable: true})
    documento: string;
    @Column({type: 'text', nullable: true})
    fotografiaFachada: string;
    @Column({type: 'varchar', nullable: true})
    pais: string;
    @Column({type: 'varchar', nullable: true})
    comercio: string;
    @Column({type: 'date', nullable: true})
    fechaCreacion: Date;

    @Column({type: 'date', nullable: true})
    fechaSalida: Date;

    @Column({type: 'datetime', nullable: true})
    fechaGestion: Date;

    @Column({type: 'varchar', nullable: true})
    origen: string;

    @Column({type: 'text', nullable: true})
    motivo: string;
    
    @Column({type: 'text', nullable: true})
    observacion: string;

    @Column({type: 'varchar', nullable: true})
    estado: string;

    @Column({type: 'varchar', nullable: true})
    escaneadorId: string;

    @Column({type: 'datetime', nullable: true})
    fechaEscaneo: Date;
    
    @Column({type: 'text', nullable: true})
    lugarFisico: string;
    
    @Column({type: 'varchar', nullable: true})
    estadoPorGestor: string;
    
    @Column({type: 'datetime', nullable: true})
    fechaIngreso: Date;

    @Column({type: 'varchar', nullable: true})
    gestorDestinoId: string;
    
    @Column({type: 'datetime', nullable: true})
    fechaDestino: Date;
    
    @Column({type: 'varchar', nullable: true})
    destino: string;
    
    @Column({type: 'varchar', nullable: true})
    repetido: string;
}