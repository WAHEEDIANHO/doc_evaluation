import { Test, TestingModule } from '@nestjs/testing';
import { MailerserviceService } from './mailerservice.service';

describe('MailerserviceService', () => {
  let service: MailerserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerserviceService],
    }).compile();

    service = module.get<MailerserviceService>(MailerserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
