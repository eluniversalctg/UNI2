import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image, ImageDocument } from './entities/image.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class ImageRepository extends EntityRepository<ImageDocument> {
  constructor(@InjectModel(Image.name) imageModel: Model<ImageDocument>) {
    super(imageModel);
  }
}
