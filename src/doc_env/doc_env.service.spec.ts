import { Test, TestingModule } from '@nestjs/testing';
import { DocEnvService } from './doc_env.service';

describe('DocEnvService', () => {
  let service: DocEnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocEnvService],
    }).compile();

    service = module.get<DocEnvService>(DocEnvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
