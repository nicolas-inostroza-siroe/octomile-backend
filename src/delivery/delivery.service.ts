import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm';
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
import { SessionEntity } from 'src/sessions/entities';
import { ChangeStatusDto } from 'src/sessions/dto/change-status.dto';
import { PinchazoDisDto } from './dto/pinchazo-dis.dto';
// import { CommonService } from 'src/common/common.service';

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
        @InjectRepository(SessionEntity)
        private readonly sessionsRepository: Repository<SessionEntity>,
        // private readonly commonService: CommonService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager
    ) { }

    async createSessionDelivery(createSessionDeliveryDto: CreateSesionDeliveryDto) {
        const sessionDelivery = this.deliveryRepository.create({
            ...createSessionDeliveryDto,
            fecha: createSessionDeliveryDto.fecha, // Dates are now strings
            session: { id: createSessionDeliveryDto.sessionId }
        });

        const savedSession = await this.deliveryRepository.save(sessionDelivery);

        for (const routeDto of createSessionDeliveryDto.routes) {
            const route = this.deliveryContainRepository.create({
                numero: routeDto.numero,
                patente: routeDto.patente,
                bind: routeDto.bind,
                sessionDelivery_id: savedSession.id,
                status: routeDto.status
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

    async findAll(): Promise<{ status: number; message: string; data: sessionDeliveryEntity[] }> {
        const sessions = await this.deliveryRepository.createQueryBuilder('delivery')
            .leftJoin('delivery.user', 'user')
            .leftJoin('delivery.session', 'session')
            .addSelect(['user.fullName', 'session.status'])
            .orderBy('delivery.id', 'DESC')
            .getMany();

        if (!sessions.length) {
            return {
                status: HttpStatus.OK,
                message: 'No session deliveries found',
                data: []
            };
        }

        return {
            status: HttpStatus.OK,
            message: 'Session deliveries retrieved successfully',
            data: sessions
        }
    }

    async findRoutesBySessionId(sessionId: number) {


        const query = await this.entityManager.query(`
            SELECT 
                sessionDeliveryRoutes.*, 
                drivers.nombre_apellido, 
                drivers.empresa, 
                drivers.patente as patenteDriver, 
                user_octomile.fullName,
                COALESCE(
                    COUNT(CASE 
                        WHEN session.status = 'Completado' THEN 
                            CASE WHEN sessionDetails.codigoPinchazo = 'DI' THEN 1 ELSE NULL END
                        ELSE 1 
                    END), 0
                ) AS totalRows,
                (
                    SELECT COALESCE(COUNT(*), 0)
                    FROM RouteDetails
                    WHERE RouteDetails.sessionDeliveryRoutesId = sessionDeliveryRoutes.id
                    AND RouteDetails.codigoPinchazo = 'DIS'
                ) AS totalScanRows
            FROM 
                sessionDeliveryRoutes
            LEFT JOIN 
                drivers ON drivers.id = sessionDeliveryRoutes.driverId
            LEFT JOIN 
                user_octomile ON user_octomile.id = sessionDeliveryRoutes.gestor
            LEFT JOIN
                sessionDelivery sd ON sd.sessionId = sessionDeliveryRoutes.sessionDelivery_id
            LEFT JOIN
                \`Session-details\` sessionDetails ON sessionDetails.patenteProducto = sessionDeliveryRoutes.patente
                                                AND sessionDetails.idSesionId = sd.sessionId
            LEFT JOIN
                sessions session ON session.id = sd.sessionId
            WHERE 
                sessionDeliveryRoutes.sessionDelivery_id = 1
            GROUP BY 
                sessionDeliveryRoutes.id, drivers.nombre_apellido, drivers.empresa, drivers.patente, user_octomile.fullName;
        `, [sessionId]);

        if (!query.length) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: `No routes found for session with ID ${sessionId}`,
            });
        }

        return query
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
            relations: ['driver', 'user']
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
                gestor: updatedRoute.user.fullName // Assuming userId is the name of the gestor
            }
        };
    }

    async findRouteDetailsByRouteId(routeId: number, status: string) {

        let andWhere = ""
        if (status == 'Completado') {
            andWhere = "AND sd.codigoPinchazo = 'DI'"
        }

        const query = `
            SELECT rs.*,user.fullName
            FROM RouteDetails rs
            JOIN \`Session-details\` sd ON sd.id = rs.sessionDetailsId
            JOIN user_octomile user ON user.id = rs.userId
            WHERE rs.sessionDeliveryRoutesId = ? ${andWhere}
        `;

        const routeDetails = await this.entityManager.query(query, [routeId]);

        const formattedResults = routeDetails.map(row => ({
            ...row,
            user: {
                fullName: row.fullName,
            }
        }));


        if (!formattedResults.length) {
            return ({
                status: HttpStatus.CONFLICT,
                message: `No route details found for route with ID ${routeId}`,
                data: []
            });
        }

        return ({
            status: HttpStatus.OK,
            data: formattedResults,
            message: `No route details found for route with ID ${routeId}`,

        })

    }

    async changeStatus(changeStatusDto: ChangeStatusDto) {

        // const { idSession, status } = changeStatusDto;
        const { changeStatus } = changeStatusDto;

        const sessionesPromises = [];

        try {
            changeStatus.forEach(async status => {
                const session = await this.deliveryContainRepository.findOneBy({ id: status.id });

                if (!session) return;

                session.status = status.status;
                sessionesPromises.push(this.deliveryContainRepository.save(session));
            })


            await Promise.all(sessionesPromises);
            return { message: 'Status cambiado', status: HttpStatus.OK };
        } catch (error) {
            //   this.commonService.handleExceptions(error);
        }
    }

    async pincharProducto(pinchazoDto: PinchazoDto) {
        const { codigoProducto, idRoute, pinchadoPor } = pinchazoDto;

        const route = await this.deliveryContainRepository.findOne({
            where: { id: idRoute },
            relations: ['routeDetails', 'routeDetails.user']
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

        const userMap = new Map<string, User>();
        const users = await this.userRepository.find({
            where: { id: In([...pinchadoPorIds, pinchadoPor]) }
        });
        users.forEach(user => userMap.set(user.id, user));

        if (!userMap.has(pinchadoPor)) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: `User with ID ${pinchadoPor} not found`
            });
        }

        const routeDetail = route.routeDetails.find(
            detail => detail.codigoProducto === codigoProducto
        );

        routeDetail.fuePinchado = true;
        routeDetail.pinchadoPor = pinchadoPor;
        routeDetail.codigoPinchazo = 'DI';
        routeDetail.estado = 'Pinchado';
        routeDetail.userId = pinchadoPor;

        const now = new Date();
        const fechaFormateada = new Date().toLocaleString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(',', '');

        const milisegundos = String(now.getMilliseconds()).padStart(3, '0');

        const [dia, mes, año, hora, minutos, segundos] = fechaFormateada.match(/\d+/g);
        const formattedDate = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}.${milisegundos}`;

        routeDetail.fechaPinchado = formattedDate;

        await this.routeDetailsRepository.save(routeDetail);

        const updatedProduct = {
            ...routeDetail,
            user: {
                fullName: userMap.get(routeDetail.pinchadoPor)?.fullName || 'Unknown user'
            }

        };

        this.webSocketGateway.emitProductScanned(idRoute, updatedProduct);

        return {
            message: 'Product scanned successfully',
            status: HttpStatus.OK,
            data: updatedProduct
        };
    }

    async productoDis(pinchazoDisDto: PinchazoDisDto) {
        const { codigoProducto, idRoute, pinchadoPor } = pinchazoDisDto;

        // Buscar la ruta con ID idRoute
        const route = await this.deliveryContainRepository.findOne({
            where: { id: idRoute },
            relations: ['routeDetails', 'routeDetails.user']
        });

        if (!route) throw new BadRequestException(`Route with ID ${idRoute} not found`);

        // Verificar si el código de producto ya existe
        const alreadyExists = route.routeDetails.some(
            detail => detail.codigoProducto === codigoProducto && detail.codigoPinchazo === 'DIS'
        );

        if (alreadyExists) {
            return {
                message: 'DIS product already scanned',
                status: HttpStatus.CONFLICT
            };
        }

        // Obtener usuarios para mostrar nombres
        const pinchadoPorIds = [...new Set(route.routeDetails
            .map(detail => detail.pinchadoPor))];

        const userMap = new Map<string, User>();
        const users = await this.userRepository.find({
            where: { id: In([...pinchadoPorIds, pinchadoPor]) }
        });
        users.forEach(user => userMap.set(user.id, user));

        if (!userMap.has(pinchadoPor)) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: `User with ID ${pinchadoPor} not found`
            });
        }

        // Crear un nuevo detalle de ruta para el producto DIS
        const routeDetail = this.routeDetailsRepository.create({
            numProduct: 0,
            bindProduct: "",
            patenteProducto: "",
            codigoProducto: codigoProducto,
            fuePinchado: true,
            codigoPinchazo: 'DIS',
            estado: 'Pinchado',
            pinchadoPor: pinchadoPor,
            userId: pinchadoPor,
            sessionDeliveryRoutesId: route.id
        });

        // Formatear la fecha
        const now = new Date();
        const fechaFormateada = now.toLocaleString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(',', '');

        const milisegundos = String(now.getMilliseconds()).padStart(3, '0');

        const [dia, mes, año, hora, minutos, segundos] = fechaFormateada.match(/\d+/g);
        const formattedDate = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}.${milisegundos}`;

        routeDetail.fechaPinchado = formattedDate;

        // Guardar el nuevo detalle
        const savedDetail = await this.routeDetailsRepository.save(routeDetail);

        // Preparar la respuesta
        const updatedProduct = {
            ...savedDetail,
            user: {
                fullName: userMap.get(savedDetail.pinchadoPor)?.fullName || 'Unknown user'
            }
        };

        // Emitir evento WebSocket
        this.webSocketGateway.emitProductScanned(idRoute, updatedProduct);

        return {
            message: 'DIS product scanned successfully',
            status: HttpStatus.OK,
            data: updatedProduct
        };
    }
}
