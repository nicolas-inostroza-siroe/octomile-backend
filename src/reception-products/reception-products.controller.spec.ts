import { Test, TestingModule } from '@nestjs/testing';
import { ReceptionProductsController } from './reception-products.controller';
import { ReceptionProductsService } from './reception-products.service';

describe('ReceptionProductsController', () => {
  let controller: ReceptionProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceptionProductsController],
      providers: [ReceptionProductsService],
    }).compile();

    controller = module.get<ReceptionProductsController>(ReceptionProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
