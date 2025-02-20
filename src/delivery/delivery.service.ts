import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryEntity } from './entities/delivery.entity';
import { DeliveryContainEntity } from './entities/delivery-contain.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DriversEntity } from '../drivers/entities/drivers.entity';

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(DeliveryEntity)
        private readonly deliveryRepository: Repository<DeliveryEntity>,
        @InjectRepository(DeliveryContainEntity)
        private readonly deliveryContainRepository: Repository<DeliveryContainEntity>,
        @InjectRepository(DriversEntity)
        private readonly driversRepository: Repository<DriversEntity>,
    ) {}

    async create(createDeliveryDto: CreateDeliveryDto): Promise<DeliveryEntity> {
        try {
            const delivery = this.deliveryRepository.create({
                ...createDeliveryDto,
            });
            const deliveryContains = createDeliveryDto.deliveryContains.map((deliveryContain) => {
                return this.deliveryContainRepository.create({
                    ...deliveryContain,
                });
            });
            delivery.deliveryContains = deliveryContains;
            return await this.deliveryRepository.save(delivery);
        } catch (error) {
            throw new Error('Error creating delivery');
        }
    }

    async assignDriver(id: number, driverId: number): Promise<void> {
        const driver = await this.driversRepository.findOne({ 
            where: { id: driverId },
            select: ['nombre_apellido'] 
        });

        if (!driver) {
            throw new NotFoundException(`Driver with ID ${driverId} not found`);
        }

        const result = await this.deliveryRepository.update(id, { 
            conductor: driver.nombre_apellido 
        });
        
        if (result.affected === 0) {
            throw new NotFoundException(`Delivery with ID ${id} not found`);
        }
    }
}
