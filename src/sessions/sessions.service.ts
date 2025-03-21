import { BadRequestException, HttpStatus, Inject, Injectable, Logger, NotFoundException, InternalServerErrorException, ConflictException, forwardRef } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Repository, In, IsNull, EntityManager } from 'typeorm';
import { SessionDetailEntity, SessionEntity } from './entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ChangeStatusDto } from './dto/change-status.dto';
import { PinchazoDto } from './dto/pinchazo.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';
import { pinchazoDisDto } from './dto/pinchazoDis.dto';
import { DeleteDisDto } from './dto/deleteDis.dto';
import { Console } from 'console';
import { User } from '../auth/entities/user.entity';
import { webSocketGateway } from 'src/web-socket/web-socket.gateway';


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
    private readonly commonService: CommonService,
    private readonly webSocketGateway: webSocketGateway,
    @InjectEntityManager()
    private readonly entityManager: EntityManager
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
          bindProduct: product.bindProducto,
          numProduct: product.numProducto,
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
            pinchadoPorName: detail.PinchadoPor ? userMap.get(detail.PinchadoPor) || 'Unknown User' : null
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


async getSiStatus() {
  const sessionDetails = await this.sessionsDetailsRepository.find({
    where: {
      codigoPinchazo: 'SI'
    },
    relations: {
      user: true,
      idSesion: true
    },
    select: {
      id: true,
      numProduct: true,
      bindProduct: true,
      patenteProducto: true,
      codigoProducto: true,
      fuePinchado: true,
      PinchadoPor: true,
      fechaPinchado: true,
      codigoPinchazo: true,
      estado: true,
      idSesion: {
        id: true
      },
      user: {
        fullName: true
      }
    }
  });

  const pinchadoPorIds = [...new Set(sessionDetails
    .map(detail => detail.PinchadoPor)
    .filter(id => id))];

  const users = await this.userRepository.findBy({
    id: In(pinchadoPorIds)
  });

  const userMap = new Map(users.map(user => [user.id, user.fullName]));

  const enhancedDetails = sessionDetails.map(detail => ({
    ...detail,
    NombreDeUsuario: detail.PinchadoPor ? userMap.get(detail.PinchadoPor) || 'Unknown User' : null
  }));



  if (!sessionDetails.length) {
    return {
      message: 'No products found with SI status',
      status: HttpStatus.NOT_FOUND,
      data: enhancedDetails
    };
  }

  return {
    message: 'Products Found with SI status',
    status: HttpStatus.OK,
    data: enhancedDetails
  }

}
  

  async pincharProducto(pinchazoDto: PinchazoDto) {
    const { idSession, codigoProducto, pinchadoPorName, pinchadoPorId } = pinchazoDto;


    const query = `
      SELECT id, numProduct, bindProduct, patenteProducto, codigoProducto, fuePinchado, fechaPinchado, codigoPinchazo
      FROM \`Session-details\`
      WHERE idSesionId = ? AND codigoProducto = ?
    `

    const res = await this.entityManager.query(query, [idSession, codigoProducto]);

    if (res.length === 0) {
      return {
          message: 'Product not exist',
          status: HttpStatus.CONFLICT
      };
    }

    if (res[0].fuePinchado) {
        return {
            message: 'Product already scanned',
            status: HttpStatus.CONFLICT
        };
    }
      
    const query2 = `
      UPDATE \`Session-details\`
      SET codigoPinchazo = 'DI', PinchadoPor = ?, fechaPinchado = ?, fuePinchado = true
      WHERE id = ?
    `;

    const date = this.nowDate();

    const update = await this.entityManager.query(query2, [pinchadoPorId, date, res[0].id]);

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
        pinchadoPorName: pinchadoPorName,
        fuePinchado: true
    };


    const end = performance.now();

    this.webSocketGateway.emitSessionUpdate(idSession, result);

    return {
      message: 'Product scanned successfully',
      status: HttpStatus.OK,
      data: result
    }

}

  async productoDis(pinchazo: pinchazoDisDto) {

    console.log(pinchazo);

    const date = this.nowDate()

    const query = `
    INSERT INTO \`Session-details\` (numProduct, bindProduct, patenteProducto, codigoProducto, fuePinchado, fechaPinchado, codigoPinchazo, PinchadoPor, idSesionId)
    VALUES (0, '', '', ? , true , ? , 'DIS', ?, ?)`

    const res = await this.entityManager.query(query, [pinchazo.codigoProducto, date, pinchazo.pinchadoPorId, pinchazo.idSession])

    if (!res.affectedRows || res.affectedRows === 0) {
      throw new NotFoundException(`Error inserting ${pinchazo.codigoProducto} into Session-details`);
    }

    const data = {
      id: res.insertId || null,
      numProduct: 0,
      bindProduct: "",
      patenteProducto: "",
      codigoProducto: pinchazo.codigoProducto,
      fuePinchado: true,
      fechaPinchado: date,
      codigoPinchazo: 'DIS',
      PinchadoPor: pinchazo.pinchadoPorId,
      pinchadoPorName: pinchazo.pinchadoPorName
    }


    this.webSocketGateway.emitSessionUpdate(pinchazo.idSession, data);

    return {
        message: 'producto pinchado',
        status: HttpStatus.OK,
        data: data
    };
}

  // async DeletDis(deleteDisDto: DeleteDisDto) {
  //   const { idSession, codigoProducto } = deleteDisDto;

  //   const session = await this.sessionsRepository.findOne({
  //     where: { id: idSession },
  //     relations: { sessionDetail: true }
  //   });

  //   if (!session) {
  //     throw new NotFoundException(`Session with id ${idSession} not found`);
  //   }


  //   session.sessionDetail = session.sessionDetail.filter(detail =>
  //     !(detail.codigoPinchazo === 'DIS' && detail.codigoProducto === codigoProducto)
  //   );

  //   const updatedSession = await this.sessionsRepository.save(session);

  //   return {
  //     message: 'ok',
  //     status: HttpStatus.OK,
  //     data: updatedSession
  //   };
  // }

  async UpdateDis(DeletDisDto: DeleteDisDto) {

    const { idSession, codigoProducto, newStatus } = DeletDisDto;

    const query = `
      UPDATE \`Session-details\`
      SET codigoPinchazo = ? 
      WHERE idSesionId = ? AND codigoProducto = ?
    `
  
    const update = await this.entityManager.query(query, [newStatus, idSession, codigoProducto])

    if(!update.affectedRows && !update.rowCount){
      return {
        message: 'Failted to update product',
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }

    const querySelect = `
      SELECT id, numProduct, bindProduct, patenteProducto, codigoProducto, fuePinchado, fechaPinchado, codigoPinchazo, PinchadoPor
      FROM \`Session-details\`
      WHERE idSesionId = ? AND codigoProducto = ?
    `;

    const select = await this.entityManager.query(querySelect, [idSession, codigoProducto]);
  
    return {
      message: 'Ok', status: HttpStatus.OK, sessionUpdate: select
    }
    
    // const session = await this.sessionsRepository.findOne({
    //   where: { id: idSession },
    //   relations: { sessionDetail: true }
    // });

    // if (!session) {
    //   throw new NotFoundException(`Session with id ${idSession} not found`);
    // }

    // session.sessionDetail = session.sessionDetail.map(detalle => {
    //   if (detalle.codigoProducto === codigoProducto && detalle.codigoPinchazo === 'DIS') {

    //     detalle.codigoPinchazo = newStatus;
    //   }
    //   return detalle;
    // });

    // const sessionUpdate = await this.sessionsRepository.save(session);

    // return { message: 'Ok', status: HttpStatus.OK, sessionUpdate };
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
      order: { id: 'DESC' }
    });

    const [sesiones, cantidad] = sessions;

    return { message: 'all initial shipments uploaded', code: HttpStatus.OK, sesiones: sesiones, cantidadSesiones: cantidad };
  }

  async getAllActives() {
    const sessions = await this.sessionsRepository.find({
      where: { status: 'Activada' },
      order: { id: "DESC" }
    })

    return { message: 'all sessions with the active status', code: HttpStatus.OK, sessions }
  }

  async getSessionsWithoutDelivery(): Promise<{ status: number; message: string; data: SessionEntity[] }> {
    const sessions = await this.sessionsRepository.createQueryBuilder('session')
    .leftJoinAndSelect('session.sessionDelivery', 'sessionDelivery')
    .where('sessionDelivery.sessionId IS NULL OR sessionDelivery.sessionId != session.id')
    .orderBy('session.id', 'DESC')
    .getMany();

    return {
        status: HttpStatus.OK,
        message: sessions.length ? 'Sessions retrieved successfully' : 'No sessions found without delivery',
        data: sessions
    };

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
