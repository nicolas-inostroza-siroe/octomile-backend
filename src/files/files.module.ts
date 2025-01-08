import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { SenhafferApiModule } from '@src/senhaffer-api/senhaffer-api.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    ConfigModule,
    SenhafferApiModule
  ],
})
export class FilesModule { }
