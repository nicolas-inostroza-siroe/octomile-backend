import { Controller, Get, Post, Body, Patch, Param, Delete, } from '@nestjs/common';
import { ShipmentLoadService } from './shipment-load.service';
import { CreateInitialShipmentDto, CreateUpdateInitialUpdateDto } from './dto';

@Controller('shipment-load')
export class ShipmentLoadController {
  constructor(private readonly shipmentLoadService: ShipmentLoadService) { }

  @Post('initial-load')
  create(
    @Body() createInitialShipmentDto: CreateInitialShipmentDto,
  ) {
    return this.shipmentLoadService.createInitialLoad(createInitialShipmentDto);
  }

  @Post('initial-load-update')
  initialLoadUpdate(
    @Body() createUpdateInitialUpdateDto: CreateUpdateInitialUpdateDto,
  ) {
    return this.shipmentLoadService.initialLoadUpdate(createUpdateInitialUpdateDto);
  }

  @Get('all-shipments-initial')
  findAllShipmentInitia() {
    return this.shipmentLoadService.findAllShipmentsInitial();
  }

  @Get('all-shipments')
  findAllShitment() {
    return this.shipmentLoadService.findAllShipments();
  }

  @Get('all-shipment-update')
  fillAllShipmentUpdate() {
    return this.shipmentLoadService.fillAllShipmentUpdate();
  }



}
