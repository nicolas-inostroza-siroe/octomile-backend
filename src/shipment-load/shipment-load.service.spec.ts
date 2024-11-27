import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentLoadService } from './shipment-load.service';

describe('ShipmentLoadService', () => {
  let service: ShipmentLoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipmentLoadService],
    }).compile();

    service = module.get<ShipmentLoadService>(ShipmentLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
