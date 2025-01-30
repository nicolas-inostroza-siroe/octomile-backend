import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyEntity } from './entities/company.entity';


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
      message: 'Company updated successfully',
      statusCode: 200
    };
  }




}
