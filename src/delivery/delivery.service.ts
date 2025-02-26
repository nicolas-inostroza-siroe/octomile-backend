import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sessionDeliveryEntity } from './entities/sessiondelivery.entity';
import { sessionDeliveryRoutesEntity } from './entities/sessionDeliveryRoutes.entity';
import { DriversEntity } from '../drivers/entities/drivers.entity';
import { CreateSesionDeliveryDto } from './dto/createSessionDelivery.dto';
import { sessionDeliveryRoutesDto } from './dto/sessionDeliveryRoute.dto';
import { RouteDetailsDto } from './dto/routeDetails.dto';
import { RouteDetailsEntity } from './entities/RouteDetails.entity';

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(sessionDeliveryEntity)
        private readonly deliveryRepository: Repository<sessionDeliveryEntity>,
        @InjectRepository(sessionDeliveryRoutesEntity)
        private readonly deliveryContainRepository: Repository<sessionDeliveryRoutesEntity>,
        @InjectRepository(DriversEntity)
        private readonly driversRepository: Repository<DriversEntity>,
        @InjectRepository(RouteDetailsEntity)
        private readonly routeDetailsRepository: Repository<RouteDetailsEntity>,
    ) {}

    async createSessionDelivery(createSessionDeliveryDto: CreateSesionDeliveryDto) {
        const sessionDelivery = this.deliveryRepository.create({
            ...createSessionDeliveryDto,
            fecha: createSessionDeliveryDto.fecha, // Dates are now strings
        });

        const savedSession = await this.deliveryRepository.save(sessionDelivery);

        for (const routeDto of createSessionDeliveryDto.routes) {
            const route = this.deliveryContainRepository.create({
                numero: routeDto.numero,
                patente: routeDto.patente,
                sessionDelivery_id: savedSession.id,
                status: routeDto.status,
            });

            const savedRoute = await this.deliveryContainRepository.save(route);

            for (const guiaDto of routeDto.guias) {
                const routeDetail = this.routeDetailsRepository.create({
                    ...guiaDto,
                    sessionDeliveryRoutesId: savedRoute.id,
                    fechaPinchado: guiaDto.fechaPinchado || null
                });

                await this.routeDetailsRepository.save(routeDetail);
            }
        }

        return {
            status: HttpStatus.OK,
            message: 'Session delivery created successfully',
            data: savedSession
        };
    }

    


    async createSessionDeliveryRoute(
        sessionId: number,
        sessionDeliveryRouteDto: sessionDeliveryRoutesDto
    ) {
        const session = await this.deliveryRepository.findOne({
            where: { id: sessionId }
        });

        if (!session) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: `Session with ID ${sessionId} not found`
            });
        }

        const route = this.deliveryContainRepository.create({
            ...sessionDeliveryRouteDto,
            sessionDelivery_id: session.id
        });

        const savedRoute = await this.deliveryContainRepository.save(route);

        return {
            status: HttpStatus.OK,
            message: 'Delivery route created successfully',
            data: savedRoute
        };
    }

    async addRouteDetails(
        routeId: number,
        routeDetailsDto: RouteDetailsDto
    ) {
        const route = await this.deliveryContainRepository.findOne({
            where: { id: routeId },
            relations: ['routeDetails']
        });

        if (!route) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: `Route with ID ${routeId} not found`
            });
        }

        const routeDetail = this.routeDetailsRepository.create({
            ...routeDetailsDto,
            sessionDeliveryRoutesId: route.id,
            fechaPinchado: routeDetailsDto.fechaPinchado || null,
            codigoPinchazo: routeDetailsDto.codigoPinchazo || null,
            pinchadoPor: routeDetailsDto.PinchadoPor || null,
            estado: routeDetailsDto.estado || null,
            userId: routeDetailsDto.userId || null,
            fuePinchado: routeDetailsDto.fuePinchado || false
        });

        const savedDetail = await this.routeDetailsRepository.save(routeDetail);

        return {
            status: HttpStatus.OK,
            message: 'Route detail added successfully',
            data: savedDetail
        };
    }

    async findAll(): Promise<sessionDeliveryEntity[]> {
        const sessions = await this.deliveryRepository.find({
            relations: ['routes', 'routes.routeDetails'],
            order: {
                id: 'DESC'
            }
        });

        if (!sessions.length) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: 'No session deliveries found'
            });
        }

        return {
            status: HttpStatus.OK,
            message: 'Session deliveries retrieved successfully',
            data: sessions
        } as any;
    }

    async findRoutesBySessionId(sessionId: number) {
        const routes = await this.deliveryContainRepository.find({
            where: { sessionDelivery_id: sessionId },
            relations: ['routeDetails'], });

        if (!routes.length) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: `No routes found for session with ID ${sessionId}`,
            });
        }

        return {
            status: HttpStatus.OK,
            message: 'Routes retrieved successfully',
            data: routes,
        };
    }

    async findRouteDetailsByRouteId(routeId: number) {
        const routeDetails = await this.routeDetailsRepository.find({
            where: { sessionDeliveryRoutesId: routeId },
        });

        if (!routeDetails.length) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: `No route details found for route with ID ${routeId}`,
            });
        }

        return {
            status: HttpStatus.OK,
            message: 'Route details retrieved successfully',
            data: routeDetails,
        };
    }
}
