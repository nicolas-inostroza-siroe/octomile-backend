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

    async assignDriver(id: number, driverId: number) {
        const driver = await this.driversRepository.findOne({ 
            where: { id: driverId },
            select: ['id', 'nombre_apellido', 'patente', 'empresa']
        });
    
        if (!driver) {
            throw new NotFoundException(`Driver with ID ${driverId} not found`);
        }
    
        await this.deliveryRepository.update(id, { 
            conductor: driver.nombre_apellido,
        patente_real: driver.patente,
        patente_generica: driver.patente,
        empresa_asociada: driver.empresa
        });
        
        const updatedDelivery = await this.deliveryRepository.findOne({
            where: { id },
            relations: ['deliveryContains']
        });
    
        if (!updatedDelivery) {
            throw new NotFoundException(`Delivery with ID ${id} not found`);
        }
    
        return {
            delivery: updatedDelivery,
            driver: driver
        };
    }

    async findAll() {
        const deliveries = await this.deliveryRepository.find({
            relations: ['deliveryContains'],
            order: {
                id: 'DESC'
            }
        });
    
        if (!deliveries.length) {
            throw new NotFoundException('No deliveries found');
        }
    
        const deliveriesWithDrivers = await Promise.all(
            deliveries.map(async (delivery) => {
                if (delivery.conductor) {
                    const driver = await this.driversRepository.findOne({
                        where: { nombre_apellido: delivery.conductor }
                    });
                    return {
                        delivery,
                        driver: driver || null
                    };
                }
                return {
                    delivery,
                    driver: null
                };
            })
        );
    
        return deliveriesWithDrivers;
    }
}
