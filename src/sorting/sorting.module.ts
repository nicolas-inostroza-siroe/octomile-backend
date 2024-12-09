import { Module } from '@nestjs/common';
import { SortingService } from './sorting.service';
import { SortingController } from './sorting.controller';

@Module({
  controllers: [SortingController],
  providers: [SortingService],
})
export class SortingModule {}
