import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { DeliveryContainDto } from "./delivery-contain.dto";
import { DeliveryEntity } from "../entities/sessiondelivery.entity";


export class CreateDeliveryDto{
@ApiProperty({ description: 'Patente generica' })
@IsOptional()
@IsString()
patente_generica: string;

@ApiProperty({ description: 'Patente real' })
@IsOptional()
@IsString()
patente_real: string;

@ApiProperty({ description: 'Conductor' })
@IsOptional()
@IsString()
conductor: string;

@ApiProperty({ description: 'Empresa asociada' })
@IsOptional()
@IsString()
empresa_asociada: string;

@ApiProperty({ description: 'Destino ruta' })
@IsOptional()
@IsString()
destino_ruta: string;

@ApiProperty({ description: 'Guias' })
@IsOptional()
@IsString()
guias: string;

@ApiProperty({ description: 'Status' })
@IsOptional()
@IsString()
status: string;

@ApiProperty({ description: 'Gestor' })
@IsOptional()
@IsString()
gestor: string;

@ApiProperty({ description: 'Delivery contains' })
@IsArray()
deliveryContains: DeliveryContainDto[];
delivery:DeliveryEntity;
}