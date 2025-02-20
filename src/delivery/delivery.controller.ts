import { Body, Controller, Post } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Post('create')
    async create(@Body() createDeliveryDto: CreateDeliveryDto) {
        const delivery = await this.deliveryService.create(createDeliveryDto);
        return {
            message: 'Delivery created successfully',
            statusCode: 201,
            data: delivery,
        };
    }
}



