import { Test, TestingModule } from '@nestjs/testing';
import { WafflesService } from './waffles.service';

describe('WafflesService', () => {
  let service: WafflesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WafflesService],
    }).compile();

    service = module.get<WafflesService>(WafflesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
