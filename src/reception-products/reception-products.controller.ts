import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReceptionProductsService } from './reception-products.service';
import { CreateReceptionProductDto } from './dto/create-reception-product.dto';
import { UpdateReceptionProductDto } from './dto/update-reception-product.dto';

@Controller('reception-products')
export class ReceptionProductsController {
  constructor(private readonly receptionProductsService: ReceptionProductsService) {}

  @Post()
  create(@Body() createReceptionProductDto: CreateReceptionProductDto[]) {
    return this.receptionProductsService.create(createReceptionProductDto);
  }

  @Post('single')
  createSingle(@Body() createSingleProductDto: any) {
    return this.receptionProductsService.createSingle(createSingleProductDto);
  }

  @Get('get')
  findAll(
    @Query('pageIndex') pageIndex: string = '0',
    @Query('pageSize') pageSize: string = '10',
    @Query('searchQuery') searchQuery: string = '',
    @Query('selectedDate') selectedDate: string = '',
    @Query('selectStatus') selectStatus: string = '',
    @Query('selectTypeDate') selectTypeDate: string = ''
  ) {
    const page = parseInt(pageIndex);
    const size = parseInt(pageSize);

    return this.receptionProductsService.findAll(page, size, searchQuery, selectedDate, selectStatus, selectTypeDate);
  }

  @Get('get_destination')
  findDestination(
    @Query('pageIndex') pageIndex: string = '0',
    @Query('pageSize') pageSize: string = '10',
    @Query('searchQuery') searchQuery: string = '',
    @Query('selectedDate') selectedDate: string = '',
    @Query('selectTypeBy') selectTypeBy: string = '',
    @Query('selectTypeDate') selectTypeDate: string = '',
    @Query('selectStatus') selectStatus: string = ''
  ) {
    const page = parseInt(pageIndex);
    const size = parseInt(pageSize);

    return this.receptionProductsService.findDestination(page, size, searchQuery, selectedDate, selectTypeBy, selectTypeDate, selectStatus);
  }

  @Post('postExcel')
  async insertProducts(@Body() CreateReceptionProductDto: CreateReceptionProductDto[]){
    return this.receptionProductsService.create(CreateReceptionProductDto);
  }

  @Post('scan')
  async scanProduct(
    @Body('codigoProducto') codigoProducto: string, 
    @Body('pinchadoPorId') pinchadoPorId: string,
    @Body('pinchadoPorName') pinchadoPorName: string,
    @Body('fecha') fecha: Date
  ){
    return this.receptionProductsService.scan(codigoProducto, pinchadoPorId, pinchadoPorName, fecha)
  }

  @Post('scanDIS')
  async scanProductDIS(
    @Body('codigoProducto') codigoProducto: string, 
    @Body('pinchadoPorId') pinchadoPorId: string,
    @Body('pinchadoPorName') pinchadoPorName: string,
    @Body('origen') origen: string
  ){
    return this.receptionProductsService.scanDIS(codigoProducto, pinchadoPorId, pinchadoPorName, origen)
  }

  @Post('newDestination')
  async newDestination(
    @Body('id') id: string,
    @Body('newDestination') newDestination: string,
    @Body('userId') userId: string
  ){
    return this.receptionProductsService.newDestination(id, newDestination, userId)
  }

  @Get('searchDuplicate')
  async searchDuplicate(
    @Query('id') id:string
  ){
    return this.receptionProductsService.searchDuplicate(id);
  }

  @Get("dataVoucher")
  async getVoucher(
    @Query('init') init: Date,
    @Query('end') end: Date,
    @Query('driver') driver: string
  ){
    return this.receptionProductsService.getVoucher(init, end, driver)
  }
}
