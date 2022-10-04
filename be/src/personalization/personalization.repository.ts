import { Model } from 'mongoose';
import {
  Personalization,
  PersonalizationDocument,
} from './entities/personalization.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class PersonalizationRepository extends EntityRepository<PersonalizationDocument> {
  constructor(
    @InjectModel(Personalization.name)
    personalizationModel: Model<PersonalizationDocument>,
  ) {
    super(personalizationModel);
  }
}
