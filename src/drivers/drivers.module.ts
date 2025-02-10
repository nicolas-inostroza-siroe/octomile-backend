import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversEntity } from './entities/drivers.entity';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { CompanyEntity } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriversEntity]),TypeOrmModule.forFeature([CompanyEntity])],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService]
})
export class DriversModule {}