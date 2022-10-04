import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageRepository } from './images.repository';
import { ImagesController } from './images.controller';
import { Image, ImageSchema } from './entities/image.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  exports: [ImagesService],
  controllers: [ImagesController],
  providers: [ImagesService, ImageRepository],
})
export class ImagesModule {}
