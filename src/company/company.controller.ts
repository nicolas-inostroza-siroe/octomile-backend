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

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateCompanyDto: CreateCompanyDto
  ) {
    await this.companyService.update(id, updateCompanyDto);
    return {
      message: 'success',
      statusCode: 200
    };
  }

  @Patch('update-status/:id')
    async updateStatus(@Param('id') id: number, @Body() updateStatusDto: UpdateStatusDto) {
  
      await this.companyService.updateStatus(id, updateStatusDto.status);
  
  return {message: 'Company status updated successfully',statusCode: 200};
} 






}
