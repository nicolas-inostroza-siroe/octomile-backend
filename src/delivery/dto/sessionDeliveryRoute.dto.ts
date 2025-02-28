import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { RouteDetailsDto } from "./routeDetails.dto";
import { Type } from "class-transformer";


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
@IsString()
bind:string;

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

@ApiProperty({ type: [RouteDetailsDto] })
@IsArray()
@ValidateNested({ each: true })
@Type(() => RouteDetailsDto)
guias: RouteDetailsDto[];


}