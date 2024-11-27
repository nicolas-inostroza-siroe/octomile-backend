import { Module } from '@nestjs/common';
import { SenhafferApiService } from './senhaffer-api.service';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule],
  providers: [SenhafferApiService],
  exports: [SenhafferApiService,]
})
export class SenhafferApiModule { }
