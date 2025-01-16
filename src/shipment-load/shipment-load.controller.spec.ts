import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentLoadController } from '@src/shipment-load.controller';
import { ShipmentLoadService } from '@src/shipment-load.service';

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
