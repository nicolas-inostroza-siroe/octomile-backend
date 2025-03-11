import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { sessionDeliveryRoutesEntity } from './sessionDeliveryRoutes.entity';
import { SessionDetailEntity } from '../../sessions/entities/sessionDetails.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity('RouteDetails')
export class RouteDetailsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sessionDeliveryRoutesId: number;

    @Column('float')
    numProduct: number;

    @Column('varchar')
    bindProduct: string;

    @Column('varchar')
    patenteProducto: string;

    @Column('varchar')
    codigoProducto: string;

    @Column({ type: 'bool', default: false })
    fuePinchado: boolean;

    @Column({ type: 'varchar', nullable: true, default: null })
    fechaPinchado: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    codigoPinchazo: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    pinchadoPor: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    estado: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    userId: string;

    @Column('varchar')
    fechaRevisado: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    revisadoPor: string

    @Column({ type: 'int', nullable: true })
    sessionDetailsId: number;

    @ManyToOne(() => SessionDetailEntity, sessionDetail => sessionDetail.routeDetails)
    @JoinColumn({ name: 'sessionDetailsId' })
    sessionDetail: SessionDetailEntity;

    @ManyToOne(() => sessionDeliveryRoutesEntity, route => route.routeDetails)
    @JoinColumn({ name: 'sessionDeliveryRoutesId' })
    sessionDeliveryRoute: sessionDeliveryRoutesEntity;

    
    @ManyToOne(() => User, user => user.routeDetails)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => User, user => user.routeDetails, { nullable: true })
    @JoinColumn({ name: 'pinchadoPor' })
    pinchado: User;

    @ManyToOne(() => User, user => user.routeDetails, { nullable: true })
    @JoinColumn({ name: 'revisadoPor' })
    revisado: User;
}