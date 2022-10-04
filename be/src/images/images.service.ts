import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Image } from './entities/image.entity';
import { ImageRepository } from './images.repository';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    private readonly config: ConfigService,
    private readonly imageRepository: ImageRepository,
  ) {}

  async create(files) {
    try {
      const response = [];
      const imageSave: CreateImageDto[] = [];
      files.forEach((file) => {
        const fileReponse = {
          originalname: file.originalname,
          filename: file.filename,
        };
        response.push(fileReponse);
      });

      for (let i = 0; i < response.length; i++) {
        const image: CreateImageDto = {
          name: response[i].filename,
          url: `${this.config.get<string>('PUBLIC_IMAGES')}/${
            response[i].filename
          }`,
        };
        imageSave.push(image);
      }
      return await this.imageRepository.create(imageSave);
    } catch (error) {
      return undefined;
    }
  }

  async findAll(): Promise<Image[]> {
    try {
      return await this.imageRepository.find({});
    } catch (error) {
      return [];
    }
  }

  async findOne(id: string): Promise<Image | undefined> {
    try {
      return await this.imageRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  async update(updateImageDto: UpdateImageDto): Promise<Image | undefined> {
    try {
      return await this.imageRepository.findOneAndUpdate(
        { _id: updateImageDto._id },
        updateImageDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      return await this.imageRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }
}
