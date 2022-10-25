import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Rules')
@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post('/:param')
  createRules(
    @Body() createRuleDto: CreateRuleDto,
    @Param('param') param: string,
  ) {
    return this.ruleService.create(createRuleDto, param);
  }

  @Get('/:param')
  findAllRules(@Param('param') param: string) {
    return this.ruleService.findAllRules(param);
  }

  @Get('/mongo/:param')
  findAllRulesMongo(@Param('param') param: string) {
    return this.ruleService.findAllRulesMongo(param);
  }

  @Post('/sessions/get')
  getSessions(@Body() condition) {
    return this.ruleService.getSessions(condition);
  }

  @Post('/verify/Condition')
  verifyCondition(@Body() condition) {
    return this.ruleService.verifyCondition(condition);
  }

  @Get('/countSegments/:param')
  getCount(@Param('param') param: string) {
    return this.ruleService.getCountSegments(param);
  }

  @Get('/impactedSegments/:param')
  getImpacted(@Param('param') param: string) {
    return this.ruleService.getImpactedSegments(param);
  }

  @Get()
  async findAllSegments() {
    return this.ruleService.findAllSegments();
  }
}
