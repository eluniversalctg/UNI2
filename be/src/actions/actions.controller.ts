import { ActionsService } from './actions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateActionDto } from './dto/create-action.dto';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('actions')
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}
  /**
   *
   * @param createActionDto
   * create new action and save database
   */
  @Post()
  create(@Body() createActionDto: CreateActionDto) {
    return this.actionsService.create(createActionDto);
  }

  /**
   *
   * get actions
   */
  @Get()
  findAll() {
    return this.actionsService.findAll();
  }
}
