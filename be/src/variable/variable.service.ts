import { Injectable } from '@nestjs/common';
import { Variable } from './entities/variable.entity';
import { VariableRepository } from './variable.repository';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';

@Injectable()
export class VariableService {
  constructor(private readonly variableRepository: VariableRepository) {}

  async create(
    createVariableDto: CreateVariableDto,
  ): Promise<Variable | undefined> {
    try {
      return await this.variableRepository.create(createVariableDto);
    } catch (error) {
      return undefined;
    }
  }

  async findAll(): Promise<Variable[]> {
    try {
      return await this.variableRepository.find({});
    } catch (error) {
      return [];
    }
  }

  async findOne(id: string): Promise<Variable | undefined> {
    try {
      return await this.variableRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  async update(
    updateVariableDto: UpdateVariableDto,
  ): Promise<Variable | undefined> {
    try {
      return await this.variableRepository.findOneAndUpdate(
        { _id: updateVariableDto._id },
        updateVariableDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      return await this.variableRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }
}
