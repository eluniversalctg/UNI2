import { Model } from 'mongoose';
import {
  ProfileAnalitic,
  ProfileAnaliticDocument,
} from './entities/profile-analitic.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class ProfileAnaliticRepository extends EntityRepository<ProfileAnaliticDocument> {
  constructor(
    @InjectModel(ProfileAnalitic.name)
    ProfileAnaliticModel: Model<ProfileAnaliticDocument>,
  ) {
    super(ProfileAnaliticModel);
  }
}
