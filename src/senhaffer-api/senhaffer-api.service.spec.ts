import { Test, TestingModule } from '@nestjs/testing';
import { SenhafferApiService } from './senhaffer-api.service';

describe('SenhafferApiService', () => {
  let service: SenhafferApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SenhafferApiService],
    }).compile();

    service = module.get<SenhafferApiService>(SenhafferApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
