import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentLoadModule } from './shipment-load/shipment-load.module';
import { SortingModule } from './sorting/sorting.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { OperatorsModule } from './operators/operators.module';
import { WebSocketModule } from './web-socket/web-socket.module';
import { CompanyModule } from './company/company.module';
import { DriversModule } from './drivers/drivers.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DeliveryModule } from './delivery/delivery.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { OwnersModule } from './owners/owners.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/api/uploads', // Match with your global prefix
      serveStaticOptions: {
        index: false,
        fallthrough: true
      }
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      // logging: true,
    }),

    ShipmentLoadModule,
    AuthModule,
    SortingModule,
    SessionsModule,
    OperatorsModule,
    WebSocketModule,
    CompanyModule,
    DriversModule,
    DeliveryModule,
    VehiclesModule,
    OwnersModule
  ],

})
export class AppModule {

}