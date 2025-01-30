import { Controller, Post, Body, Get } from '@nestjs/common';
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





}
