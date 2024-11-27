import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentLoadController } from './shipment-load.controller';
import { ShipmentLoadService } from './shipment-load.service';

describe('ShipmentLoadController', () => {
  let controller: ShipmentLoadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipmentLoadController],
      providers: [ShipmentLoadService],
    }).compile();

    controller = module.get<ShipmentLoadController>(ShipmentLoadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
