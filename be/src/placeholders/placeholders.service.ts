import { Injectable } from '@nestjs/common';
import { Placeholder } from './entities/placeholder.entity';
import { PlaceholderRepository } from './placeholders.repository';
import { CreatePlaceholderDto } from './dto/create-placeholder.dto';
import { UpdatePlaceholderDto } from './dto/update-placeholder.dto';

@Injectable()
export class PlaceholdersService {
  constructor(private readonly placeholderRepository: PlaceholderRepository) {}

  /**
   * save to database placeholder the recomendation
   */
  async create(
    createPlaceholderDto: CreatePlaceholderDto,
  ): Promise<Placeholder | undefined> {
    try {
      return await this.placeholderRepository.create(createPlaceholderDto);
    } catch (error) {
      return undefined;
    }
  }

  /**
   * get all to database placeholder the recomendation
   */
  async findAll(): Promise<Placeholder[]> {
    try {
      return await this.placeholderRepository.find({});
    } catch (error) {
      return [];
    }
  }

  /**
   * get to database one placeholder the recomendation
   */

  async findOne(id: string): Promise<Placeholder | undefined> {
    try {
      return await this.placeholderRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  /**
   * update placeholder the recomendation
   */
  async update(
    updatePlaceholderDto: UpdatePlaceholderDto,
  ): Promise<Placeholder | undefined> {
    try {
      return await this.placeholderRepository.findOneAndUpdate(
        { _id: updatePlaceholderDto._id },
        updatePlaceholderDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   * delete to database placeholder the recomendation
   */
  async remove(id: string): Promise<boolean> {
    try {
      return await this.placeholderRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  /**
   * get all to database placeholder the recomendation the type sistem
   */
  async findSystem() {
    try {
      const response = await new Promise<any[]>((resolve) => {
        resolve(this.placeholderRepository.find({ type: 'Sistema' }));
      });
      return JSON.parse(JSON.stringify(response));
    } catch (error) {
      return [];
    }
  }
}
