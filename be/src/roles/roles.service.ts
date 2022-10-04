import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { RollbarLogger } from 'nestjs-rollbar';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly rollbarLogger: RollbarLogger,
    private readonly rolesRepository: RolesRepository,
  ) {}

  /**
   * update to database role
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role | undefined> {
    try {
      return await this.rolesRepository.create(createRoleDto);
    } catch (error) {
      this.rollbarLogger.error(error, 'Roles - Error in create');
      return undefined;
    }
  }

  /**
   * get all role
   */
  async findAll(): Promise<Role[]> {
    try {
      return await this.rolesRepository.find({});
    } catch (error) {
      this.rollbarLogger.error(error, 'Roles - Error in findAll');
      return [];
    }
  }

  /**
   * get one role
   */
  async findOne(id: string): Promise<Role | undefined> {
    try {
      return await this.rolesRepository.findOne({ _id: id });
    } catch (error) {
      this.rollbarLogger.error(error, 'Roles - Error in findOne');
      return undefined;
    }
  }

  /**
   * update role according id
   */
  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    try {
      return await this.rolesRepository.findOneAndUpdate(
        { _id: id },
        updateRoleDto,
      );
    } catch (error) {
      this.rollbarLogger.error(error, 'Roles - Error in update');
      return undefined;
    }
  }

  /**
   * remove role according id
   */
  async remove(id: string): Promise<boolean> {
    try {
      return await this.rolesRepository.deleteMany({ _id: id });
    } catch (error) {
      this.rollbarLogger.error(error, 'Roles - Error in remove');
      return undefined;
    }
  }
}
