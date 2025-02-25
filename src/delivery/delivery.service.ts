import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sessionDeliveryEntity } from './entities/sessiondelivery.entity';
import { sessionDeliveryRoutesEntity } from './entities/sessionDeliveryRoutes.entity';
import { DriversEntity } from '../drivers/entities/drivers.entity';
import { CreateSesionDeliveryDto } from './dto/createSessionDelivery.dto';
import { sessionDeliveryRoutesDto } from './dto/sessionDeliveryRoute.dto';

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(sessionDeliveryEntity)
        private readonly deliveryRepository: Repository<sessionDeliveryEntity>,
        @InjectRepository(sessionDeliveryRoutesEntity)
        private readonly deliveryContainRepository: Repository<sessionDeliveryRoutesEntity>,
        @InjectRepository(DriversEntity)
        private readonly driversRepository: Repository<DriversEntity>,
    ) {}

    async createSessionDelivery(createSessionDeliveryDto: CreateSesionDeliveryDto) {
        const sessionDelivery = this.deliveryRepository.create({
            ...createSessionDeliveryDto,
            fecha: new Date(),
        });

        const savedSession = await this.deliveryRepository.save(sessionDelivery);
        
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
}
