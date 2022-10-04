import { Test, TestingModule } from '@nestjs/testing';
import { UnomiProfilesController } from './unomi-profiles.controller';
import { UnomiProfilesService } from './unomi-profiles.service';

describe('UnomiProfilesController', () => {
  let controller: UnomiProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnomiProfilesController],
      providers: [UnomiProfilesService],
    }).compile();

    controller = module.get<UnomiProfilesController>(UnomiProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
