import { Controller, Get, Post, Body, Patch, Param, Delete, Query, } from '@nestjs/common';
import { ShipmentLoadService } from './shipment-load.service';
import { CreateInitialShipmentDto, CreateUpdateInitialUpdateDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('shipment-load')
export class ShipmentLoadController {
  constructor(private readonly shipmentLoadService: ShipmentLoadService) { }

  @Post('initial-load')
  createInitialLoad(
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

  @Get('shipment-initial/:folio')
  findShipmentInitialLoadByFolio(@Param('folio') folio: string) {
    return this.shipmentLoadService.findAllShipmentInitialByFolio(folio);
  }

  @Get('shipment-update/:folio')
  findShipmentUpdateLoadByFolio(@Param('folio') folio: string) {
    return this.shipmentLoadService.findAllShipmentUpdateByFolio(folio);
  }

  @Get('all-shipments-initial')
  findAllShipmentInitia(@Query() paginationDto: PaginationDto) {
    return this.shipmentLoadService.findAllShipmentsInitial(paginationDto);
  }

  @Get('all-shipments')
  findAllShitment(@Query() paginationDto: PaginationDto) {
    return this.shipmentLoadService.findAllShipments(paginationDto);
  }

  @Get('all-shipments-update')
  fillAllShipmentUpdate(@Query() paginationDto: PaginationDto) {
    return this.shipmentLoadService.fillAllShipmentUpdate(paginationDto);
  }



}
