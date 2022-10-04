import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { UserFields, UserFiledsDocument } from './entities/user-fields.entity';

@Injectable()
export class UserFieldRepository extends EntityRepository<UserFiledsDocument> {
  constructor(
    @InjectModel(UserFields.name) userFieldsModel: Model<UserFiledsDocument>,
  ) {
    super(userFieldsModel);
  }
}
