import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { sessionDeliveryEntity } from './entities/sessiondelivery.entity';
import { sessionDeliveryRoutesEntity } from './entities/sessionDeliveryRoutes.entity';
import { DriversEntity } from '../drivers/entities/drivers.entity';
import { CreateSesionDeliveryDto } from './dto/createSessionDelivery.dto';
import { sessionDeliveryRoutesDto } from './dto/sessionDeliveryRoute.dto';
import { RouteDetailsDto } from './dto/routeDetails.dto';
import { RouteDetailsEntity } from './entities/RouteDetails.entity';
import { PinchazoDto } from './dto/pinchazo.dto';
import { webSocketGateway } from '../web-socket/web-socket.gateway';
import { User } from '../auth/entities/user.entity';

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
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly webSocketGateway: webSocketGateway,
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

         return sessions;
    }

    async findRoutesBySessionId(sessionId: number) {
        const routes = await this.deliveryContainRepository.find({
            where: { sessionDelivery_id: sessionId },
            relations: ['driver'], // Include driver relation
        });

        if (!routes.length) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: `No routes found for session with ID ${sessionId}`,
            });
        }

        // Map routes to include driver information if driverId is not null
        const routesWithDriverInfo = routes.map(route => {
            if (route.driverId) {
                return {
                    ...route,
                    driver: {
                        nombre_apellido: route.driver.nombre_apellido,
                        empresa: route.driver.empresa,
                        patente: route.driver.patente,
                    },
                };
            }
            return route;
        });

        return routesWithDriverInfo
    }

    async updateDriverForRoute(routeId: number, driverId: number, userId: string) {
        const route = await this.deliveryContainRepository.findOne({
            where: { id: routeId },
            });

        if (!route) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: `Route with ID ${routeId} not found`
            });
        }

        route.driverId = driverId;
        route.gestor = userId;
        await this.deliveryContainRepository.save(route);

        const updatedRoute = await this.deliveryContainRepository.findOne({
            where: { id: routeId },
            });

        return {
            status: HttpStatus.OK,
            message: 'Driver updated successfully for the route',
            data: {
                ...updatedRoute,
                driver: {
                    nombre_apellido: updatedRoute.driver.nombre_apellido,
                    empresa: updatedRoute.driver.empresa,
                    patente: updatedRoute.driver.patente,
                },
                gestor: updatedRoute.gestor // Assuming userId is the name of the gestor
            }
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

        return routeDetails;
    }

    async pincharProducto(pinchazoDto: PinchazoDto) {
        const { codigoProducto, idRoute, pinchadoPor } = pinchazoDto;

        const route = await this.deliveryContainRepository.findOne({
            where: { id: idRoute },
            relations: ['routeDetails']
        });

        if (!route) throw new BadRequestException(`Route with ID ${idRoute} not found`);

        const exist = route.routeDetails.some(
            detail => detail.codigoProducto === codigoProducto
        );

        if (!exist) {
            return {
                message: 'Product not exist',
                status: HttpStatus.CONFLICT
            };
        }

        const alreadyScanned = route.routeDetails.some(
            detail => detail.codigoProducto === codigoProducto && detail.fuePinchado === true
        );

        if (alreadyScanned) {
            return {
                message: 'Product already scanned',
                status: HttpStatus.CONFLICT
            };
        }

        const pinchadoPorIds = [...new Set(route.routeDetails
            .map(detail => detail.pinchadoPor))];

        if (!pinchadoPorIds.includes(pinchadoPor)) {
            const user = await this.userRepository.findOne({
                where: { id: pinchadoPor }
            });

            if (!user) {
                throw new NotFoundException({
                    status: HttpStatus.NOT_FOUND,
                    message: `User with ID ${pinchadoPor} not found`
                });
            }
        }

        const routeDetail = route.routeDetails.find(
            detail => detail.codigoProducto === codigoProducto
        );

        routeDetail.fuePinchado = true;
        routeDetail.fechaPinchado = new Date().toISOString();
        routeDetail.pinchadoPor = pinchadoPor;

        await this.routeDetailsRepository.save(routeDetail);

        this.webSocketGateway.emitProductScanned(idRoute, {
            codigoProducto,
            idRoute,
            pinchadoPor
        });


        return {
            message: 'Product scanned successfully',
            status: HttpStatus.OK
        };
    }
}
