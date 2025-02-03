import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class UpdateStatusDto {
  
    @ApiProperty({ description: 'Estado de la empresa' })
    @IsString()
    @IsNotEmpty()
    status: string;
}