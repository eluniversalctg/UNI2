import { FilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RollbarLogger } from 'nestjs-rollbar';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotUserDto } from './dto/forgot-user.dto';
import { PasswordEncrypterService } from 'src/utils/encryption/password-encrypter.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly rollbarLogger: RollbarLogger,
    private readonly usersRepository: UsersRepository,
    private encrypterService: PasswordEncrypterService,
  ) {}

  async findOne(filter: FilterQuery<User>): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne(filter, {});
    } catch (error) {
      this.rollbarLogger.error(error, 'Users - Error in findOne');
      return undefined;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({
        username: createUserDto.username,
      });

      if (user) {
        return undefined;
      }

      const password = createUserDto.password;
      const encryptedPassword = await this.encrypterService.hash(password);

      createUserDto.password = encryptedPassword;

      return await this.usersRepository.create(createUserDto);
    } catch (error) {
      this.rollbarLogger.error(error, 'Users - Error in createUser');
      return undefined;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find({}, 'roles');
    } catch (error) {
      this.rollbarLogger.error(error, 'Users - Error in findAll');
      return [];
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // *  the next validation is when the status of the user is updated and so do not update the password
      if (updateUserDto.password) {
        const password = updateUserDto.password;
        const encryptedPassword = await this.encrypterService.hash(password);
        updateUserDto.password = encryptedPassword;
      } else {
        delete updateUserDto.password;
      }

      return await this.usersRepository.findOneAndUpdate(
        { _id: updateUserDto._id },
        updateUserDto,
      );
    } catch (error) {
      this.rollbarLogger.error(error, 'Users - Error in updateUser');
      return undefined;
    }
  }

  async updateForgotUser(forgotUserDto: ForgotUserDto): Promise<User> {
    try {
      return await this.usersRepository.findOneAndUpdate(
        { _id: forgotUserDto._id },
        forgotUserDto,
      );
    } catch (error) {
      this.rollbarLogger.error(error, 'Users - Error in updateForgotUser');
      return undefined;
    }
  }
}
