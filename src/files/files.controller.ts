import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, filesFilter } from './helpers';
import { excelData } from './interfaces/file.interfaces';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter
  }))
  oneFile(@UploadedFile() file: Express.Multer.File) {
    // return this.filesService.leerExcelChino(file)
    return this.filesService.leerExcelComun(file);
  }

  // multipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
  @Post('upload-multiple')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 },
  ]))
  async multipleFiles(@UploadedFiles() xlsxs: excelData) {
    const data = this.filesService.leerDatosExcel(xlsxs);
    return data;

  }

}
