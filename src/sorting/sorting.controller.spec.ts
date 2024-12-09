import { Test, TestingModule } from '@nestjs/testing';
import { SortingController } from './sorting.controller';
import { SortingService } from './sorting.service';

describe('SortingController', () => {
  let controller: SortingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SortingController],
      providers: [SortingService],
    }).compile();

    controller = module.get<SortingController>(SortingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
