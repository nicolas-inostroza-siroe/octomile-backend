import { Body, Controller, Post, Param, Patch, Get } from '@nestjs/common';
import { CreateSesionDeliveryDto } from './dto/createSessionDelivery.dto';
import { sessionDeliveryRoutesDto} from './dto/sessionDeliveryRoute.dto';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Post('create-session')
    async createSessionDelivery(@Body() createSessionDeliveryDto: CreateSesionDeliveryDto) {
        const sessionDelivery = await this.deliveryService.createSessionDelivery(createSessionDeliveryDto);
        return {
            message: 'Session delivery created successfully',
            statusCode: 201,
            data: sessionDelivery
        };
    }

    @Post('session/:id/routes')
    async addDeliveryRoute(
        @Param('id') sessionId: number,
        @Body() sessionDeliveryRouteDto: sessionDeliveryRoutesDto
    ) {
        const route = await this.deliveryService.createSessionDeliveryRoute(
            sessionId,
            sessionDeliveryRouteDto
        );
        return {
            message: 'Delivery route created successfully',
            statusCode: 201,
            data: route
        };
    }
}



