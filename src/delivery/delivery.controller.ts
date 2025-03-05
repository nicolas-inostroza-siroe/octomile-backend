import { Body, Controller, Post, Param, Get, HttpStatus, Patch, Query } from '@nestjs/common';
import { CreateSesionDeliveryDto } from './dto/createSessionDelivery.dto';
import { sessionDeliveryRoutesDto } from './dto/sessionDeliveryRoute.dto';
import { DeliveryService } from './delivery.service';
import { RouteDetailsDto } from './dto/routeDetails.dto';
import { PinchazoDto } from './dto/pinchazo.dto';
import { ChangeStatusDto } from 'src/sessions/dto/change-status.dto';
import { PinchazoDisDto } from './dto/pinchazo-dis.dto';

@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Post('create-session')
    async createSessionDelivery(@Body() createSessionDeliveryDto: CreateSesionDeliveryDto) {
        const sessionDelivery = await this.deliveryService.createSessionDelivery(createSessionDeliveryDto);
        return {
            status: sessionDelivery.status,
            message: sessionDelivery.message,
            data: sessionDelivery.data
        };
    }

    @Get('sessions')
    async getAllSessions() {
        const sessions = await this.deliveryService.findAll();
        return {
            status: sessions.status,
            message: sessions.message,
            data: sessions.data
        };
    }

    @Get('session/:id/routes')
    async getRoutesBySessionId(@Param('id') sessionId: number) {
        const routes = await this.deliveryService.findRoutesBySessionId(sessionId);
        return {
            status: HttpStatus.OK,
            message: 'Routes retrieved successfully',
            data: routes
        };
    }

    @Post('modificate-status')
    modificateStatus(
        @Body() ChangeStatusDto: ChangeStatusDto
    ) {
        return this.deliveryService.changeStatus(ChangeStatusDto)
    }

    @Get('route/details')
    async getRouteDetailsByQuery(
        @Query('id') routeId: number,
        @Query('status') status: string
    ) {
        const routeDetails = await this.deliveryService.findRouteDetailsByRouteId(routeId, status);
        return {
            status: routeDetails.status,
            message: routeDetails.message,
            data: routeDetails.data
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
            statusCode: HttpStatus.OK,
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
            statusCode: HttpStatus.OK,
            data: routeDetail
        };
    }

    @Patch('route/:routeId/driver/:driverId')
    async updateDriverForRoute(
        @Param('routeId') routeId: number,
        @Param('driverId') driverId: number,
        @Body('userId') userId: string
    ) {
        const updatedRoute = await this.deliveryService.updateDriverForRoute(routeId, driverId, userId);
        return {
            status: updatedRoute.status,
            message: updatedRoute.message,
            data: updatedRoute.data
        };
    }

    @Patch('pinchazo')
    async pincharProducto(@Body() pinchazoDto: PinchazoDto) {
    return this.deliveryService.pincharProducto(pinchazoDto);
    }

    @Patch('pinchazo-dis')
    async pinchazoDis(@Body() pinchazoDisDto: PinchazoDisDto) {
        return this.deliveryService.productoDis(pinchazoDisDto);
    }

    @Patch('changeStatusProduct')
    async changeStatusProduct(
        @Body('idRoute') idRoute: number,
        @Body('idProduct') idProduct: number,
        @Body('newStatus') newStatus: string
    ){
        return this.deliveryService.changeStatusProduct(idRoute, idProduct, newStatus);
    }

}



