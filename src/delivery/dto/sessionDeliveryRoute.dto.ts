import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";


export class sessionDeliveryRoutesDto{

@ApiProperty()
@IsString()
@IsOptional()
numero: string;

@ApiProperty()
@IsString()
@IsOptional()
patente:string;

@ApiProperty()
@IsNumber()
@IsOptional()
sessionDelivery_id: number;

@ApiProperty()
@IsString()
@IsOptional()
status:string;

@ApiProperty()
@IsString()
@IsOptional()
gestor:string ;

@ApiProperty()
@IsString()
@IsOptional()
gestion:string;

}