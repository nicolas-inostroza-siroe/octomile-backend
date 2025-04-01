import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query, StreamableFile, Res, HttpStatus } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('createDriver')
  @UseInterceptors(
      FileFieldsInterceptor([
          { name: 'permiso_circulacion', maxCount: 1 },
          { name: 'revision_tecnica', maxCount: 1 },
          { name: 'soap_al_dia', maxCount: 1 },
          { name: 'fotografia1', maxCount: 1 },
          { name: 'fotografia2', maxCount: 1 },
          { name: 'fotografia3', maxCount: 1 },
          { name: 'fotografia4', maxCount: 1 },
          { name: 'Carnet_de_identidad_vigente', maxCount: 1 },
          { name: 'licencia_conductor_vigente', maxCount: 1 },
          { name: 'certificado_antecedentes_vigente', maxCount: 1 },
          { name: 'certificado_anotaciones_vigente', maxCount: 1 },
      ])
  )
  async create(
      @Body() createDriverDto: CreateDriverDto,
      @UploadedFiles() files: Record<string, Express.Multer.File[]>
  ) {

      const fileArray = Object.entries(files).map(([fieldname, fileArr]) => ({
          ...fileArr[0],
          fieldname
      }));
      
      return await this.driversService.create(createDriverDto, fileArray);
  }

  @Get('getAll')
  async getAll() {
      return await this.driversService.findAll();
  }

  @Patch('updateStatus/:id')
  async updateStatus(
      @Param('id') id: number,
      @Body('status') status: string
  ) {
      return await this.driversService.updateStatus(id, status);
  }

  @Patch('update/:id')
  @UseInterceptors(
      FileFieldsInterceptor([
          { name: 'permiso_circulacion', maxCount: 1 },
          { name: 'revision_tecnica', maxCount: 1 },
          { name: 'soap_al_dia', maxCount: 1 },
          { name: 'fotografia1', maxCount: 1 },
          { name: 'fotografia2', maxCount: 1 },
          { name: 'fotografia3', maxCount: 1 },
          { name: 'fotografia4', maxCount: 1 },
          { name: 'Carnet_de_identidad_vigente', maxCount: 1 },
          { name: 'licencia_conductor_vigente', maxCount: 1 },
          { name: 'certificado_antecedentes_vigente', maxCount: 1 },
          { name: 'certificado_anotaciones_vigente', maxCount: 1 },
      ])
  )
  async update(
      @Param('id') id: number,
      @Body() updateDriverDto: Partial<CreateDriverDto>,
      @UploadedFiles() files: Record<string, Express.Multer.File[]>
  ) {
      const fileArray = Object.entries(files).map(([fieldname, fileArr]) => ({
          ...fileArr[0],
          fieldname,
      }));
      
      return await this.driversService.update(id, updateDriverDto, fileArray);
  }


  @Get('getListEmpresas')
  async getEmpresas() {
      return await this.driversService.getEmpresas();
  }

  @Delete('deleteAll')
  async deleteAll() {
      await this.driversService.deleteAll();
      return { message: 'All drivers deleted successfully' };
  }

  @Post('createDrivers')
  async createDrivers(
      @Body() createDriversDto: CreateDriverDto[]
  ) {
      return await this.driversService.createMultiple(createDriversDto);
  }

  @Get('active')
  async getActiveDrivers() {
      const drivers = await this.driversService.findActiveDrivers();
      return {
          status: HttpStatus.OK,
          message: 'Active drivers retrieved successfully',
          data: drivers
      };
  }

  @Get('by-patente/:patente')
  async findOwnerByPatente(@Param('patente') patente: string) {
      const ownerData = await this.driversService.findOwnerByPatente(patente);
      return {
          status: HttpStatus.OK,
          message: 'Owner information retrieved successfully',
          data: ownerData
      };
  }

  @Get('download-all')
  async downloadAllDriversWithDocuments(@Res() res: Response) {
    const { buffer, filename } = await this.driversService.downloadDriversWithDocuments();
    
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }
}
