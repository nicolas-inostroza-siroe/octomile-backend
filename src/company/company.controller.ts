import { Controller, Post, Body, Get, Put, Param, Patch } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyEntity } from './entities/company.entity';
import { UpdateStatusDto } from './dto/update-status.dto';


@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post("create")
  async create(@Body() createCompanyDto: CreateCompanyDto){
     await this.companyService.create(createCompanyDto);

     return {
      message: 'Company created successfully',
      statusCode: 201
    };
  }


  @Get("getAll")
  async findAll() {
    const companies = await this.companyService.findAll();
    return {
      message: 'Companies retrieved successfully',
      statusCode: 200,
      data: companies
    };
  }

  @Put('update')
  @ApiOperation({ summary: 'Actualizar una empresa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Empresa actualizada exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Empresa no encontrada' 
  })
  async update(
    @Body() updateCompanyDto: UpdateStatusDto
  ) {
    await this.companyService.update(updateCompanyDto.id, updateCompanyDto);
    return {
      message: 'Empresa actualizada exitosamente',
      statusCode: 200
    };
  }

  @Patch('update-status/:id')
    async updateStatus(@Param('id') id: number, @Body() updateStatusDto: UpdateStatusDto) {
  
      await this.companyService.updateStatus(id, updateStatusDto.status);
  
  return {message: 'Company status updated successfully',statusCode: 200};
} 




}
