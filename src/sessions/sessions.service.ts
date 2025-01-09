import { BadRequestException, Inject, Injectable, Logger, } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Repository } from 'typeorm';
import { SessionDetailEntity, SessionEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { ChangeStatusDto } from './dto/change-status.dto';
import { PinchazoDto } from './dto/pinchazo.dto';

@Injectable()
export class SessionsService {

  private readonly logger = new Logger('SessionsService');

  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
    @InjectRepository(SessionDetailEntity)
    private readonly sessionsDetailsRepository: Repository<SessionDetailEntity>
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
      return { message: "Carga Exitosa", status: HttpStatusCode.Ok }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async changeStatus(changeStatusDto: ChangeStatusDto) {

    const { idSession, status } = changeStatusDto;

    const session = await this.sessionsRepository.findOneBy({ id: idSession });

    if (!session) throw new BadRequestException(`session witih ${idSession} not found`);

    session.status = status;

    await this.sessionsRepository.save(session);
    return { message: 'Status cambiado', status: HttpStatusCode.Ok };
  }


  async getAllDetailsBySession(idSession: number) {

    const session = await this.sessionsRepository.findOne({
      where: { id: idSession },
      select: { id: true, sessionDetail: true },
      relations: { sessionDetail: true }
    });

    if (!session) throw new BadRequestException(`session witih ${idSession} not found`);

    const detalles = session.sessionDetail;

    return { message: 'todo el detalle', status: HttpStatusCode.Ok, sesionDetails: detalles };

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

    return { message: 'producto pinchado', status: HttpStatusCode.Ok, sessionUpdate };
  }




}
