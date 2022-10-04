import { Injectable } from '@nestjs/common';
import { MatomoParamRepository } from './matomo-params.repository';
import { CreateMatomoParamDto } from './dto/create-matomo-param.dto';
import { UpdateMatomoParamDto } from './dto/update-matomo-param.dto';

@Injectable()
export class MatomoParamsService {
  constructor(private readonly matomoParamRepository: MatomoParamRepository) {}

  /**
   *
   * @param createMatomoParamDto param the matomo to save
   * @returns object to save in the database
   */
  async create(createMatomoParamDto: CreateMatomoParamDto) {
    try {
      return await this.matomoParamRepository.create(createMatomoParamDto);
    } catch (error) {
      return undefined;
    }
  }

  /**
   * get all matomo params to database
   */
  async findAll() {
    try {
      return await this.matomoParamRepository.find({});
    } catch (error) {
      return [];
    }
  }

  /**
   *
   * @param updateMatomoParamDto param the matomo to update
   * @returns param matomo update
   */
  async update(updateMatomoParamDto: UpdateMatomoParamDto) {
    try {
      return await this.matomoParamRepository.findOneAndUpdate(
        { _id: updateMatomoParamDto._id },

        updateMatomoParamDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * @param id id to param matomo delete
   * @returns true or false as eliminated
   */
  async remove(id: string) {
    try {
      return await this.matomoParamRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }
}
