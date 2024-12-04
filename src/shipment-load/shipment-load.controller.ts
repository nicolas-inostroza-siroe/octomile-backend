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

  @Post('shipment-update')
  initialLoadUpdate(
    @Body() createUpdateInitialUpdateDto: CreateUpdateInitialUpdateDto,
  ) {
    return this.shipmentLoadService.initialLoadUpdate(createUpdateInitialUpdateDto);
  }

  @Get('shipment/:folio')
  findAll(@Param('folio') folio: string) {
    return this.shipmentLoadService.findShipmentLoadByFolio(folio);
  }


  @Get('all-shipments-initial')
  findAllShipmentInitia() {
    return this.shipmentLoadService.findAllShipmentsInitial();
  }

  @Get('all-shipments')
  findAllShitment() {
    return this.shipmentLoadService.findAllShipments();
  }

  @Get('all-shipments-update')
  fillAllShipmentUpdate() {
    return this.shipmentLoadService.fillAllShipmentUpdate();
  }



}
