import { Controller, Get, Post, Body, Patch, Param, Delete, } from '@nestjs/common';
import { ShipmentLoadService } from './shipment-load.service';
import { CreateInitialShipmentDto } from './dto';

@Controller('shipment-load')
export class ShipmentLoadController {
  constructor(private readonly shipmentLoadService: ShipmentLoadService) { }

  @Post('initial-load')
  create(
    @Body() createInitialShipmentDto: CreateInitialShipmentDto,
  ) {
    return this.shipmentLoadService.createInitialLoad(createInitialShipmentDto);
  }

  @Get('all-shipments')
  findAllShipment() {
    return this.shipmentLoadService.findAllShipments();
  }


}
