import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentLoadModule } from './shipment-load/shipment-load.module';
import { SortingModule } from './sorting/sorting.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { OperatorsModule } from './operators/operators.module';




@Module({
  imports: [
    ConfigModule.forRoot(),

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
    OperatorsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}