import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SortingService } from './sorting.service';
import { CreateSortingDto } from './dto/create-sorting.dto';
import { UpdateSortingDto } from './dto/update-sorting.dto';

@Controller('sorting')
export class SortingController {
  constructor(private readonly sortingService: SortingService) {}

  @Post()
  create(@Body() createSortingDto: CreateSortingDto) {
    return this.sortingService.create(createSortingDto);
  }

  @Get()
  findAll() {
    return this.sortingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sortingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSortingDto: UpdateSortingDto) {
    return this.sortingService.update(+id, updateSortingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sortingService.remove(+id);
  }
}
