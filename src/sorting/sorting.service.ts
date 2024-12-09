import { Injectable } from '@nestjs/common';
import { CreateSortingDto } from './dto/create-sorting.dto';
import { UpdateSortingDto } from './dto/update-sorting.dto';

@Injectable()
export class SortingService {
  create(createSortingDto: CreateSortingDto) {
    return 'This action adds a new sorting';
  }

  findAll() {
    return `This action returns all sorting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sorting`;
  }

  update(id: number, updateSortingDto: UpdateSortingDto) {
    return `This action updates a #${id} sorting`;
  }

  remove(id: number) {
    return `This action removes a #${id} sorting`;
  }
}
