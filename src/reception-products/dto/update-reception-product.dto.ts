import { PartialType } from '@nestjs/swagger';
import { CreateReceptionProductDto } from './create-reception-product.dto';

export class UpdateReceptionProductDto extends PartialType(CreateReceptionProductDto) {}
