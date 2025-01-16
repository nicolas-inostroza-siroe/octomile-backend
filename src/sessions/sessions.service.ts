import { BadRequestException, HttpStatus, Inject, Injectable, Logger, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Repository, In } from 'typeorm';
import { SessionDetailEntity, SessionEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeStatusDto } from './dto/change-status.dto';
import { PinchazoDto } from './dto/pinchazo.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';
import { pinchazoDisDto } from './dto/pinchazoDis.dto';
import { DeleteDisDto } from './dto/deleteDis.dto';
import { Console } from 'console';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SessionsService {

  private readonly logger = new Logger('SessionsService');

  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
    @InjectRepository(SessionDetailEntity)
    private readonly sessionsDetailsRepository: Repository<SessionDetailEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonService: CommonService
  ) { }

  async createSession(createSessionDto: CreateSessionDto) {

    const { nombreSession, propietario, productsSessions, tipo } = createSessionDto;

    try {

      const session = this.sessionsRepository.create({
        fecha: new Date(),
        name: nombreSession,
        propietario: propietario,
        status: 'Por activar',
        tipo: tipo,
        sessionDetail: productsSessions.map(product => this.sessionsDetailsRepository.create({
          bindProduct: product.bindProduct,
          numProduct: product.numProduct,
          patenteProducto: product.patenteProducto,
          codigoProducto: product.codigoProducto,
        })),
      });
      await this.sessionsRepository.save(session);
      return { message: "Carga Exitosa", status: HttpStatus.OK }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async changeStatus(changeStatusDto: ChangeStatusDto) {

    // const { idSession, status } = changeStatusDto;
    const { changeStatus } = changeStatusDto;

    const sessionesPromises = [];

    try {
      changeStatus.forEach(async status => {
        const session = await this.sessionsRepository.findOneBy({ id: status.id });
        // if (!session) throw new BadRequestException(`session witih ${status.id} not found`);

        if (!session) return;

        session.status = status.status;
        sessionesPromises.push(this.sessionsRepository.save(session));
      })


      await Promise.all(sessionesPromises);
      return { message: 'Status cambiado', status: HttpStatus.OK };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }



    // const session = await this.sessionsRepository.findOneBy({ id: idSession });

    // if (!session) throw new BadRequestException(`session witih ${idSession} not found`);

    // session.status = status;

    // await this.sessionsRepository.save(session);
  }

  async getAllDetailsBySession(idSession: number) {
    try {
        const session = await this.sessionsRepository.findOne({
            where: { id: idSession },
            relations: {
                sessionDetail: {
                    user: true
                }
            },
            select: {
                id: true,
                sessionDetail: {
                    id: true,
                    numProduct:true,
                    bindProduct:true,
                    patenteProducto:true,
                    codigoProducto: true,
                    fuePinchado: true,
                    PinchadoPor: true,
                    fechaPinchado: true,
                    codigoPinchazo: true,
                    user: {
                        id: true,
                        fullName: true
                    }
                }
            }
        });

        if (!session) {
            throw new NotFoundException(`Session with id ${idSession} not found`);
        }

      
        const pinchadoPorIds = [...new Set(session.sessionDetail
            .map(detail => detail.PinchadoPor)
            .filter(id => id))];

       
        const users = await this.userRepository.findBy({
            id: In(pinchadoPorIds)
        });

        const userMap = new Map(users.map(user => [user.id, user.fullName]));

        const enhancedDetails = session.sessionDetail.map(detail => ({
            ...detail,
            NombreDeUsuario: detail.PinchadoPor ? userMap.get(detail.PinchadoPor) || 'Unknown User' : null
        }));

        return {
            id: session.id,
            details: enhancedDetails
        };

    } catch (error) {
        console.error('Error in getAllDetailsBySession:', error);
        throw new InternalServerErrorException(
            `Error fetching session details: ${error.message}`
        );
    }
}

  async pincharProducto(pinchazoDto: PinchazoDto) {
    const { codigoProducto, idSession } = pinchazoDto;

    const session = await this.sessionsRepository.findOne({
        where: { id: idSession },
        relations: {
            sessionDetail: {
                user: true
            }
        },
        select: {
            id: true,
            sessionDetail: {
                id: true,
                codigoProducto: true,
                fuePinchado: true,
                PinchadoPor: true,
                fechaPinchado: true,
                codigoPinchazo: true,
                user: {
                    fullName: true
                }
            }
        }
    });

    if (!session) throw new BadRequestException(`session with ${idSession} not found`);

 
    const pinchadoPorIds = [...new Set(session.sessionDetail
        .map(detail => detail.PinchadoPor)
        .filter(id => id))];

  
    const users = await this.userRepository.findBy({
        id: In(pinchadoPorIds)
    });

    const userMap = new Map(users.map(user => [user.id, user.fullName]));

    session.sessionDetail = session.sessionDetail.map(detalle => {
        if (detalle.codigoProducto === codigoProducto) {
            detalle.fechaPinchado = new Date();
            detalle.fuePinchado = true;
            detalle.codigoPinchazo = 'DI';
            detalle.PinchadoPor = pinchazoDto.pinchadoPor;
        }
        return {
            ...detalle,
            userName: detalle.user?.fullName || 'Unknown User',
            pinchadoPorName: detalle.PinchadoPor ? userMap.get(detalle.PinchadoPor) || 'Unknown User' : null
        };
    });

    const updatedSession = await this.sessionsRepository.save(session);
    return updatedSession.sessionDetail;
}

  async productoDis(pinchazo: pinchazoDisDto) {
    const session = await this.sessionsRepository.findOne({
        where: { id: pinchazo.idSession },
        relations: {
            sessionDetail: {
                user: true
            }
        },
        select: {
            id: true,
            sessionDetail: {
                id: true,
                numProduct: true,
                bindProduct: true,
                patenteProducto: true,
                codigoProducto: true,
                fuePinchado: true,
                fechaPinchado: true,
                codigoPinchazo: true,
                PinchadoPor: true,
                user: {
                    fullName: true
                }
            }
        }
    });

    if (!session) {
        throw new NotFoundException(`Session with id ${pinchazo.idSession} not found`);
    }

      const pinchadoPorIds = [...new Set(session.sessionDetail
      .map(detail => detail.PinchadoPor)
      .filter(id => id))];

    const users = await this.userRepository.findBy({
      id: In(pinchadoPorIds)
    });

    const userMap = new Map(users.map(user => [user.id, user.fullName]));



    const details = this.sessionsDetailsRepository.create({
        numProduct: 0,
        bindProduct: "",
        patenteProducto: "",
        codigoProducto: pinchazo.codigoProducto,
        fuePinchado: true,
        fechaPinchado: new Date(),
        codigoPinchazo: 'DIS',
        PinchadoPor: pinchazo.pinchadoPor || ""
    });

    session.sessionDetail.push(details);
    const sessionUpdate = await this.sessionsRepository.save(session);

    const enhancedDetails = sessionUpdate.sessionDetail.map(detail => ({
        ...detail,
        userName: detail.user?.fullName || 'Unknown User',
        pinchadoPorName: detail.PinchadoPor ? userMap.get(detail.PinchadoPor) || 'Unknown User' : null
    }));

    return {
      
        message: 'producto pinchado',
        status: HttpStatus.OK,
        data: enhancedDetails
    };
}

  async DeletDis(deleteDisDto: DeleteDisDto) {
    const { idSession, codigoProducto } = deleteDisDto;

    const session = await this.sessionsRepository.findOne({
      where: { id: idSession },
      relations: { sessionDetail: true }
    });

    if (!session) {
      throw new NotFoundException(`Session with id ${idSession} not found`);
    }


    session.sessionDetail = session.sessionDetail.filter(detail =>
      !(detail.codigoPinchazo === 'DIS' && detail.codigoProducto === codigoProducto)
    );

    const updatedSession = await this.sessionsRepository.save(session);

    return {
      message: 'ok',
      status: HttpStatus.OK,
      data: updatedSession
    };
  }

  async UpdateDis(DeletDisDto: DeleteDisDto) {

    const { idSession, codigoProducto, newStatus } = DeletDisDto;

    const session = await this.sessionsRepository.findOne({
      where: { id: idSession },
      relations: { sessionDetail: true }
    });

    if (!session) {
      throw new NotFoundException(`Session with id ${idSession} not found`);
    }


    session.sessionDetail = session.sessionDetail.map(detalle => {
      if (detalle.codigoProducto === codigoProducto && detalle.codigoPinchazo === 'DIS') {

        detalle.codigoPinchazo = newStatus;
      }
      return detalle;
    });

    const sessionUpdate = await this.sessionsRepository.save(session);

    return { message: 'Ok', status: HttpStatus.OK, sessionUpdate };


  }

  async getSessionStatistics(idSession: number) {
    const session = await this.sessionsRepository.findOne({
        where: { id: idSession },
        relations: {
            sessionDetail: {
                user: true
            }
        }
    });

    if (!session) {
        throw new NotFoundException(`Session with id ${idSession} not found`);
    }

    
    const pinchadoPorIds = [...new Set(session.sessionDetail
        .map(detail => detail.PinchadoPor)
        .filter(id => id))];

    
    const users = await this.userRepository.findBy({
        id: In(pinchadoPorIds)
    });

    const userMap = new Map(users.map(user => [user.id, user.fullName]));

    const details = session.sessionDetail.map(detail => ({
        ...detail,
        userName: detail.user?.fullName || 'Unknown User',
        pinchadoPorName: detail.PinchadoPor ? userMap.get(detail.PinchadoPor) || 'Unknown User' : null
    }));

    const totalDI = details.filter(d => d.codigoPinchazo === 'DI').length;
    const totalDIS = details.filter(d => d.codigoPinchazo === 'DIS').length;
    const TotalScaned = totalDI + totalDIS;
    const TotalProducts = details.length;
    const totalMissing = TotalProducts - TotalScaned;

    return {
        totalDI,
        totalDIS,
        totalMissing,
        TotalScaned,
        TotalProducts,
        Details: details
    };
}

  async getAllSessions(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const sessions = await this.sessionsRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    const [sesiones, cantidad] = sessions;

    return { message: 'all initial shipments uploaded', code: HttpStatus.OK, sesiones: sesiones, cantidadSesiones: cantidad };
  }

  async getAllActives() {
    const sessions = await this.sessionsRepository.find({
      where: { status: 'Activada' }
    })

    return { message: 'all sessions with the active status', code: HttpStatus.OK, sessions }
  }




}
