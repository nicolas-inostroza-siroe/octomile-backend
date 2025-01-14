import { BadRequestException, HttpStatus, Inject, Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Repository } from 'typeorm';
import { SessionDetailEntity, SessionEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeStatusDto } from './dto/change-status.dto';
import { PinchazoDto } from './dto/pinchazo.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CommonService } from 'src/common/common.service';
import { pinchazoDisDto } from './dto/pinchazoDis.dto';

@Injectable()
export class SessionsService {

  private readonly logger = new Logger('SessionsService');

  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
    @InjectRepository(SessionDetailEntity)
    private readonly sessionsDetailsRepository: Repository<SessionDetailEntity>,
    private readonly commonService: CommonService
  ) { }

  async createSession(createSessionDto: CreateSessionDto) {

    const { nombreSession, propietario, productsSessions, tipo } = createSessionDto;

    try {

      const session = this.sessionsRepository.create({
        fecha: new Date(),
        name: nombreSession,
        propietario: propietario,
        status: 'ACTIVA',
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
            where: { 
                id: idSession 
            },
            relations: {
                sessionDetail: true
            },
        });

        if (!session) {
            throw new NotFoundException(`Session with id ${idSession} not found`);
        }

        console.log('Session found:', session); // Debug log

        return {
            id: session.id,
            details: session.sessionDetail
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
      select: { id: true, sessionDetail: true },
      relations: { sessionDetail: true }
    });

    if (!session) throw new BadRequestException(`session witih ${idSession} not found`);



    session.sessionDetail = session.sessionDetail.map(detalle => {
      if (detalle.codigoProducto === codigoProducto) {
        detalle.fechaPinchado = new Date();
        detalle.fuePinchado = true;
        detalle.codigoPinchazo = 'DI';
      }
      return detalle;
    });

    const sessionUpdate = await this.sessionsRepository.preload(session);

    await this.sessionsRepository.save(sessionUpdate);

    return { message: 'producto pinchado', status: HttpStatus.OK, sessionUpdate };
  }

  async productoDis(pinchazo: pinchazoDisDto) {
    const session = await this.sessionsRepository.findOne({
        where: { id: pinchazo.idSession },
        relations: { sessionDetail: true }
    });

    const details = this.sessionsDetailsRepository.create({
      numProduct: pinchazo.numProduct,
      bindProduct: pinchazo.bindProduct,
      patenteProducto: pinchazo.patenteProducto,
      codigoProducto: pinchazo.codigoProducto,
      fuePinchado: true,
      fechaPinchado: new Date(),
      codigoPinchazo: 'DIS',
      PinchadoPor: pinchazo.pinchadoPor || ""
  });

   session.sessionDetail.push(details)


   const sessionUpdate = await this.sessionsRepository.save(session);


    return { 
        message: 'producto pinchado', 
        status: HttpStatus.OK, 
        sessionUpdate 
    };
}

async getSessionStatistics(idSession: number) {
  const session = await this.sessionsRepository.findOne({
      where: { id: idSession },
      relations: { sessionDetail: true }
  });

  if (!session) {
      throw new NotFoundException(`Session with id ${idSession} not found`);
  }

  const details = session.sessionDetail;
  
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




}
