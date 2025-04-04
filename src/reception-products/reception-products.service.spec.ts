import { Test, TestingModule } from '@nestjs/testing';
import { ReceptionProductsService } from './reception-products.service';

describe('ReceptionProductsService', () => {
  let service: ReceptionProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceptionProductsService],
    }).compile();

    service = module.get<ReceptionProductsService>(ReceptionProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
