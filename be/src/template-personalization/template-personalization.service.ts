import { Injectable } from '@nestjs/common';
import { TemplatePersonalization } from './entities/template-personalization.entity';
import { TemplatePersonalizationRepository } from './template-personalization.repository';
import { CreateTemplatePersonalizationDto } from './dto/create-template-personalization.dto';
import { UpdateTemplatePersonalizationDto } from './dto/update-template-personalization.dto';

@Injectable()
export class TemplatePersonalizationService {
  constructor(
    private readonly templatePersonalizationRepository: TemplatePersonalizationRepository,
  ) {}

  async create(
    createTemplatePersonalizationDto: CreateTemplatePersonalizationDto,
  ): Promise<TemplatePersonalization | undefined> {
    try {
      return await this.templatePersonalizationRepository.create(
        createTemplatePersonalizationDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  async findAll(): Promise<TemplatePersonalization[]> {
    try {
      return await this.templatePersonalizationRepository.find({});
    } catch (error) {
      return [];
    }
  }

  async findOne(id: string): Promise<TemplatePersonalization | undefined> {
    try {
      return await this.templatePersonalizationRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  async update(
    updateTemplatePersonalizationDto: UpdateTemplatePersonalizationDto,
  ): Promise<TemplatePersonalization | undefined> {
    try {
      return await this.templatePersonalizationRepository.findOneAndUpdate(
        { _id: updateTemplatePersonalizationDto._id },
        updateTemplatePersonalizationDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      return await this.templatePersonalizationRepository.deleteMany({
        _id: id,
      });
    } catch (error) {
      return undefined;
    }
  }

  async findAllReplace() {
    try {
      const response = await new Promise<any[]>((resolve) => {
        resolve(this.templatePersonalizationRepository.find({}));
      });
      return JSON.parse(JSON.stringify(response));
    } catch (error) {
      return [];
    }
  }

  async updateMany(
    updateTemplatePersonalizationDto: UpdateTemplatePersonalizationDto,
  ): Promise<boolean | undefined> {
    try {
      return await this.templatePersonalizationRepository.updateMany(
        updateTemplatePersonalizationDto,
      );
    } catch (error) {
      return undefined;
    }
  }
}
