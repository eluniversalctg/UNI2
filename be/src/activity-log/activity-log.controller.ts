import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ActivityLogService } from './activity-log.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('activityLog')
@Controller('activityLog')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get('/:screen')
  getActivityLog(@Param('screen') screen: string) {
    return this.activityLogService.getActivityLog(screen);
  }
}
