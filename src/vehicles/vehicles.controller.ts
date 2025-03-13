import { Controller, Post, Body, Param, UseInterceptors, UploadedFiles, ParseIntPipe, Get, Patch } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './Dto/create-vehicle.dto';
import { VehicleEntity } from './entities/vehicles.entity';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateVehicleStatusDto } from './Dto/update-vehicle-status.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) { }

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // Propiedades del DTO
        patente: { type: 'string' },
        tipo_vehiculo: { type: 'string' },
        marca: { type: 'string' },
        modelo: { type: 'string' },
        ano_fabricacion: { type: 'integer' },
        id_propietario: { type: 'integer' },
        creado_por: { type: 'string' },

        // Archivos
        fotografia1: {
          type: 'string',
          format: 'binary'
        },
        fotografia2: {
          type: 'string',
          format: 'binary'
        },
        fotografia3: {
          type: 'string',
          format: 'binary'
        },
        fotografia4: {
          type: 'string',
          format: 'binary'
        },
        permiso_circulacion: {
          type: 'string',
          format: 'binary'
        },
        revision_tecnica: {
          type: 'string',
          format: 'binary'
        },
        seguro: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'fotografia1', maxCount: 1 },
    { name: 'fotografia2', maxCount: 1 },
    { name: 'fotografia3', maxCount: 1 },
    { name: 'fotografia4', maxCount: 1 },
    { name: 'permiso_circulacion', maxCount: 1 },
    { name: 'revision_tecnica', maxCount: 1 },
    { name: 'seguro', maxCount: 1 }
  ]))
  async createVehicle(
    @Body() createVehicleDto: CreateVehicleDto,
    @UploadedFiles() files: {
      fotografia1?: Express.Multer.File[],
      fotografia2?: Express.Multer.File[],
      fotografia3?: Express.Multer.File[],
      fotografia4?: Express.Multer.File[],
      permiso_circulacion?: Express.Multer.File[],
      revision_tecnica?: Express.Multer.File[],
      seguro?: Express.Multer.File[]
    }
  ): Promise<VehicleEntity> {
    return this.vehiclesService.create(createVehicleDto, files);
  }


  @Get('getAll')
  async GetAll(): Promise<VehicleEntity[]> {
    return this.vehiclesService.findAll();
  }


  @Patch(':id/status')
@ApiOperation({ summary: 'Actualizar propietario y/o estado de un vehículo' })
@ApiResponse({
  status: 200,
  description: 'Vehículo actualizado exitosamente',
  type: VehicleEntity
})
@ApiResponse({ status: 404, description: 'Vehículo o propietario no encontrado' })
async updateVehicleStatus(
  @Param('id', ParseIntPipe) vehiculoId: number,
  @Body() updateDto: UpdateVehicleStatusDto
): Promise<VehicleEntity> {
  return this.vehiclesService.updateVehicleStatus(vehiculoId, updateDto);
}

  

}
