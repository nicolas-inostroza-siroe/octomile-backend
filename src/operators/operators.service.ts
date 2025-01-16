import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOpertorDto } from './dto/create-operator.dto';
import { Operator } from './entities/operator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class OperatorsService {

  constructor(
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>
  ) { }


  async create(createOperatorDto: CreateOpertorDto) {
    const operator = this.operatorRepository.create({
      ...createOperatorDto,
      min: createOperatorDto.min?.toString(),
      max: createOperatorDto.max?.toString()
    });
    const createOperator = await this.operatorRepository.save(operator);

    return { message: 'Ok', status: HttpStatus.OK, createOperator };

  }

  async getAll() {
    return await this.operatorRepository.find();
  }

  async update(id: number, updateOperatorDto: CreateOpertorDto) {
    try {

      const operator = await this.operatorRepository.findOneBy({ id });

      if (!operator) {
        throw new NotFoundException(`Operator with id ${id} not found`);
      }

      const updatedOperator = this.operatorRepository.create({
        ...operator,
        ...updateOperatorDto,
        id: operator.id,
        min: updateOperatorDto.min?.toString(),
        max: updateOperatorDto.max?.toString()
      });

      const UpdateOperator = await this.operatorRepository.save(updatedOperator);

      return { message: 'Ok', status: HttpStatus.OK, UpdateOperator };

    } catch (error) {
      this.handleDBErrors(error);
    }
  }


  private handleDBErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('Data already exists');
    } else {
      throw new InternalServerErrorException('Internal error');
    }

  }
} 
