import { Test, TestingModule } from '@nestjs/testing';
import { UserFieldsController } from './user-fields.controller';
import { UserFieldsService } from './user-fields.service';

describe('UserfieldsController', () => {
  let controller: UserFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFieldsController],
      providers: [UserFieldsService],
    }).compile();

    controller = module.get<UserFieldsController>(UserFieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
