import {
  Put,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserFieldsService } from './user-fields.service';
import { CreateUserFieldDto } from './dto/create-user-field.dto';
import { UpdateUserFieldDto } from './dto/update-user-field.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('userFields')
@Controller('usersFields')
export class UserFieldsController {
  constructor(private readonly userfieldsService: UserFieldsService) {}

  @Post()
  create(@Body() createUserfieldDto: CreateUserFieldDto) {
    return this.userfieldsService.create(createUserfieldDto);
  }

  @Get()
  findAll() {
    return this.userfieldsService.findAll();
  }

  @Put()
  update(@Body() updateUserfieldDto: UpdateUserFieldDto) {
    return this.userfieldsService.update(updateUserfieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userfieldsService.remove(id);
  }
}
