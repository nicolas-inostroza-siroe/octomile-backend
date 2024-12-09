import { PartialType } from '@nestjs/swagger';
import { CreateSortingDto } from './create-sorting.dto';

export class UpdateSortingDto extends PartialType(CreateSortingDto) {}
