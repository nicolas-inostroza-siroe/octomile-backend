import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReceptionProductsService } from './reception-products.service';
import { CreateReceptionProductDto } from './dto/create-reception-product.dto';
import { UpdateReceptionProductDto } from './dto/update-reception-product.dto';

@Controller('reception-products')
export class ReceptionProductsController {
  constructor(private readonly receptionProductsService: ReceptionProductsService) {}

  // @Post()
  // create(@Body() createReceptionProductDto: CreateReceptionProductDto) {
  //   return this.receptionProductsService.create(createReceptionProductDto);
  // }

  
  // @Get(':id')
  // findOne(@Param('id') id: string) {
    //   return this.receptionProductsService.findOne(+id);
    // }
    
    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateReceptionProductDto: UpdateReceptionProductDto) {
      //   return this.receptionProductsService.update(+id, updateReceptionProductDto);
      // }
      
      // @Delete(':id')
      // remove(@Param('id') id: string) {
        //   return this.receptionProductsService.remove(+id);
        // }
        
  @Get('get')
  findAll(
    @Query('pageIndex') pageIndex: string = '0',
    @Query('pageSize') pageSize: string = '10',
    @Query('searchQuery') searchQuery: string = '',
    @Query('selectedDate') selectedDate: string = '',
    @Query('selectTypeBy') selectTypeBy: string = '',
    @Query('selectTypeDate') selectTypeDate: string = ''
  ) {
    const page = parseInt(pageIndex);
    const size = parseInt(pageSize);

    return this.receptionProductsService.findAll(page, size, searchQuery, selectedDate, selectTypeBy, selectTypeDate);
  }

  @Post('postExcel')
  async insertProducts(@Body() CreateReceptionProductDto: CreateReceptionProductDto[]){
    return this.receptionProductsService.create(CreateReceptionProductDto);
  }
}
