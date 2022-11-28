import { Injectable } from '@nestjs/common';
import { Weighing } from './entities/weighing.entity';
import { WeighingRepository } from './weighing.repository';
import { CreateWeighingDto } from './dto/create-weighing.dto';
import { UpdateWeighingDto } from './dto/update-weighing.dto';

@Injectable()
export class WeighingService {
  constructor(private readonly weighingRepository: WeighingRepository) {}

  /**
   * save to database weighing
   */
  async create(
    createWeighingDto: CreateWeighingDto,
  ): Promise<Weighing | undefined> {
    try {
      return await this.weighingRepository.create(createWeighingDto);
    } catch (error) {
      return undefined;
    }
  }

  /**
   * get all to database
   */
  async findAll(): Promise<Weighing[]> {
    try {
      return await this.weighingRepository.find({});
    } catch (error) {
      return [];
    }
  }

  /**
   * get to database one weighing
   */

  async findOne(id: string): Promise<Weighing | undefined> {
    try {
      return await this.weighingRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  async findSite(id: string): Promise<Weighing | undefined> {
    try {
      return await this.weighingRepository.findOne({ site: id });
    } catch (error) {
      return undefined;
    }
  }

  /**
   * update weighing
   */
  async update(
    updateWeighingDto: UpdateWeighingDto,
  ): Promise<Weighing | undefined> {
    try {
      return await this.weighingRepository.findOneAndUpdate(
        { _id: updateWeighingDto._id },
        updateWeighingDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   * delete to database weighing
   */
  async remove(id: string): Promise<boolean> {
    try {
      return await this.weighingRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }
}
