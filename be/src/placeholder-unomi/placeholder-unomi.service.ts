import { Injectable } from '@nestjs/common';
import { PlaceholderUnomi } from './entities/placeholder-unomi.entity';
import { PlaceholderUnomiRepository } from './placeholder-unomi.repository';
import { CreatePlaceholderUnomiDto } from './dto/create-placeholder-unomi.dto';
import { UpdatePlaceholderUnomiDto } from './dto/update-placeholder-unomi.dto';

@Injectable()
export class PlaceholderUnomiService {
  constructor(
    private readonly placeholderUnomiRepository: PlaceholderUnomiRepository,
  ) {}

  /**
   * save to database placeholder the unomi
   */
  async create(
    createPlaceholderDto: CreatePlaceholderUnomiDto,
  ): Promise<PlaceholderUnomi | undefined> {
    try {
      return await this.placeholderUnomiRepository.create(createPlaceholderDto);
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * get all placeholders unomi to database
   */

  async findAll(): Promise<PlaceholderUnomi[]> {
    try {
      return await this.placeholderUnomiRepository.find({});
    } catch (error) {
      return [];
    }
  }

  /**
   *
   * @param id id the placeholders to get
   * @returns object placeholders
   */
  async findOne(id: string): Promise<PlaceholderUnomi | undefined> {
    try {
      return await this.placeholderUnomiRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * @param updatePlaceholderDto placeholders  to update
   * @returns  placeholder update
   */
  async update(
    updatePlaceholderDto: UpdatePlaceholderUnomiDto,
  ): Promise<PlaceholderUnomi | undefined> {
    try {
      return await this.placeholderUnomiRepository.findOneAndUpdate(
        { _id: updatePlaceholderDto._id },
        updatePlaceholderDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * @param updatePlaceholderDto many placeholders to update
   * @returns  array placeholder update
   */
  async updateMany(
    updatePlaceholderDto: UpdatePlaceholderUnomiDto,
  ): Promise<boolean | undefined> {
    try {
      return await this.placeholderUnomiRepository.updateMany(
        updatePlaceholderDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * @param id id to placeholder delete
   * @returns true or false as eliminated
   */
  async remove(id: string): Promise<boolean> {
    try {
      return await this.placeholderUnomiRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * @returns placeholders to replace in the template
   */
  async findAllReplace() {
    try {
      const response = await new Promise<any[]>((resolve) => {
        resolve(this.placeholderUnomiRepository.find({}));
      });
      return JSON.parse(JSON.stringify(response));
    } catch (error) {
      return [];
    }
  }
}
