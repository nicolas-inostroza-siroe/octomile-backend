import { Module } from '@nestjs/common';
import { ReceptionProductsService } from './reception-products.service';
import { ReceptionProductsController } from './reception-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceptionProduct } from './entities/reception-product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ReceptionProduct])],
  controllers: [ReceptionProductsController],
  providers: [ReceptionProductsService],
})
export class ReceptionProductsModule {}
