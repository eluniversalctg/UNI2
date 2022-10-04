import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConditionsService } from './conditions.service';
import { CreateConditionDto } from './dto/create-condition.dto';
import { Get, Post, Body, Controller, UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Conditions')
@Controller('conditions')
export class ConditionsController {
  constructor(private readonly conditionsService: ConditionsService) {}

  @Post()
  create(@Body() createConditionDto: CreateConditionDto) {
    return this.conditionsService.create(createConditionDto);
  }

  @Get()
  findAll() {
    return this.conditionsService.findAll();
  }
  @Get('/conditions')
  findConditions() {
    return this.conditionsService.findConditions();
  }
}
