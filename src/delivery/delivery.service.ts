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
                        ELSE sessionDetails.id
                    END), 0
                ) AS totalRows,
                (
                    SELECT COALESCE(COUNT(*), 0)
                    FROM RouteDetails
                    WHERE RouteDetails.sessionDeliveryRoutesId = sessionDeliveryRoutes.id
                    AND RouteDetails.codigoPinchazo = 'DI'
                ) AS totalScanRows
            FROM 
                sessionDeliveryRoutes
            LEFT JOIN 
                drivers ON drivers.id = sessionDeliveryRoutes.driverId
            LEFT JOIN 
                user_octomile ON user_octomile.id = sessionDeliveryRoutes.gestor
            LEFT JOIN
                sessionDelivery sd ON sd.id = sessionDeliveryRoutes.sessionDelivery_id
            LEFT JOIN
                \`Session-details\` sessionDetails ON sessionDetails.patenteProducto = sessionDeliveryRoutes.patente
                                                AND sessionDetails.idSesionId = sd.sessionId
            LEFT JOIN
                sessions session ON session.id = sd.sessionId
            WHERE 
                sessionDeliveryRoutes.sessionDelivery_id = ?
            GROUP BY 
                sessionDeliveryRoutes.id, drivers.nombre_apellido, drivers.empresa, drivers.patente, user_octomile.fullName;
        `, [sessionId]);

        if (!query.length) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: `No routes found for session with ID ${sessionId}`,
            });
        }

        const query2 = `
        SELECT rd.numProduct, rd.bindProduct, rd.patenteProducto, rd.codigoProducto ,rd.estado,
        oc1.fullName scanFor, oc2.fullName reviewFor, rd.fechaPinchado, rd.fechaRevisado
        FROM sessionDeliveryRoutes sr
        INNER JOIN RouteDetails rd ON sr.id = rd.sessionDeliveryRoutesId
        LEFT JOIN user_octomile oc1 ON rd.pinchadoPor = oc1.id
        LEFT JOIN user_octomile oc2 on rd.revisadoPor = oc2.id
        WHERE sr.sessionDelivery_id = ? AND rd.estado != 'Pinchado'`

        const toReview = await this.entityManager.query(query2,[sessionId]);

        const data = {
            routes: query,
            productsToReview: toReview
        }

        return data
    }

    async updateDriverForRoute(routeId: number, driverId: number, patenteId: number, userId: string) {
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
        route.patenteId = patenteId;
        await this.deliveryContainRepository.save(route);

        // const updatedRoute = await this.deliveryContainRepository.findOne({
        //     where: { id: routeId },
        //     relations: ['driver', 'user']
        // });

        const query = `
            SELECT s.id, s.numero, s.patente, s.sessionDelivery_id, s.status, s.bind,
                   u.fullName,
                   d.empresa, d.nombre_apellido,
                   v.patente as patenteDriver
            FROM sessionDeliveryRoutes s
            LEFT JOIN user_octomile u ON u.id = s.gestor
            LEFT JOIN drivers d ON d.id = s.driverId
            LEFT JOIN vehiculos v ON v.id_vehiculo = s.patenteId
            WHERE s.id = ?  
        `;

        const select = await this.entityManager.query(query, [routeId])




        return {
            status: HttpStatus.OK,
            message: 'Driver updated successfully for the route',
            data: select[0]
                // ...updatedRoute,
                // nombre_apellido: updatedRoute.driver.nombre_apellido,
                // empresa: updatedRoute.driver.empresa,
                // patenteDriver: updatedRoute.driver.patente,
                // fullName: updatedRoute.user.fullName
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
            LEFT JOIN \`Session-details\` sd ON sd.id = rs.sessionDetailsId
            LEFT JOIN user_octomile user ON user.id = rs.userId
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
        const { codigoProducto, idRoute, pinchadoPorName, pinchadoPorId } = pinchazoDto;

        const query = `
            SELECT id, numProduct, bindProduct, patenteProducto, codigoProducto, fuePinchado, fechaPinchado, codigoPinchazo
            FROM RouteDetails
            WHERE sessionDeliveryRoutesId = ? AND codigoProducto = ?
        `

        const res = await this.entityManager.query(query, [idRoute, codigoProducto])



        if(res.length === 0){
            return {
                message: 'Product not exist',
                status: HttpStatus.CONFLICT
            }
        }

        if(res[0].fuePinchado) {
            return {
                message: 'Product already scanned',
                status: HttpStatus.CONFLICT
            }
        }

        const query2 = `
            UPDATE RouteDetails
            SET codigoPinchazo = 'DI', pinchadoPor = ?, fechaPinchado = ?, fuePinchado = true, estado = 'Pinchado', userId = ?
            WHERE id = ?
        `;

        const date = this.nowDate();

        const update = await this.entityManager.query(query2, [pinchadoPorId, date, pinchadoPorId, res[0].id]);

        // console.log("res: ",res, "update: ", update);

        if (!update.affectedRows && !update.rowCount) {
            return {
                message: 'Failed to update product',
                status: HttpStatus.INTERNAL_SERVER_ERROR
            };
        }
    
        const result = {
            ...res[0],
            codigoPinchazo: 'DI',
            PinchadoPor: pinchadoPorId,
            fechaPinchado: date,
            fuePinchado: true,
            estado: 'Pinchado',
            userId: pinchadoPorId,
            user: {
                fullName: pinchadoPorName,
            }
        };
        
        this.webSocketGateway.emitProductScanned(idRoute, result);

        return {
            message: 'Product scanned successfully',
            status: HttpStatus.OK,
            data: result
        };
    }

    async productoDis(pinchazoDisDto: PinchazoDisDto) {
        const { codigoProducto, idRoute, pinchadoPorId, pinchadoPorName } = pinchazoDisDto;

        const date = this.nowDate();

        const query = `
            INSERT INTO RouteDetails (numProduct, bindProduct, patenteProducto, codigoProducto, fuePinchado, fechaPinchado, codigoPinchazo, PinchadoPor, sessionDeliveryRoutesId, userId, estado, revisadoPor, fechaRevisado )
            VALUES (0, '', '', ?, true, ?, 'DIS', ?, ?, ?, 'Bind Erroneo', ?, ?)
        `

        const res = await this.entityManager.query(query, [codigoProducto, date, pinchadoPorId, idRoute, pinchadoPorId, pinchadoPorId, date])

        if(!res.affectedRows || res.affectedRows === 0) {
            throw new NotFoundException(`Error inserting ${codigoProducto} into RouteDetails`);
        }

        const data = {
            id: res.insertId || null,
            numProduct : 0,
            bindProduct: "",
            patenteProducto: "",
            codigoProducto: codigoProducto,
            fuePinchado: true,
            fechaPinchado: date,
            codigoPinchazo: 'DIS',
            PinchadoPor: pinchadoPorId,
            estado: 'Bind Erroneo',
            revisadoPor: pinchadoPorId,
            fechaRevisado: date,
            user: {
                fullName: pinchadoPorName
            }
        }

        this.webSocketGateway.emitProductScanned(idRoute, data);

        return {
            message: 'DIS product scanned successfully',
            status: HttpStatus.OK,
            data: data
        };
    }

    async changeStatusProduct(idRoute: number, idProduct: number, newStatus: string, userId: string) {

        const date = this.nowDate();

        const query = `
            UPDATE RouteDetails
            SET estado = ?, fechaRevisado = ?, revisadoPor = ?
            WHERE id = ?
        `;

        const update = await this.entityManager.query(query, [newStatus, date, userId, idProduct])

        if(!update.affectedRows && !update.rowCount){
            return {
              message: 'Failted to update product',
              status: HttpStatus.INTERNAL_SERVER_ERROR
            }
        }

        this.webSocketGateway.emitProductScanned(idRoute, { id: idProduct, estado: newStatus, operation: 'update' });
    
        return {
            message: 'Product status has been updated successfully',
            status: HttpStatus.OK,
            data: { id: idProduct, status: newStatus, operation: 'update'}
        };

        // const now = new Date();
        // const fechaFormateada = now.toLocaleString('es-CL', {
        //     year: 'numeric',
        //     month: '2-digit',
        //     day: '2-digit',
        //     hour: '2-digit',
        //     minute: '2-digit',
        //     second: '2-digit',
        //     hour12: false
        // }).replace(',', '');

        // const milisegundos = String(now.getMilliseconds()).padStart(3, '0');

        // const [dia, mes, año, hora, minutos, segundos] = fechaFormateada.match(/\d+/g);
        // const formattedDate = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}.${milisegundos}`;


        // const updateResult = await this.routeDetailsRepository
        //     .createQueryBuilder()
        //     .update("RouteDetails")
        //     .set({ estado: newStatus, fechaRevisado: formattedDate, revisadoPor: userId })
        //     .where("id = :idProduct", { idProduct })
        //     .execute();
    
        // if (updateResult.affected === 0) {
        //     throw new NotFoundException("Product not found");
        // }
    
        // this.webSocketGateway.emitProductScanned(idRoute, { id: idProduct, estado: newStatus });
    
        // return {
        //     message: 'Product status has been updated successfully',
        //     status: HttpStatus.OK,
        //     data: { id: idProduct, status: newStatus, operation: 'update'}
        // };
    }

    nowDate(){
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
    
        return formattedDate
      }
}
