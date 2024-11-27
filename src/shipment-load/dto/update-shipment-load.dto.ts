import { PartialType } from '@nestjs/mapped-types';
import { CreateShipmentLoadDto } from './create-shipment-load.dto';

export class UpdateShipmentLoadDto extends PartialType(CreateShipmentLoadDto) {}
