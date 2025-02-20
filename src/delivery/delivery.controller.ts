import { Body, Controller, Post, Param, Patch, Get } from '@nestjs/common';
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

    @Patch(':id/assign-driver/:driverId')
async assignDriver(
    @Param('id') id: number,
    @Param('driverId') driverId: number
) {
    const result = await this.deliveryService.assignDriver(id, driverId);
    return {
        message: 'Driver assigned successfully',
        statusCode: 200,
        data: result
    };
}

    @Get()
    async findAll() {
        const deliveries = await this.deliveryService.findAll();
        return {
            message: 'Deliveries retrieved successfully',
            statusCode: 200,
            data: deliveries
        };
    }


}



