import { Injectable } from '@nestjs/common';
import { UserFieldRepository } from './user-fields.repository';
import { CreateUserFieldDto } from './dto/create-user-field.dto';
import { UpdateUserFieldDto } from './dto/update-user-field.dto';

@Injectable()
export class UserFieldsService {
  constructor(private readonly userFieldRepository: UserFieldRepository) {}
  async create(createUserfieldDto: CreateUserFieldDto) {
    try {
      return await this.userFieldRepository.create(createUserfieldDto);
    } catch (error) {
      return undefined;
    }
  }

  async findAll() {
    try {
      return await this.userFieldRepository.find({});
    } catch (error) {
      return [];
    }
  }

  async update(updateUserfieldDto: UpdateUserFieldDto) {
    try {
      return await this.userFieldRepository.findOneAndUpdate(
        { _id: updateUserfieldDto._id },
        updateUserfieldDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  async remove(id: string) {
    try {
      return await this.userFieldRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }
}
