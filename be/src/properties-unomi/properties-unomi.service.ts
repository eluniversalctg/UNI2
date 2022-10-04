import { Injectable } from '@nestjs/common';
import { PropertiesUnomi } from './entities/properties-unomi.entity';
import { PropertiesUnomiRepository } from './properties-unomi.repository';
import { CreatePropertiesUnomiDto } from './dto/create-properties-unomi.dto';
import { UpdatePropertiesUnomiDto } from './dto/update-properties-unomi.dto';

@Injectable()
export class PropertiesUnomiService {
  constructor(
    private readonly propertiesUnomiRepository: PropertiesUnomiRepository,
  ) {}

  /**
   * save to database properties the unomi
   */
  async create(
    createPropertiesUnomiDto: CreatePropertiesUnomiDto,
  ): Promise<PropertiesUnomi | undefined> {
    try {
      return await this.propertiesUnomiRepository.create(
        createPropertiesUnomiDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   * get all to database properties the unomi
   */
  async findAll(): Promise<PropertiesUnomi[]> {
    try {
      return await this.propertiesUnomiRepository.find({});
    } catch (error) {
      return [];
    }
  }

  /**
   * get one to database properties the unomi
   */
  async findOne(id: string): Promise<PropertiesUnomi | undefined> {
    try {
      return await this.propertiesUnomiRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  /**
   * update to database properties the unomi
   */
  async update(
    updatePropertiesUnomiDto: UpdatePropertiesUnomiDto,
  ): Promise<PropertiesUnomi | undefined> {
    try {
      return await this.propertiesUnomiRepository.findOneAndUpdate(
        { _id: updatePropertiesUnomiDto._id },
        updatePropertiesUnomiDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   * update to database properties the unomi
   */
  async remove(id: string): Promise<boolean> {
    try {
      return await this.propertiesUnomiRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }
}
