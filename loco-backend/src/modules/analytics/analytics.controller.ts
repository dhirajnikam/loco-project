import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@Roles(UserRole.ADMIN, UserRole.EVALUATOR, UserRole.SUPERVISOR)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('test-performance')
  getTestPerformance(@Query('testType') testType?: string) {
    return this.analyticsService.getTestPerformance(testType);
  }
}
