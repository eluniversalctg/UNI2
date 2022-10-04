import { Test, TestingModule } from '@nestjs/testing';
import { UserFieldsService } from './user-fields.service';

describe('UserfieldsService', () => {
  let service: UserFieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFieldsService],
    }).compile();

    service = module.get<UserFieldsService>(UserFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
