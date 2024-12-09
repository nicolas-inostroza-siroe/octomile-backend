import { Test, TestingModule } from '@nestjs/testing';
import { SortingService } from './sorting.service';

describe('SortingService', () => {
  let service: SortingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SortingService],
    }).compile();

    service = module.get<SortingService>(SortingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
