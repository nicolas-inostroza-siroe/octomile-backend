import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(CompanyEntity)
        private readonly companyRepository: Repository<CompanyEntity>,
      ) {}

      async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
        try {
          const company = this.companyRepository.create(createCompanyDto);
          return await this.companyRepository.save(company);
        } catch (error) {
          throw new BadRequestException('Error creating company');
        }
    }

    async findAll(): Promise<CompanyEntity[]> {
      return await this.companyRepository.find();
    }

}
