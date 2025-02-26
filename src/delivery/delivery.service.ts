import { Injectable, NotFoundException } from '@nestjs/common';
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
            fecha: createSessionDeliveryDto.fecha, // No need to convert to Date
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
                    fechaPinchado: guiaDto.fechaPinchado 
                });

                await this.routeDetailsRepository.save(routeDetail);
            }
        }

        return {
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
            throw new NotFoundException(`Session with ID ${sessionId} not found`);
        }

        const route = this.deliveryContainRepository.create({
            ...sessionDeliveryRouteDto,
            sessionDelivery_id: session.id
        });

        return await this.deliveryContainRepository.save(route);
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
            throw new NotFoundException(`Route with ID ${routeId} not found`);
        }

        const routeDetail = this.routeDetailsRepository.create({
            ...routeDetailsDto,
            
        });

        return await this.routeDetailsRepository.save(routeDetail);
    }

    async findAll(): Promise<sessionDeliveryEntity[]> {
        const sessions = await this.deliveryRepository.find({
            relations: ['routes', 'routes.routeDetails'],
            order: {
                id: 'DESC'
            }
        });

        if (!sessions.length) {
            throw new NotFoundException('No session deliveries found');
        }

        return sessions;
    }

}
