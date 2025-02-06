import { Test, TestingModule } from '@nestjs/testing';
import { WafflesController } from './waffles.controller';
import { WafflesService } from './waffles.service';

describe('WafflesController', () => {
  let controller: WafflesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WafflesController],
      providers: [WafflesService],
    }).compile();

    controller = module.get<WafflesController>(WafflesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
