import {
  Put,
  Get,
  Body,
  Post,
  Param,
  UseGuards,
  Controller,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // create user
  @Post()
  @ApiCreatedResponse({ type: User })
  async createUser(@Body() body: CreateUserDto): Promise<User | undefined> {
    const user = await this.usersService.createUser(body);

    if (!user) {
      throw new BadRequestException();
    }

    return user;
  }

  // get user by username
  @Get('/byUserName/:username')
  @ApiOkResponse({ type: User })
  async findByEmail(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOne({ username: username });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  // get all users
  @Get()
  @ApiOkResponse({ type: User, isArray: true })
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  // update user
  @Put()
  @ApiOkResponse({ type: User, isArray: false })
  async updateUser(@Body() body: UpdateUserDto): Promise<User> {
    const user = this.usersService.updateUser(body);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
