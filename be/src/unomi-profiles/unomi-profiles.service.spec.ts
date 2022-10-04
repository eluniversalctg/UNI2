import { Test, TestingModule } from '@nestjs/testing';
import { UnomiProfilesService } from './unomi-profiles.service';

describe('UnomiProfilesService', () => {
  let service: UnomiProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnomiProfilesService],
    }).compile();

    service = module.get<UnomiProfilesService>(UnomiProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
