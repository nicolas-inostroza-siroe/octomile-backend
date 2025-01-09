import { Controller, Get, Post, Body, Param, Query, } from '@nestjs/common';
import { ShipmentLoadService } from './shipment-load.service';
import { PaginationDto } from '@src/common/dtos/pagination.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateShipmentDto } from './dto';
import { Auth, GetUser } from '@src/auth/decorators';
import { User } from '@src/auth/entities/user.entity';


@ApiTags('Shipment-load')
@Controller('shipment-load')
export class ShipmentLoadController {
  constructor(
    private readonly shipmentLoadService: ShipmentLoadService
  ) { }

  // @Auth()
  @Post('create-shipment')
  createLoad(
    @Body() createShipmentDto: CreateShipmentDto,
    @GetUser() user: User
  ) {
    return this.shipmentLoadService.createLoad(createShipmentDto, user);
  }

  @Post('update-shipment')
  updateLoad(
    @Body() createShipmentDto: CreateShipmentDto,
  ) {
    return this.shipmentLoadService.updateLoadShipment(createShipmentDto);
  }

  @Get('shipment/:folio')
  findShipment(@Param('folio') folio: string) {
    return this.shipmentLoadService.findAllShipmentLoadByFolio(folio);
  }

  @Get('all-shipments')
  findAllShipment(@Query() paginationDto: PaginationDto) {
    return this.shipmentLoadService.findAllShipments(paginationDto);
  }

  @Get('all-shipments-load')
  findAllShipmentLoad(@Query() paginationDto: PaginationDto) {
    return this.shipmentLoadService.findAllShipmentsLoad(paginationDto);
  }

  @Get('all-shipments-client/:client')
  findAllShipmentByClient(@Param('client') client: string) {
    return this.shipmentLoadService.findAllShipmentsByClient(client);
  }


}
