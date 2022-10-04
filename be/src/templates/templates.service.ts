import { Injectable } from '@nestjs/common';
import { Template } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateRepository } from './templates.repository';

@Injectable()
export class TemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async create(
    createTemplateDto: CreateTemplateDto,
  ): Promise<Template | undefined> {
    try {
      return await this.templateRepository.create(createTemplateDto);
    } catch (error) {
      return undefined;
    }
  }

  async findAll(): Promise<Template[]> {
    try {
      return await this.templateRepository.find({});
    } catch (error) {
      return [];
    }
  }

  async findOne(id: string): Promise<Template | undefined> {
    try {
      return await this.templateRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  async update(
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template | undefined> {
    try {
      return await this.templateRepository.findOneAndUpdate(
        { _id: updateTemplateDto._id },
        updateTemplateDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      return await this.templateRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  async updateMany(
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<boolean | undefined> {
    try {
      return await this.templateRepository.updateMany(updateTemplateDto);
    } catch (error) {
      return undefined;
    }
  }
}
