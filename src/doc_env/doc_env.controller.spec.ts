import { Test, TestingModule } from '@nestjs/testing';
import { DocEnvController } from './doc_env.controller';
import { DocEnvService } from './doc_env.service';

describe('DocEnvController', () => {
  let controller: DocEnvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocEnvController],
      providers: [DocEnvService],
    }).compile();

    controller = module.get<DocEnvController>(DocEnvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
