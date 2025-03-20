import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PinchazoDisDto {
    @ApiProperty({
        description: 'Código del producto DIS',
        example: 'DIS-123456'
    })
    @IsString()
    codigoProducto: string;

    @ApiProperty({
        description: 'ID de la ruta donde se escaneará el producto',
        example: 1
    })
    @IsInt()
    idRoute: number;

    @ApiProperty({
        description: 'ID del usuario que está realizando el pinchazo',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsUUID()
    pinchadoPorId: string;

    @IsString()
    @IsOptional()
    pinchadoPorName: string;

    @ApiProperty({
        description: 'Información adicional del producto (opcional)',
        example: 'Producto adicional',
        required: false
    })
    @IsString()
    @IsOptional()
    info?: string;
}