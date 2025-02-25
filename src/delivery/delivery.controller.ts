import { Body, Controller, Post, Param, Patch, Get } from '@nestjs/common';
import { CreateSesionDeliveryDto } from './dto/createSessionDelivery.dto';
import { sessionDeliveryRoutesDto} from './dto/sessionDeliveryRoute.dto';
import { DeliveryService } from './delivery.service';
import { RouteDetailsDto } from './dto/routeDetails.dto';

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

    @Post('route/:id/details')
    async addRouteDetails(
        @Param('id') routeId: number,
        @Body() routeDetailsDto: RouteDetailsDto
    ) {
        const routeDetail = await this.deliveryService.addRouteDetails(routeId, routeDetailsDto);
        return {
            message: 'Route detail added successfully',
            statusCode: 201,
            data: routeDetail
        };
    }
}



