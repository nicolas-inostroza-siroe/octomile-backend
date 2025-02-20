import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryEntity } from './entities/delivery.entity';
import { DeliveryContainEntity } from './entities/delivery-contain.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(DeliveryEntity)
        private readonly deliveryRepository: Repository<DeliveryEntity>,
        @InjectRepository(DeliveryContainEntity)
        private readonly deliveryContainRepository: Repository<DeliveryContainEntity>,
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
}
