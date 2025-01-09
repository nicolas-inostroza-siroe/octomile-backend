import { BadRequestException, Inject, Injectable, Logger, } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Repository } from 'typeorm';
import { SessionDetailEntity, SessionEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';

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


}
