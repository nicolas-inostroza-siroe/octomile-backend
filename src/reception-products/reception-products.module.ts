import { Module } from '@nestjs/common';
import { ReceptionProductsService } from './reception-products.service';
import { ReceptionProductsController } from './reception-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceptionProduct } from './entities/reception-product.entity'
import { webSocketGateway } from 'src/web-socket/web-socket.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ReceptionProduct, ])],
  controllers: [ReceptionProductsController],
  providers: [ReceptionProductsService, webSocketGateway],
})
export class ReceptionProductsModule {}
