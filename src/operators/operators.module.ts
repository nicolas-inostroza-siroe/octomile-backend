import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { OperatorsController } from './operators.controller';
import {Operator} from './entities/operator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
imports: [TypeOrmModule.forFeature([Operator]), HttpModule],
providers: [OperatorsService],
exports: [],
controllers: [OperatorsController]

})
export class OperatorsModule {}
